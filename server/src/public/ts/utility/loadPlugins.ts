import Router from "../manager/Router";

export default async function (router: Router): Promise<string> {
	const config = JSON.parse(await (await fetch("/plugins/config.json")).text());
	const plugins: Array<any> = config.plugins;
	const sidenavMiddle = document.getElementById("sidenav-middle");

	plugins.forEach((plugin) => {
		const pluginSideElement = document.createElement("div");
		pluginSideElement.innerHTML = plugin.name;
		pluginSideElement.id = plugin.name;
		pluginSideElement.onclick = () => {
			router.setCurrent("/" + String(plugin.name).toLowerCase());
			document.getElementById(plugin.name).classList.add("sidenav-active");

			const elements = document.getElementsByClassName("sidenav-active");

			for (let i = 0; i < elements.length; i++) {
				if (elements[i].id != plugin.name) elements[i].classList.remove("sidenav-active");
			}
		};

		if (window.location.pathname == `/${String(plugin.name).toLowerCase()}`) pluginSideElement.classList.add("sidenav-active");

		sidenavMiddle.appendChild(pluginSideElement);

		router.set(
			"/" + String(plugin.name).toLowerCase(),
			`/plugins/${String(plugin.name).toLowerCase()}/${plugin.html}`,
			`/plugins/${String(plugin.name).toLowerCase()}/${plugin.css}`,
			`/plugins/${String(plugin.name).toLowerCase()}/${plugin.js}`
		);
	});
	return config.defaultPlugin;
}
