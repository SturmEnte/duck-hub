// I tried to do the plugin caching in the service worker
// but I couldn't open more than one cache for some reason
// so I thought I'd just put it in a regular js file

const PLUGIN_CACHE_NAME = "duck-hub-plugins-v1.0.0";

(async () => {
	const pluginCache = await caches.open(PLUGIN_CACHE_NAME);
	const pluginConfig = await (await fetch("/plugins/config.json")).json();

	let filesToCache = [];

	for (let i = 0; i < pluginConfig.plugins.length; i++) {
		const plugin = pluginConfig.plugins[i];
		const name = String(plugin.name.toLowerCase());
		console.log(name);
		filesToCache.push(`/plugins/${name}/${plugin.html}`, `/plugins/${name}/${plugin.css}`, `/plugins/${name}/${plugin.js}`);
	}

	await pluginCache.addAll(filesToCache);
})();
