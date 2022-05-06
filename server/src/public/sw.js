const STATIC_CACHE_NAME = "duck-hub-static-v1.0.0";

const STATIC_ASSETS = [
	"/manifest.json",
	// Sites
	"/app",
	"/login",
	"/signup",
	"/404",
	// HTML
	"/html/settings.html",
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
	// Vendor
	"/vendor/hi-base64.js",
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
	if (event.request.url.indexOf("/api") === -1) {
		event.respondWith(
			caches
				.match(event.request)
				.then((cacheRes) => {
					return cacheRes || fetch(event.request);
				})
				.catch(() => {
					return caches.match("/404");
				})
		);
	}
});
