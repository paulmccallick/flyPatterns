import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const manifestPath = path.resolve("images/manifest.json");

const entries = [
  {
    group: "caddisfly",
    stage: "larva",
    label: "Walt's Worm",
    file: "walts-worm.webp",
    source_page: "https://jacksonholeflycompany.com/products/tungsten-bead-walts-worm-jig",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Tungsten_Bead_Walt_s_Worm_Jig_Jackson_Hole_Fly_Company.webp?v=1769718488",
    source_title: "Tungsten Bead Walt's Worm Jig",
  },
  {
    group: "caddisfly",
    stage: "larva",
    label: "Cased Caddis",
    file: "cased-caddis.jpg",
    source_page: "https://bigyflyco.com/products/cased-caddis",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/cased_caddis.jpg?v=1685019492",
    source_title: "Cased Caddis",
  },
  {
    group: "caddisfly",
    stage: "pupa-emerger",
    label: "X-Caddis",
    file: "x-caddis.jpg",
    source_page: "https://bigyflyco.com/products/x-caddis-black",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/X_Caddis_Tan.jpg?v=1684933315",
    source_title: "X Caddis - Dry Fly",
  },
  {
    group: "caddisfly",
    stage: "pupa-emerger",
    label: "Deep Sparkle Pupa",
    file: "emergent-sparkle-pupa.jpg",
    source_page: "https://bigyflyco.com/products/emergent-sparkle-pupa",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/Emergent_Sparkle_Pupa_tan_0c7276e3-65c0-40c5-9acb-06129a69ee73.jpg?v=1684932444",
    source_title: "Emergent Sparkle Pupa",
  },
  {
    group: "caddisfly",
    stage: "adult",
    label: "Elk Hair Caddis",
    file: "elk-hair-caddis.webp",
    source_page: "https://jacksonholeflycompany.com/products/elk-hair-caddis",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Elk_Hair_Caddis_Jackson_Hole_Fly_Company.webp?v=1752036398",
    source_title: "Elk Hair Caddis",
  },
  {
    group: "mayfly",
    stage: "nymph",
    label: "Pheasant Tail Nymph",
    file: "pheasant-tail-nymph.jpg",
    source_page: "https://jacksonholeflycompany.com/products/pheasant-tail-nymph",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/pheasant-tail-nymph-or-jackson-hole-fly-company.jpg?v=1719959301",
    source_title: "Pheasant Tail Nymph",
  },
  {
    group: "mayfly",
    stage: "nymph",
    label: "Gold Ribbed Hare's Ear",
    file: "gold-ribbed-hares-ear-nymph.webp",
    source_page: "https://jacksonholeflycompany.com/products/gold-ribbed-hares-ear-nymph",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Gold_Ribbed_Hares_Ear_Nymph_Jackson_Hole_Fly_Company.webp?v=1752036513",
    source_title: "Gold Ribbed Hare's Ear Nymph",
  },
  {
    group: "mayfly",
    stage: "nymph",
    label: "Copper John",
    file: "copper-john.webp",
    source_page: "https://jacksonholeflycompany.com/products/copper-john",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Copper_John_Jackson_Hole_Fly_Company.webp?v=1752036346",
    source_title: "Copper John",
  },
  {
    group: "mayfly",
    stage: "nymph",
    label: "Baetis Nymph",
    file: "baetis-nymph-olive.webp",
    source_page: "https://jacksonholeflycompany.com/products/hendersons-master-baetis-olive",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/henderson-s-master-baetis-olive-or-jackson-hole-fly-company.webp?v=1719959614",
    source_title: "Henderson's Master Baetis - Olive",
  },
  {
    group: "mayfly",
    stage: "emerger",
    label: "RS2",
    file: "rs2.webp",
    source_page: "https://jacksonholeflycompany.com/products/rs2",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/RS2_Jackson_Hole_Fly_Company.webp?v=1746470723",
    source_title: "RS2",
  },
  {
    group: "mayfly",
    stage: "emerger",
    label: "WD-40",
    file: "wd-40-olive.webp",
    source_page: "https://jacksonholeflycompany.com/products/wd40-olive",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/wd40-olive-or-jackson-hole-fly-company.webp?v=1719958946",
    source_title: "WD-40 - Olive",
  },
  {
    group: "mayfly",
    stage: "emerger",
    label: "Sparkle Dun",
    file: "sparkle-dun.webp",
    source_page: "https://jacksonholeflycompany.com/products/sparkle-dun",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/pink-sparkle-dun-or-jackson-hole-fly-company.webp?v=1720797760",
    source_title: "Sparkle Dun",
  },
  {
    group: "mayfly",
    stage: "emerger",
    label: "Barr's Emerger",
    file: "barrs-emerger-pmd.jpg",
    source_page: "https://bigyflyco.com/products/barrs-emerger-pmd",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/barrs_emerger_pmd.jpg?v=1685020001",
    source_title: "Barr's Emerger PMD",
  },
  {
    group: "mayfly",
    stage: "dun",
    label: "Parachute Adams",
    file: "parachute-adams.jpg",
    source_page: "https://jacksonholeflycompany.com/products/parachute-adams",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/parachute-adams-or-jackson-hole-fly-company.jpg?v=1719958707",
    source_title: "Parachute Adams",
  },
  {
    group: "mayfly",
    stage: "dun",
    label: "Blue Wing Olive",
    file: "blue-winged-olive.webp",
    source_page: "https://jacksonholeflycompany.com/products/blue-wing-olive",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Blue_Winged_Olive_Jackson_Hole_Fly_Company.webp?v=1752036246",
    source_title: "Blue-Winged Olive",
  },
  {
    group: "mayfly",
    stage: "dun",
    label: "Comparadun",
    file: "comparadun.jpg",
    source_page: "https://bigyflyco.com/products/comparadun",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/Comparadun_Brown1.jpg?v=1684932025",
    source_title: "Comparadun",
  },
  {
    group: "mayfly",
    stage: "spinner",
    label: "Rusty Spinner",
    file: "rusty-spinner.webp",
    source_page: "https://jacksonholeflycompany.com/products/rusty-spinner",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Rusty_Spinner_Jackson_Hole_Fly_Company.webp?v=1750119015",
    source_title: "Rusty Spinner",
  },
  {
    group: "mayfly",
    stage: "spinner",
    label: "Trico Spinner",
    file: "trico-spinner.webp",
    source_page: "https://jacksonholeflycompany.com/products/trico-spinner",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/trico-spinner-or-jackson-hole-fly-company.webp?v=1720797507",
    source_title: "Trico Spinner",
  },
  {
    group: "stonefly",
    stage: "nymph",
    label: "Pat's Rubber Legs",
    file: "pats-rubber-legs.webp",
    source_page: "https://jacksonholeflycompany.com/products/rootbeer-rubber-legs",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/rootbeer-rubber-legs-or-jackson-hole-fly-company.webp?v=1719959251",
    source_title: "Rubber Legs - Rootbeer",
  },
  {
    group: "stonefly",
    stage: "nymph",
    label: "Girdle Bug",
    file: "girdle-bug.webp",
    source_page: "https://jacksonholeflycompany.com/products/girdle-bug",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/girdle-bug-or-jackson-hole-fly-company.webp?v=1719958738",
    source_title: "Girdle Bug",
  },
  {
    group: "stonefly",
    stage: "nymph",
    label: "Bitch Creek Nymph",
    file: "bitch-creek-nymph.webp",
    source_page: "https://jacksonholeflycompany.com/products/bitch-creek",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/Bitch_Creek_Nymph_Jackson_Hole_Fly_Company.webp?v=1778095623",
    source_title: "Bitch Creek Nymph",
  },
  {
    group: "stonefly",
    stage: "nymph",
    label: "Kaufmann's Stone",
    file: "kaufmanns-stone-beadhead.jpg",
    source_page: "https://bigyflyco.com/products/kaufmann-stone-beadhead",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/Kaufmann_Stone_Beadhead_Black.jpg?v=1684932293",
    source_title: "Kaufmann Stone-Beadhead",
  },
  {
    group: "stonefly",
    stage: "adult",
    label: "Chubby Chernobyl",
    file: "chubby-chernobyl-tan.jpg",
    source_page: "https://jacksonholeflycompany.com/products/tan-old-man-tan-chubby-chernobyl",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/files/tan-old-man-tan-chubby-chernobyl-or-jackson-hole-fly-company.jpg?v=1719959452",
    source_title: "Chubby Chernobyl - Tan",
  },
  {
    group: "stonefly",
    stage: "adult",
    label: "Sofa Pillow",
    file: "sofa-pillow.jpg",
    source_page: "https://jacksonholeflycompany.com/products/sofa-pillow",
    source_image: "https://cdn.shopify.com/s/files/1/0142/0161/8518/products/sofa-pillow-or-jackson-hole-fly-company.jpg?v=1719958546",
    source_title: "Sofa Pillow",
  },
  {
    group: "stonefly",
    stage: "adult",
    label: "Rogue Foam Stone",
    file: "rogue-foam-stone.jpg",
    source_page: "https://bigyflyco.com/products/rogue-foam-salmonfly",
    source_image: "https://cdn.shopify.com/s/files/1/0696/9874/8700/products/Rogue_Foam_Salmonfly_20_1_20of_201_8de7d978-03ca-4473-a000-eea8222a92d3.jpg?v=1684933460",
    source_title: "Rogue Foam Golden Stonefly",
  },
];

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byKey = new Map(manifest.map((entry, index) => [`${entry.kind}:${entry.group}:${entry.stage}:${entry.label}`, index]));

for (const entry of entries) {
  const outDir = path.resolve("images", "imitations", entry.group, entry.stage);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, entry.file);
  try {
    await access(outPath);
  } catch {
    await execFileAsync("curl", [
      "-L",
      "--fail",
      "--silent",
      "--output",
      outPath,
      entry.source_image,
    ]);
  }
  const record = {
    kind: "imitation",
    group: entry.group,
    stage: entry.stage,
    label: entry.label,
    file: outPath,
    source_page: entry.source_page,
    source_image: entry.source_image,
    source_title: entry.source_title,
    source_type: "web product image",
    license: "Usage rights not verified; source page copyright applies",
  };
  const key = `${record.kind}:${record.group}:${record.stage}:${record.label}`;
  if (byKey.has(key)) {
    manifest[byKey.get(key)] = record;
  } else {
    byKey.set(key, manifest.length);
    manifest.push(record);
  }
  console.log(`downloaded: ${entry.group}/${entry.stage}/${entry.label}`);
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
