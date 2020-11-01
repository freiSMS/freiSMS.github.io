'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "c36b6f9b3e7d3aadc72155b704178ed2",
"/": "c36b6f9b3e7d3aadc72155b704178ed2",
"main.dart.js": "2785d71d1c68fe75b3fb2d135b33388b",
"assets/img/kidsFaceCamera.jpeg": "96b9e712d0787f7e116a845466160eab",
"assets/img/pfalzakademieZimmer.jpg": "2c6b208a7aa51fc4f66fad4d502faa15",
"assets/img/buergerstube.jpg": "9a07d2d846c149a8bd596ae4e9967aa5",
"assets/img/mapsGemeinschaftshaus.png": "760485fb9822aaffa3ef731233de1c51",
"assets/img/startBild2.JPG": "a2704ad025845f787769e77526a6eeb6",
"assets/img/familySummer.jpeg": "ad0eb89e4fa24df1e96e4570e94f3898",
"assets/img/Ohler/Kueche-Bild1.jpg": "59a3f2f3716c924d35588f6582ca54bc",
"assets/img/Ohler/Wohnzimmer1.jpg": "a7d73eb4095837baf9657bb5e2e5af98",
"assets/img/Ohler/Kueche-Bild2.jpg": "1a1b539b945af7fa847489a449f5cfb1",
"assets/img/Ohler/Schlafzimmer1.jpg": "3f605a4f7860262c557f794bb3b8dde7",
"assets/img/Ohler/Wohnzimmer2.jpg": "579d130267f01f5de58f14055c3c4a43",
"assets/img/Ohler/Aussenansicht.jpg": "f685cef022d4241cf76d3750c9f00d72",
"assets/img/Ohler/Bad-Bild2.jpg": "09f5f84462b0581ae20880516757ff2d",
"assets/img/Frey/Aussenansicht.jpg": "4aaf5e16a30939dc7803529cc19de9b5",
"assets/img/dorfparkLindenberg.jpg": "9aaf881b218abc8a40e9e46db57068a8",
"assets/img/startBild.JPG": "a2704ad025845f787769e77526a6eeb6",
"assets/img/mapsDorfpark.PNG": "bc07ee5f98e44b038c0111a9666d01b4",
"assets/img/music/band.jpg": "7e37f0b061c3e7cbc025d74f5f414771",
"assets/img/food/hauptspeise.jpg": "4e6487e2e77eb997bdc23f609d3628c7",
"assets/img/food/dessert.jpg": "ad1697faa7745580050b9f2408d3fe0f",
"assets/img/food/vorspeise.jpg": "893599403c0331347e02ffe98e03b23b",
"assets/AssetManifest.json": "27abdcf56374f8c88fb648e27ede84d9",
"assets/NOTICES": "a6361ebc94d5e0041ecc77d6d74f511b",
"assets/FontManifest.json": "a9aec2800434cd883ce0fc51ca259ddc",
"assets/fonts/IndieFlower-Regular.ttf": "0841af952c807bdf56455b1addb4c7df",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/fonts/MyFlutterApp.ttf": "a831faa6b097a836f755a35de5b03cfb",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "23727faa9357c1c4eb9dc5cbd8cb6507",
"version.json": "3d693bc6abd68e67d0635a02ae5e78da"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
