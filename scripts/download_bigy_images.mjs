import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const BIG_Y_ORIGIN = "https://bigyflyco.com";
const manifestPath = path.resolve("images/manifest.json");

const usage = `Usage:
  node scripts/download_bigy_images.mjs --handle <product-handle> --group <insect> --stage <stage> --label <label>
  node scripts/download_bigy_images.mjs --term "<search term>" --group <insect> --stage <stage> --label <label>

Options:
  --kind <kind>          Defaults to "imitation"
  --image-index <n>      Product image index to download. Defaults to 0
  --filename <name>      Output filename. Defaults to a slug from the label and image extension
  --dry-run             Print the matched product and image without downloading

Examples:
  node scripts/download_bigy_images.mjs --term "Kaufmann Stone" --group stonefly --stage nymph --label "Kaufmann's Stone"
  node scripts/download_bigy_images.mjs --handle x-caddis-black --group caddisfly --stage pupa-emerger --label "X-Caddis"
`;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      args[key] = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function required(args, key) {
  if (!args[key]) {
    throw new Error(`Missing required --${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function absolutizeShopifyUrl(url) {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BIG_Y_ORIGIN}${url}`;
  return url;
}

async function curlText(url) {
  const { stdout } = await execFileAsync("curl", [
    "-L",
    "--fail",
    "--silent",
    "--show-error",
    "--user-agent",
    "flyPatterns Big Y image downloader (local development)",
    url,
  ], { maxBuffer: 30 * 1024 * 1024 });
  return stdout;
}

async function curlDownload(url, outPath) {
  await execFileAsync("curl", [
    "-L",
    "--fail",
    "--silent",
    "--show-error",
    "--user-agent",
    "flyPatterns Big Y image downloader (local development)",
    "--output",
    outPath,
    url,
  ], { maxBuffer: 30 * 1024 * 1024 });
}

async function fetchProduct(handle) {
  const body = await curlText(`${BIG_Y_ORIGIN}/products/${encodeURIComponent(handle)}.js`);
  return JSON.parse(body);
}

function extractHandlesFromSearchHtml(html) {
  const handles = new Set();
  for (const match of html.matchAll(/\/products\/([a-z0-9][a-z0-9-]*)(?:[?/"'<\\]|\\u0026|&)/gi)) {
    handles.add(match[1]);
  }
  for (const match of html.matchAll(/"handle":"([^"]+)"/g)) {
    handles.add(match[1]);
  }
  return [...handles];
}

function scoreProduct(product, term) {
  const queryTokens = normalize(term).split(/\s+/).filter(Boolean);
  const haystack = normalize(`${product.title ?? ""} ${product.handle ?? ""}`);
  if (!queryTokens.length) return 0;
  let score = 0;
  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 1;
  }
  if (haystack.includes(normalize(term))) score += 3;
  return score;
}

async function findProductByTerm(term) {
  const html = await curlText(`${BIG_Y_ORIGIN}/search?q=${encodeURIComponent(term)}`);
  const handles = extractHandlesFromSearchHtml(html);
  const products = [];
  for (const handle of handles) {
    try {
      products.push(await fetchProduct(handle));
    } catch {
      // Search pages contain some non-product handles in app payloads. Ignore those.
    }
  }
  products.sort((a, b) => scoreProduct(b, term) - scoreProduct(a, term));
  const product = products.find((candidate) => scoreProduct(candidate, term) > 0 && candidate.images?.length);
  if (!product) {
    throw new Error(`No Big Y product with an image matched search term: ${term}`);
  }
  return product;
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    return [];
  }
}

async function writeManifests(manifest) {
  const normalized = manifest.map((entry) => {
    const file = entry.file ? (entry.file.startsWith("/") ? entry.file : path.resolve(entry.file)) : "";
    return {
      ...entry,
      file,
      status: file ? entry.status : "not_sourced",
    };
  }).sort((a, b) => [
    a.kind,
    a.group,
    a.stage,
    a.label,
  ].join("/").localeCompare([
    b.kind,
    b.group,
    b.stage,
    b.label,
  ].join("/")));

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(normalized, null, 2)}\n`);

  const rows = normalized.map((entry) => {
    const relativeFile = entry.file ? path.relative(process.cwd(), entry.file) : "";
    const source = entry.source_page ? `[source](${entry.source_page})` : entry.status || "missing";
    return `| ${entry.kind ?? ""} | ${entry.group ?? ""} | ${entry.stage ?? ""} | ${entry.label ?? ""} | ${relativeFile} | ${source} | ${entry.license ?? ""} |`;
  });

  await writeFile(path.resolve("images/MANIFEST.md"), [
    "# Image Manifest",
    "",
    "Images are organized by `images/insects/<group>/<stage>/` and `images/imitations/<group>/<stage>/`.",
    "Source and license metadata were captured at download time where available.",
    "",
    "Web product images are useful local development references, but their usage rights are not verified.",
    "",
    "| Kind | Group | Stage | Label | File | Source | License |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage);
    return;
  }

  if (!args.handle && !args.term) {
    throw new Error("Provide either --handle or --term.\n\n" + usage);
  }
  required(args, "group");
  required(args, "stage");
  required(args, "label");

  const kind = args.kind ?? "imitation";
  const imageIndex = Number.parseInt(args.imageIndex ?? "0", 10);
  if (!Number.isInteger(imageIndex) || imageIndex < 0) {
    throw new Error("--image-index must be a non-negative integer");
  }

  const product = args.handle ? await fetchProduct(args.handle) : await findProductByTerm(args.term);
  const imageUrl = absolutizeShopifyUrl(product.images?.[imageIndex] ?? product.featured_image);
  if (!imageUrl) {
    throw new Error(`Matched product has no image at index ${imageIndex}: ${product.title}`);
  }

  const extension = path.extname(new URL(imageUrl).pathname) || ".jpg";
  const filename = args.filename ?? `${slugify(args.label)}${extension}`;
  const outDir = path.resolve("images", `${kind}s`, args.group, args.stage);
  const outPath = path.join(outDir, filename);
  const sourcePage = `${BIG_Y_ORIGIN}/products/${product.handle}`;

  if (args.dryRun) {
    console.log(JSON.stringify({
      product_title: product.title,
      product_handle: product.handle,
      source_page: sourcePage,
      source_image: imageUrl,
      output: outPath,
    }, null, 2));
    return;
  }

  await mkdir(outDir, { recursive: true });
  try {
    await access(outPath);
  } catch {
    await curlDownload(imageUrl, outPath);
  }

  const manifest = await loadManifest();
  const key = `${kind}:${args.group}:${args.stage}:${args.label}`;
  const record = {
    kind,
    group: args.group,
    stage: args.stage,
    label: args.label,
    file: outPath,
    source_page: sourcePage,
    source_image: imageUrl,
    source_title: product.title,
    source_type: "web product image",
    license: "Usage rights not verified; source page copyright applies",
  };
  const existingIndex = manifest.findIndex((entry) => `${entry.kind}:${entry.group}:${entry.stage}:${entry.label}` === key);
  if (existingIndex >= 0) {
    manifest[existingIndex] = record;
  } else {
    manifest.push(record);
  }
  await writeManifests(manifest);
  console.log(`downloaded: ${kind}/${args.group}/${args.stage}/${args.label}`);
  console.log(`file: ${path.relative(process.cwd(), outPath)}`);
  console.log(`source: ${sourcePage}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
