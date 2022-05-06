const STATIC_CACHE_NAME = "duck-hub-static-v1.0.0";
const PLUGIN_CACHE_NAME = "duck-hub-plugins-v1.0.0";

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
	async function cacheStatic() {
		const staticCache = await caches.open(STATIC_CACHE_NAME);
		await staticCache.addAll(STATIC_ASSETS);
	}

	async function cachePlugins() {
		const pluginCache = await caches.open(PLUGIN_CACHE_NAME);
		const pluginConfig = await (await fetch("/plugins/config.json")).json();

		let filesToCache = [];

		for (let i = 0; i < pluginConfig.plugins.length; i++) {
			const plugin = pluginConfig.plugins[i];
			const name = String(plugin.name.toLowerCase());
			console.log(name);
			filesToCache.push(
				`/plugins/${name}/${plugin.html}`,
				`/plugins/${name}/${plugin.css}`,
				`/plugins/${name}/${plugin.js}`
			);
		}

		console.log(filesToCache);

		await pluginCache.addAll(filesToCache);
	}

	// I don't know why or how but as soon as I delete this, the plugin cashing doen't work anymore
	// If you know why, then please let me know

	/*event.waitUntil(
		caches
			.open("v1")
			.then((cache) => {
				return cache.addAll([
					`/plugins/${plugin.name.toLowerCase()}/${plugin.html}`,
					`/plugins/${plugin.name.toLowerCase()}/${plugin.css}`,
					`/plugins/${plugin.name.toLowerCase()}/${plugin.js}`,
				]);
			})
			.catch(console.log)
	);*/

	event.waitUntil(cacheStatic());
	//event.waitUntil(cachePlugins());
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
