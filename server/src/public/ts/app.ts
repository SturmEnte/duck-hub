import cachePlugins from "./utility/cachePlugins";
import loadConfig from "./utility/loadConfig";

import Config from "./types/Config";

const config: Config = loadConfig();

window.addEventListener("load", () => {
	cachePlugins(config.pluginCacheName + "-v" + config.version)
		.then(() => {
			console.log("Cached plugins");
		})
		.catch((err) => {
			console.log("Error while caching plugins: ", err);
		});
});
