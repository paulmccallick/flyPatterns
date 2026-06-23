import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const root = path.resolve("images");
const execFileAsync = promisify(execFile);

const insectItems = [
  ["caddisfly", "egg", "Caddisfly eggs", "caddisfly egg mass"],
  ["caddisfly", "larva", "Caddisfly larva", "caddisfly larva case"],
  ["caddisfly", "pupa-emerger", "Caddisfly pupa / emerger", "caddisfly pupa"],
  ["caddisfly", "adult", "Adult caddisfly", "adult caddisfly"],
  ["caddisfly", "egg-laying-adult", "Egg-laying adult caddisfly", "adult caddisfly water"],
  ["mayfly", "egg", "Mayfly eggs", "mayfly eggs"],
  ["mayfly", "nymph", "Mayfly nymph", "mayfly nymph"],
  ["mayfly", "emerger", "Mayfly emerger", "mayfly emerging subimago"],
  ["mayfly", "dun", "Mayfly dun / subimago", "mayfly subimago"],
  ["mayfly", "spinner", "Mayfly spinner / imago", "mayfly imago"],
  ["stonefly", "egg", "Stonefly eggs", "stonefly eggs"],
  ["stonefly", "nymph", "Stonefly nymph", "stonefly nymph"],
  ["stonefly", "migrating-emerging-nymph", "Migrating / emerging stonefly nymph", "stonefly emerging nymph exuvia"],
  ["stonefly", "adult", "Adult stonefly", "adult stonefly"],
  ["stonefly", "egg-laying-adult", "Egg-laying adult stonefly", "adult stonefly eggs"],
].map(([group, stage, label, query]) => ({
  kind: "insect",
  group,
  stage,
  label,
  query,
  outDir: path.join(root, "insects", group, stage),
  slug: `${group}-${stage}`,
}));

const imitationItems = [
  ["caddisfly", "larva", "Green Rock Worm", "Green Rock Worm fly pattern"],
  ["caddisfly", "larva", "Bead Head Caddis Larva", "Bead Head Caddis Larva fly"],
  ["caddisfly", "larva", "Cased Caddis", "Cased Caddis fly pattern"],
  ["caddisfly", "larva", "Walt's Worm", "Walt's Worm fly pattern"],
  ["caddisfly", "pupa-emerger", "LaFontaine Sparkle Pupa", "LaFontaine Sparkle Pupa fly"],
  ["caddisfly", "pupa-emerger", "Deep Sparkle Pupa", "Deep Sparkle Pupa fly"],
  ["caddisfly", "pupa-emerger", "Soft Hackle Caddis", "Soft Hackle Caddis fly"],
  ["caddisfly", "pupa-emerger", "X-Caddis", "X-Caddis fly"],
  ["caddisfly", "adult", "Elk Hair Caddis", "Elk Hair Caddis"],
  ["caddisfly", "adult", "Henryville Special", "Henryville Special fly"],
  ["caddisfly", "adult", "CDC & Elk", "CDC Elk fly"],
  ["caddisfly", "egg-laying-adult", "Diving Caddis", "Diving Caddis fly"],
  ["mayfly", "nymph", "Pheasant Tail Nymph", "Pheasant Tail Nymph"],
  ["mayfly", "nymph", "Gold Ribbed Hare's Ear", "Gold Ribbed Hare's Ear"],
  ["mayfly", "nymph", "Copper John", "Copper John fly"],
  ["mayfly", "nymph", "Baetis Nymph", "Baetis Nymph fly"],
  ["mayfly", "emerger", "RS2", "RS2 fly pattern"],
  ["mayfly", "emerger", "WD-40", "WD-40 fly pattern"],
  ["mayfly", "emerger", "Barr's Emerger", "Barr's Emerger fly"],
  ["mayfly", "emerger", "Sparkle Dun", "Sparkle Dun fly"],
  ["mayfly", "dun", "Parachute Adams", "Parachute Adams fly"],
  ["mayfly", "dun", "Comparadun", "Comparadun fly"],
  ["mayfly", "dun", "Blue Wing Olive", "Blue Wing Olive fly"],
  ["mayfly", "spinner", "Rusty Spinner", "Rusty Spinner fly"],
  ["mayfly", "spinner", "Trico Spinner", "Trico Spinner fly"],
  ["mayfly", "spinner", "Blue Wing Olive Spinner", "Blue Wing Olive Spinner fly"],
  ["mayfly", "spinner", "Pale Morning Dun Spinner", "Pale Morning Dun Spinner fly"],
  ["stonefly", "nymph", "Pat's Rubber Legs", "Pat's Rubber Legs fly"],
  ["stonefly", "nymph", "Girdle Bug", "Girdle Bug fly"],
  ["stonefly", "nymph", "Kaufmann's Stone", "Kaufmann Stone fly"],
  ["stonefly", "nymph", "Bitch Creek Nymph", "Bitch Creek Nymph fly"],
  ["stonefly", "adult", "Chubby Chernobyl", "Chubby Chernobyl fly"],
  ["stonefly", "adult", "Sofa Pillow", "Sofa Pillow fly"],
  ["stonefly", "adult", "Parks' Salmonfly", "Parks Salmonfly"],
  ["stonefly", "adult", "Rogue Foam Stone", "Rogue Foam Stone fly"],
].map(([group, stage, label, query]) => ({
  kind: "imitation",
  group,
  stage,
  label,
  query,
  outDir: path.join(root, "imitations", group, stage),
  slug: slugify(label),
}));

const items = [...insectItems, ...imitationItems];
const usedUrls = new Set();
const manifest = [];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function commonsSearch(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: query,
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    format: "json",
    origin: "*",
  });
  const { stdout } = await execFileAsync("curl", [
    "-L",
    "--globoff",
    "--fail",
    "--silent",
    "--retry",
    "3",
    "--retry-delay",
    "1",
    "--user-agent",
    "flyPatterns image library builder (local development)",
    `https://commons.wikimedia.org/w/api.php?${params}`,
  ], { maxBuffer: 20 * 1024 * 1024 });
  const data = JSON.parse(stdout);
  const pages = Object.values(data.query?.pages ?? {});
  return pages
    .filter((page) => page.imageinfo?.[0]?.mime?.startsWith("image/"))
    .sort((a, b) => (a.index ?? 999) - (b.index ?? 999));
}

async function download(item, page) {
  const info = page.imageinfo[0];
  if (usedUrls.has(info.url)) return null;
  const ext = path.extname(new URL(info.url).pathname).toLowerCase() || ".jpg";
  const outPath = path.join(item.outDir, `${item.slug}${ext}`);
  await mkdir(item.outDir, { recursive: true });
  await execFileAsync("curl", [
    "-L",
    "--globoff",
    "--fail",
    "--silent",
    "--retry",
    "3",
    "--retry-delay",
    "1",
    "--user-agent",
    "flyPatterns image library builder (local development)",
    "--output",
    outPath,
    info.url,
  ], {
    maxBuffer: 20 * 1024 * 1024,
  });
  usedUrls.add(info.url);
  const meta = info.extmetadata ?? {};
  return {
    kind: item.kind,
    group: item.group,
    stage: item.stage,
    label: item.label,
    query: item.query,
    file: outPath,
    source_page: info.descriptionurl,
    source_image: info.url,
    commons_title: page.title,
    description: stripHtml(meta.ImageDescription?.value),
    artist: stripHtml(meta.Artist?.value),
    credit: stripHtml(meta.Credit?.value),
    license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value),
    license_url: meta.LicenseUrl?.value ?? "",
  };
}

await mkdir(root, { recursive: true });

for (const item of items) {
  try {
    await delay(900);
    const pages = await commonsSearch(item.query);
    let record = null;
    for (const page of pages) {
      record = await download(item, page);
      if (record) break;
    }
    manifest.push(record ?? { ...item, status: "missing", file: "" });
    console.log(`${record ? "downloaded" : "missing"}: ${item.kind}/${item.group}/${item.stage}/${item.label}`);
  } catch (error) {
    manifest.push({ ...item, status: "error", error: error.message, file: "" });
    console.error(`error: ${item.label}: ${error.message}`);
  }
}

await writeFile(path.join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const md = [
  "# Image Manifest",
  "",
  "Images are organized by `images/insects/<group>/<stage>/` and `images/imitations/<group>/<stage>/`.",
  "Source and license metadata were captured at download time.",
  "",
  "| Kind | Group | Stage | Label | File | Source | License |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...manifest.map((entry) => {
    const file = entry.file || "";
    const source = entry.source_page ? `[source](${entry.source_page})` : entry.status || "missing";
    return `| ${entry.kind} | ${entry.group} | ${entry.stage} | ${entry.label} | ${file} | ${source} | ${entry.license ?? ""} |`;
  }),
  "",
];
await writeFile(path.join(root, "MANIFEST.md"), md.join("\n"));
