const STATIC_CACHE_NAME = "duck-hub-static";
const STATIC_CACHE_VERSION = "v1.0.0";

const STATIC_ASSETS = [
	// Json
	"/manifest.json",
	"/plugins/config.json",
	// Sites
	"/app",
	"/login",
	"/signup",
	"/404",
	// HTML
	"/html/settings.html",
	// Icons/Images
	"/icons/duck-hub-64x.png",
	"/img/settings-light.svg",
	"/img/logout-light.svg",
	"/img/description-light.svg",
	"/img/code-light.svg",
	// Fonts
	"/fonts/OpenSans-Regular.ttf",
	// CSS
	"/css/app.css",
	"/css/fonts.css",
	"/css/global.css",
	"/css/vars.css",
	// JS
	"/js/api.js",
	"/js/app.js",
	"/js/db.js",
	"/js/auth.js",
	"/js/registerSw.js",
	"js/cachePlugins.js",
	// Vendor
	"/vendor/hi-base64.js",
];

self.addEventListener("install", (event) => {
	async function cacheStatic() {
		const staticCache = await caches.open(STATIC_CACHE_NAME + "-" + STATIC_CACHE_VERSION);
		await staticCache.addAll(STATIC_ASSETS);
	}

	event.waitUntil(cacheStatic());
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(keys.filter((key) => key.includes(STATIC_CACHE_NAME) && key !== STATIC_CACHE_NAME + "-" + STATIC_CACHE_VERSION).map((key) => caches.delete(key)));
		})
	);
});

self.addEventListener("fetch", (event) => {
	if (!event.request.url.includes("api")) {
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
