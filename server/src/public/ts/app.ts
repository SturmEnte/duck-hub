import cachePlugins from "./utility/cachePlugins";
import loadConfig from "./utility/loadConfig";
import TokenManager from "./manager/TokenManager";
import Router from "./manager/Router";

import Config from "./types/Config";
import TokenUserData from "./types/TokenUserData";

const config: Config = loadConfig();
const tokenManager: TokenManager = new TokenManager(config);
let router: Router;

window.addEventListener("load", () => {
	cachePlugins(config.pluginCacheName + "-v" + config.version)
		.then(() => {
			console.log("Cached plugins");
		})
		.catch((err) => {
			console.log("Error while caching plugins: ", err);
		});

	try {
		insertUsername();
		console.log("Inserted usernames");
	} catch (err) {
		console.log("Error while inserting usernames: ", err);
	}

	// Initialization of the router
	router = new Router();
	router.setFallback("/404");
	router.setCurrent("/test");
});

function insertUsername() {
	const usernameItems = document.getElementsByClassName("username");
	const userInfo: TokenUserData = tokenManager.getTokenUserData();
	let username = "";

	if (userInfo.username.length > 18) {
		const cutUsername = userInfo.username.split("");
		for (let i = 0; i < 15; i++) {
			username += cutUsername[i];
		}
		username += "...";
	} else username = userInfo.username;

	for (let i = 0; i < usernameItems.length; i++) {
		usernameItems[i].innerHTML = username;
	}
}
