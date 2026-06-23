import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve("images/manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byKey = new Map(manifest.map((entry, index) => [`${entry.kind}:${entry.group}:${entry.stage}:${entry.label}`, index]));

const stoneflyInsects = [
  {
    stage: "egg",
    label: "Stonefly eggs",
    file: "images/insects/stonefly/egg/stonefly-egg.png",
    source_page: "https://commons.wikimedia.org/wiki/File:Chinoperla_changjiangensis_(10.5852-ejt.2021.775.1547)_Figure_5.png",
    source_image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Chinoperla_changjiangensis_%2810.5852-ejt.2021.775.1547%29_Figure_5.png",
    commons_title: "File:Chinoperla changjiangensis Figure 5.png",
    description: "Stonefly eggs, scientific figure.",
    artist: "Mo, Liu, Wang, Li, and Muranyi",
    license: "CC BY 4.0",
    license_url: "https://creativecommons.org/licenses/by/4.0",
  },
  {
    stage: "nymph",
    label: "Stonefly nymph",
    file: "images/insects/stonefly/nymph/stonefly-nymph.png",
    source_page: "https://commons.wikimedia.org/wiki/File:Nymph_Gripopteryx_japi.png",
    source_image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Nymph_Gripopteryx_japi.png",
    commons_title: "File:Nymph Gripopteryx japi.png",
    description: "Stonefly nymph scientific figure.",
    artist: "Frpsarmento",
    license: "CC BY 4.0",
    license_url: "https://creativecommons.org/licenses/by/4.0",
  },
  {
    stage: "migrating-emerging-nymph",
    label: "Migrating / emerging stonefly nymph",
    file: "images/insects/stonefly/migrating-emerging-nymph/stonefly-migrating-emerging-nymph.png",
    source_page: "https://commons.wikimedia.org/wiki/File:Nymph_Gripopteryx_japi.png",
    source_image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Nymph_Gripopteryx_japi.png",
    commons_title: "File:Nymph Gripopteryx japi.png",
    description: "Representative stonefly nymph image reused for migrating/emerging nymph stage.",
    artist: "Frpsarmento",
    license: "CC BY 4.0",
    license_url: "https://creativecommons.org/licenses/by/4.0",
  },
  {
    stage: "adult",
    label: "Adult stonefly",
    file: "images/insects/stonefly/adult/stonefly-adult.png",
    source_page: "https://commons.wikimedia.org/wiki/File:Adult-of-Zapada-glacier.png",
    source_image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Adult-of-Zapada-glacier.png",
    commons_title: "File:Adult-of-Zapada-glacier.png",
    description: "Adult western glacier stonefly.",
    artist: "Clint Muhlfeld / U.S. Geological Survey",
    license: "Public domain",
    license_url: "",
  },
  {
    stage: "egg-laying-adult",
    label: "Egg-laying adult stonefly",
    file: "images/insects/stonefly/egg-laying-adult/stonefly-egg-laying-adult.png",
    source_page: "https://commons.wikimedia.org/wiki/File:Adult-of-Zapada-glacier.png",
    source_image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Adult-of-Zapada-glacier.png",
    commons_title: "File:Adult-of-Zapada-glacier.png",
    description: "Representative adult stonefly image reused for egg-laying adult stage.",
    artist: "Clint Muhlfeld / U.S. Geological Survey",
    license: "Public domain",
    license_url: "",
  },
];

for (const entry of stoneflyInsects) {
  const record = {
    kind: "insect",
    group: "stonefly",
    ...entry,
    file: path.resolve(entry.file),
  };
  const key = `${record.kind}:${record.group}:${record.stage}:${record.label}`;
  if (byKey.has(key)) {
    manifest[byKey.get(key)] = record;
  } else {
    byKey.set(key, manifest.length);
    manifest.push(record);
  }
}

const normalized = manifest.map((entry) => {
  const rawFile = entry.file === process.cwd() ? "" : entry.file;
  const record = {
    ...entry,
    file: rawFile?.startsWith("/") ? rawFile : rawFile ? path.resolve(rawFile) : "",
  };
  if (!record.file) {
    record.status = "not_sourced";
    delete record.error;
  }
  return record;
});

normalized.sort((a, b) => [
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

await writeFile(manifestPath, `${JSON.stringify(normalized, null, 2)}\n`);

const md = [
  "# Image Manifest",
  "",
  "Images are organized by `images/insects/<group>/<stage>/` and `images/imitations/<group>/<stage>/`.",
  "Source and license metadata were captured at download time where available.",
  "",
  "Web product images are useful local development references, but their usage rights are not verified.",
  "",
  "| Kind | Group | Stage | Label | File | Source | License |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...normalized.map((entry) => {
    const relativeFile = entry.file ? path.relative(process.cwd(), entry.file) : "";
    const source = entry.source_page ? `[source](${entry.source_page})` : entry.status || "missing";
    return `| ${entry.kind ?? ""} | ${entry.group ?? ""} | ${entry.stage ?? ""} | ${entry.label ?? ""} | ${relativeFile} | ${source} | ${entry.license ?? ""} |`;
  }),
  "",
];

await writeFile(path.resolve("images/MANIFEST.md"), md.join("\n"));
