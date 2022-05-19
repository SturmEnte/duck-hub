export default async function (pluginCacheName: string) {
	const pluginCache: Cache = await caches.open(pluginCacheName);
	const pluginConfig: any = await (await fetch("/plugins/config.json")).json();

	let filesToCache = [];

	for (let i = 0; i < pluginConfig.plugins.length; i++) {
		const plugin = pluginConfig.plugins[i];
		const name = String(plugin.name.toLowerCase());
		filesToCache.push(`/plugins/${name}/${plugin.html}`, `/plugins/${name}/${plugin.css}`, `/plugins/${name}/${plugin.js}`);
	}

	await pluginCache.addAll(filesToCache);
}
