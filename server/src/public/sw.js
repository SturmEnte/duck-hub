const STATIC_CACHE_NAME = "duck-hub-static-v1";

const STATIC_ASSETS = [
	"/manifest.json",
	// Sites
	"/app",
	"/login",
	"/signup",
	// Icons/Images
	"/icons/duck-hub-64x.png",
	// Fonts
	"/fonts/OpenSans-Regular.ttf",
	// CSS
	"/css/app.css",
	"/css/fonts.css",
	"/css/global.css",
	// JS
	"/app.js",
	"/login.js",
	"/signup.js",
	"/registerSw.js",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		// Cache static assets
		caches
			.open(STATIC_CACHE_NAME)
			.then((cache) => {
				cache.addAll(STATIC_ASSETS);
			})
			.catch((err) => {
				console.log("Error while opening static cache", err);
			})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key !== STATIC_CACHE_NAME)
					.map((key) => caches.delete(key))
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cacheRes) => {
			return cacheRes || fetch(event.request);
		})
	);
});
