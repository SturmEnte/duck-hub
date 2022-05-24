import TokenManager from "./manager/TokenManager";
import Router from "./manager/Router";

import cachePlugins from "./utility/cachePlugins";
import loadPlugins from "./utility/loadPlugins";
import loadConfig from "./utility/loadConfig";

import Config from "./types/Config";
import TokenUserData from "./types/TokenUserData";

const config: Config = loadConfig();
const tokenManager: TokenManager = new TokenManager(config);
let router: Router;

window.addEventListener("load", async () => {
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
	try {
		router = new Router();
		router.setFallback("/404");
		const defaultPage = await (await loadPlugins(router)).toLowerCase();
		router.set("/settings", "/html/settings.html", undefined, undefined);
		document.getElementById("sidenav-bottom").onclick = async () => await router.setCurrent("/settings");

		// Load the right page when using the forward or backward button
		window.onpopstate = async (event) => {
			await router.setCurrent(event.state);
		};

		// Set the current page to the on in the url or to the default if the url is equal to /app
		if (window.location.pathname == "/app") {
			await router.setCurrent("/" + defaultPage);
		} else {
			await router.setCurrent(window.location.pathname);
		}

		console.log("Loaded plugins");
	} catch (err) {
		document.getElementById("wrapper").innerHTML =
			'An error occured while loading the page. Please refresh the page and open an issue, when the error keeps occuring. You can open a issue <a href="https://github.com/sturmente/duck-hub">here</a>';
		console.log("Error while loading router: ", err);
	}

	// Save the userinfo in the session storage temporarily so that plugins can still use the username
	sessionStorage.setItem("user-info", JSON.stringify(tokenManager.getTokenUserData()));
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
