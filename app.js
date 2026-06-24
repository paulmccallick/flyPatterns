const insects = [
  {
    id: "caddisfly",
    title: "Caddis",
    stages: [
      {
        key: "larva",
        title: "Larva",
        insect: "images/insects/caddisfly/larva/caddisfly-larva.jpg",
        patterns: [
          ["Green Rock Worm", "images/imitations/caddisfly/larva/green-rock-worm.jpg", "Wet"],
          ["Bead Head Caddis Larva", "images/imitations/caddisfly/larva/bead-head-caddis-larva.jpg", "Wet"],
          ["Cased Caddis", "images/imitations/caddisfly/larva/cased-caddis.jpg", "Wet"],
          ["Walt's Worm", "images/imitations/caddisfly/larva/walts-worm.webp", "Wet"],
        ],
      },
      {
        key: "pupa-emerger",
        title: "Pupa / Emerger",
        insect: "images/insects/caddisfly/pupa-emerger/caddisfly-pupa-emerger.jpg",
        patterns: [
          ["LaFontaine Sparkle Pupa", "images/imitations/caddisfly/pupa-emerger/lafontaine-sparkle-pupa.jpg", "Wet"],
          ["Deep Sparkle Pupa", "images/imitations/caddisfly/pupa-emerger/emergent-sparkle-pupa.jpg", "Wet"],
          ["Soft Hackle Caddis", "images/imitations/caddisfly/pupa-emerger/soft-hackle-caddis.jpg", "Wet"],
          ["X-Caddis", "images/imitations/caddisfly/pupa-emerger/x-caddis.jpg", "Dry"],
        ],
      },
      {
        key: "adult",
        title: "Adult",
        insect: "images/insects/caddisfly/adult/caddisfly-adult.jpg",
        patterns: [
          ["Elk Hair Caddis", "images/imitations/caddisfly/adult/elk-hair-caddis.webp", "Dry"],
          ["Henryville Special", "images/imitations/caddisfly/adult/henryville-special.jpg", "Dry"],
          ["X-Caddis", "images/imitations/caddisfly/pupa-emerger/x-caddis.jpg", "Dry"],
          ["CDC & Elk", "images/imitations/caddisfly/adult/cdc-and-elk.jpg", "Dry"],
        ],
      },
    ],
  },
  {
    id: "mayfly",
    title: "Mayfly",
    stages: [
      {
        key: "nymph",
        title: "Nymph",
        insect: "images/insects/mayfly/nymph/mayfly-nymph.jpg",
        patterns: [
          ["Pheasant Tail Nymph", "images/imitations/mayfly/nymph/pheasant-tail-nymph.jpg", "Wet"],
          ["Gold Ribbed Hare's Ear", "images/imitations/mayfly/nymph/gold-ribbed-hares-ear-nymph.webp", "Wet"],
          ["Copper John", "images/imitations/mayfly/nymph/copper-john.webp", "Wet"],
          ["Baetis Nymph", "images/imitations/mayfly/nymph/baetis-nymph-olive.webp", "Wet"],
        ],
      },
      {
        key: "emerger",
        title: "Emerger",
        insect: "images/insects/mayfly/emerger/mayfly-emerger.jpg",
        patterns: [
          ["RS2", "images/imitations/mayfly/emerger/rs2.webp", "Wet"],
          ["WD-40", "images/imitations/mayfly/emerger/wd-40-olive.webp", "Wet"],
          ["Barr's Emerger", "images/imitations/mayfly/emerger/barrs-emerger-pmd.jpg", "Wet"],
          ["Sparkle Dun", "images/imitations/mayfly/emerger/sparkle-dun.webp", "Dry"],
        ],
      },
      {
        key: "dun",
        title: "Dun",
        insect: "images/insects/mayfly/dun/mayfly-dun.jpg",
        patterns: [
          ["Parachute Adams", "images/imitations/mayfly/dun/parachute-adams.jpg", "Dry"],
          ["Comparadun", "images/imitations/mayfly/dun/comparadun.jpg", "Dry"],
          ["Pale Morning Dun", "images/imitations/mayfly/dun/pale-morning-dun.jpg", "Dry"],
          ["Blue Wing Olive", "images/imitations/mayfly/dun/blue-winged-olive.webp", "Dry"],
        ],
      },
      {
        key: "spinner",
        title: "Spinner",
        insect: "images/insects/mayfly/spinner/mayfly-spinner.jpg",
        patterns: [
          ["Rusty Spinner", "images/imitations/mayfly/spinner/rusty-spinner.webp", "Dry"],
          ["Trico Spinner", "images/imitations/mayfly/spinner/trico-spinner.webp", "Dry"],
          ["Blue Wing Olive Spinner", "images/imitations/mayfly/spinner/blue-wing-olive-spinner.jpg", "Dry"],
          ["Pale Morning Dun Spinner", "images/imitations/mayfly/spinner/pale-morning-dun-spinner.jpg", "Dry"],
        ],
      },
    ],
  },
  {
    id: "stonefly",
    title: "Stonefly",
    stages: [
      {
        key: "nymph",
        title: "Nymph",
        insect: "images/insects/stonefly/nymph/stonefly-nymph.png",
        patterns: [
          ["Pat's Rubber Legs", "images/imitations/stonefly/nymph/pats-rubber-legs.webp", "Wet"],
          ["Girdle Bug", "images/imitations/stonefly/nymph/girdle-bug.webp", "Wet"],
          ["Kaufmann's Stone", "images/imitations/stonefly/nymph/kaufmanns-stone-beadhead.jpg", "Wet"],
          ["Bitch Creek Nymph", "images/imitations/stonefly/nymph/bitch-creek-nymph.webp", "Wet"],
        ],
      },
      {
        key: "adult",
        title: "Adult",
        insect: "images/insects/stonefly/adult/stonefly-adult.png",
        patterns: [
          ["Chubby Chernobyl", "images/imitations/stonefly/adult/chubby-chernobyl-tan.jpg", "Dry"],
          ["Golden Stone", "images/imitations/stonefly/adult/golden-stone.jpg", "Dry"],
          ["Yellow Sally", "images/imitations/stonefly/adult/yellow-sally.jpg", "Dry"],
          ["Sofa Pillow", "images/imitations/stonefly/adult/sofa-pillow.jpg", "Dry"],
          ["Parks' Salmonfly", "images/imitations/stonefly/adult/parks-salmonfly.jpg", "Dry"],
          ["Rogue Foam Stone", "images/imitations/stonefly/adult/rogue-foam-stone.jpg", "Dry"],
        ],
      },
    ],
  },
];

const app = document.querySelector("#app");

function imageMarkup(src, alt) {
  if (!src) {
    return `<div class="missing-image">No image</div>`;
  }
  return `<img src="${src}" alt="${alt}" loading="lazy">`;
}

function patternMarkup(patterns) {
  if (!patterns.length) {
    return `<div class="empty-patterns">No common fly pattern for this stage</div>`;
  }
  return `
    <div class="patterns">
      ${patterns.map(([name, src, method]) => `
        <article class="pattern-card pattern-${method.toLowerCase()}">
          ${imageMarkup(src, name)}
          <div class="pattern-meta">
            <div class="pattern-name">${name}</div>
            <span class="pattern-method">${method}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function stageMarkup(stage) {
  return `
    <article class="stage-row">
      <div class="stage-insect">
        <div class="insect-image">
          ${imageMarkup(stage.insect, stage.title)}
        </div>
        <h3 class="stage-title">${stage.title}</h3>
      </div>
      <div class="pattern-panel">
        ${patternMarkup(stage.patterns)}
      </div>
    </article>
  `;
}

app.innerHTML = insects.map((insect) => `
  <section class="insect-section" id="${insect.id}">
    <div class="section-heading">
      <h2>${insect.title}</h2>
      <span class="stage-count">${insect.stages.length} stages</span>
    </div>
    ${insect.stages.map(stageMarkup).join("")}
  </section>
`).join("");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}
