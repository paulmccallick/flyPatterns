const ASSET_VERSION = "v11";
const CACHE_NAME = `fly-patterns-offline-${ASSET_VERSION}`;
const BASE_PATH = new URL(self.registration.scope).pathname;
const APP_SHELL = `${BASE_PATH}index.html`;
const NETWORK_TIMEOUT_MS = 1500;

const OFFLINE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=2",
  "./app.js",
  "./site.webmanifest?v=2",
  "./icons/app-icon-v2.svg",
  "./icons/app-icon-v2-192.png",
  "./icons/app-icon-v2-512.png",
  "./images/imitations/caddisfly/adult/cdc-and-elk.jpg",
  "./images/imitations/caddisfly/adult/elk-hair-caddis.webp",
  "./images/imitations/caddisfly/adult/henryville-special.jpg",
  "./images/imitations/caddisfly/larva/bead-head-caddis-larva.jpg",
  "./images/imitations/caddisfly/larva/cased-caddis.jpg",
  "./images/imitations/caddisfly/larva/green-rock-worm.jpg",
  "./images/imitations/caddisfly/larva/walts-worm.webp",
  "./images/imitations/caddisfly/pupa-emerger/emergent-sparkle-pupa.jpg",
  "./images/imitations/caddisfly/pupa-emerger/lafontaine-sparkle-pupa.jpg",
  "./images/imitations/caddisfly/pupa-emerger/soft-hackle-caddis.jpg",
  "./images/imitations/caddisfly/pupa-emerger/x-caddis.jpg",
  "./images/imitations/mayfly/dun/blue-winged-olive.webp",
  "./images/imitations/mayfly/dun/comparadun.jpg",
  "./images/imitations/mayfly/dun/pale-morning-dun.jpg",
  "./images/imitations/mayfly/dun/parachute-adams.jpg",
  "./images/imitations/mayfly/emerger/barrs-emerger-pmd.jpg",
  "./images/imitations/mayfly/emerger/rs2.webp",
  "./images/imitations/mayfly/emerger/sparkle-dun.webp",
  "./images/imitations/mayfly/emerger/wd-40-olive.webp",
  "./images/imitations/mayfly/nymph/baetis-nymph-olive.webp",
  "./images/imitations/mayfly/nymph/copper-john.webp",
  "./images/imitations/mayfly/nymph/gold-ribbed-hares-ear-nymph.webp",
  "./images/imitations/mayfly/nymph/pheasant-tail-nymph.jpg",
  "./images/imitations/mayfly/spinner/blue-wing-olive-spinner.jpg",
  "./images/imitations/mayfly/spinner/pale-morning-dun-spinner.jpg",
  "./images/imitations/mayfly/spinner/rusty-spinner.webp",
  "./images/imitations/mayfly/spinner/trico-spinner.webp",
  "./images/imitations/stonefly/adult/chubby-chernobyl-tan.jpg",
  "./images/imitations/stonefly/adult/golden-stone.jpg",
  "./images/imitations/stonefly/adult/yellow-sally.jpg",
  "./images/imitations/stonefly/adult/parks-salmonfly.jpg",
  "./images/imitations/stonefly/adult/rogue-foam-stone.jpg",
  "./images/imitations/stonefly/adult/sofa-pillow.jpg",
  "./images/imitations/stonefly/nymph/bitch-creek-nymph.webp",
  "./images/imitations/stonefly/nymph/girdle-bug.webp",
  "./images/imitations/stonefly/nymph/kaufmanns-stone-beadhead.jpg",
  "./images/imitations/stonefly/nymph/pats-rubber-legs.webp",
  "./images/insects/caddisfly/adult/caddisfly-adult.jpg",
  "./images/insects/caddisfly/larva/caddisfly-larva.jpg",
  "./images/insects/caddisfly/pupa-emerger/caddisfly-pupa-emerger.jpg",
  "./images/insects/mayfly/dun/mayfly-dun.jpg",
  "./images/insects/mayfly/emerger/mayfly-emerger.jpg",
  "./images/insects/mayfly/nymph/mayfly-nymph.jpg",
  "./images/insects/mayfly/spinner/mayfly-spinner.jpg",
  "./images/insects/stonefly/adult/stonefly-adult.png",
  "./images/insects/stonefly/nymph/stonefly-nymph.png"
];

function assetUrl(path) {
  return new URL(path, self.registration.scope).toString();
}

async function fetchWithTimeout(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);

  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function cacheResponse(request, response) {
  if (!response || !response.ok) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

async function cachedResponse(request) {
  return caches.match(request).then((cached) => cached || Response.error());
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_ASSETS.map(assetUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetchWithTimeout(request)
        .then((response) => {
          event.waitUntil(cacheResponse(APP_SHELL, response));
          return response;
        })
        .catch(() => cachedResponse(APP_SHELL))
    );
    return;
  }

  event.respondWith(
    fetchWithTimeout(request)
      .then((response) => {
        event.waitUntil(cacheResponse(request, response));
        return response;
      })
      .catch(() => cachedResponse(request))
  );
});
