import Router from "../manager/Router";

export default async function (router: Router): Promise<string> {
	const config = JSON.parse(await (await fetch("/plugins/config.json")).text());
	console.log(config);
	const plugins: Array<any> = config.plugins;
	plugins.forEach((plugin) => {
		console.log(plugin);
		router.set(
			"/" + String(plugin.name).toLowerCase(),
			`/plugins/${String(plugin.name).toLowerCase()}/${plugin.html}`,
			`/plugins/${String(plugin.name).toLowerCase()}/${plugin.css}`,
			`/plugins/${String(plugin.name).toLowerCase()}/${plugin.js}`
		);
	});
	return config.defaultPlugin;
}
