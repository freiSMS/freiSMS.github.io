'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/assets\AssetManifest.json": "fa1b6efa66551086926fe3a3bdb30bfe",
"/assets\FontManifest.json": "fd2c0e7518d35973b7a9d5374b1fe223",
"/assets\fonts\IndieFlower-Regular.ttf": "0841af952c807bdf56455b1addb4c7df",
"/assets\fonts\MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"/assets\fonts\MyFlutterApp.ttf": "a831faa6b097a836f755a35de5b03cfb",
"/assets\img\buergerstube.jpg": "9a07d2d846c149a8bd596ae4e9967aa5",
"/assets\img\dorfparkLindenberg.jpg": "9aaf881b218abc8a40e9e46db57068a8",
"/assets\img\familySummer.jpeg": "ad0eb89e4fa24df1e96e4570e94f3898",
"/assets\img\food\dessert.jpg": "ad1697faa7745580050b9f2408d3fe0f",
"/assets\img\food\hauptspeise.jpg": "4e6487e2e77eb997bdc23f609d3628c7",
"/assets\img\food\vorspeise.jpg": "893599403c0331347e02ffe98e03b23b",
"/assets\img\frey\Aussenansicht.jpg": "4aaf5e16a30939dc7803529cc19de9b5",
"/assets\img\kidsFaceCamera.jpeg": "96b9e712d0787f7e116a845466160eab",
"/assets\img\mapsDorfpark.PNG": "bc07ee5f98e44b038c0111a9666d01b4",
"/assets\img\mapsGemeinschaftshaus.png": "760485fb9822aaffa3ef731233de1c51",
"/assets\img\music\band.jpg": "7e37f0b061c3e7cbc025d74f5f414771",
"/assets\img\ohler\Aussenansicht.jpg": "f685cef022d4241cf76d3750c9f00d72",
"/assets\img\ohler\Bad-Bild2.jpg": "09f5f84462b0581ae20880516757ff2d",
"/assets\img\ohler\Kueche-Bild1.jpg": "59a3f2f3716c924d35588f6582ca54bc",
"/assets\img\ohler\Kueche-Bild2.jpg": "1a1b539b945af7fa847489a449f5cfb1",
"/assets\img\ohler\Schlafzimmer1.jpg": "3f605a4f7860262c557f794bb3b8dde7",
"/assets\img\ohler\Wohnzimmer1.jpg": "a7d73eb4095837baf9657bb5e2e5af98",
"/assets\img\ohler\Wohnzimmer2.jpg": "579d130267f01f5de58f14055c3c4a43",
"/assets\img\pfalzakademieZimmer.jpg": "2c6b208a7aa51fc4f66fad4d502faa15",
"/assets\img\startBild.JPG": "a2704ad025845f787769e77526a6eeb6",
"/assets\img\startBild2.JPG": "a2704ad025845f787769e77526a6eeb6",
"/assets\LICENSE": "07ad7f7496a1f3b45ebdfcc7217ee44e",
"/assets\packages\cupertino_icons\assets\CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"/icons\Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"/icons\Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"/index.html": "c36b6f9b3e7d3aadc72155b704178ed2",
"/main.dart.js": "e69621b566ef39dde65365b4d164e6e7",
"/manifest.json": "23727faa9357c1c4eb9dc5cbd8cb6507"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request, {
          credentials: 'include'
        });
      })
  );
});
