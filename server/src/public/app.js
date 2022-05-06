let userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
const refreshToken = localStorage.getItem("refresh_token") || "";
const wrapper = document.getElementById("wrapper");

// Check if the user is authenticated
if (!refreshToken) logout();

// Check if the localy stored user info has all required parameters
// If not, will the code try to read them out of the refresh token
// If that fails too, will the user be logged out
if (!hasUserInfoParams()) {
	userInfo = JSON.parse(base64.decode(refreshToken.split(".")[1]));
	if (!hasUserInfoParams()) logout();
	localStorage.setItem("user_info", JSON.stringify(userInfo));
}

// Check if the refresh token is outdated
if (Date.now() - userInfo.exp * 1000 >= 0) {
	logout();
}

// Checks if the username has more than 18 characters and shortens it if so
// The code is in brackets, so that the variables get deletet after the execution
{
	const usernameItems = document.getElementsByClassName("username");
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

//#region Plugins

const sidenavMiddle = document.getElementById("sidenav-middle");

let pluginConfig = {};
fetch("/plugins/config.json").then((res) =>
	res.json().then((data) => {
		pluginConfig = data;
		setupPlugins();
	})
);

function setupPlugins() {
	let newHash = false;
	for (let i = 0; i < pluginConfig.plugins.length; i++) {
		const plugin = pluginConfig.plugins[i];

		if (
			plugin.name === pluginConfig.defaultPlugin &&
			window.location.hash == ""
		) {
			window.location.hash = i + "-" + plugin.name.toLowerCase();
			newHash = true;
		}

		const sidenavPluginElement = document.createElement("div");
		sidenavPluginElement.setAttribute(
			"onclick",
			`window.location.hash = "${i}-${plugin.name.toLowerCase()}"`
		);
		sidenavPluginElement.innerHTML = plugin.name;
		sidenavMiddle.appendChild(sidenavPluginElement);
	}

	if (!newHash) {
		loadPlugin(Number(window.location.hash.split("#")[1].split("-")[0]));
	}
}

window.addEventListener("hashchange", async (event) => {
	if (pluginConfig == {}) return;

	loadPlugin(Number(window.location.hash.split("#")[1].split("-")[0]));
});

async function loadPlugin(index) {
	const plugin = pluginConfig.plugins[index];

	const html = await (
		await fetch(`/plugins/${plugin.name.toLowerCase()}/${plugin.html}`)
	).text();

	const style = document.createElement("style");
	style.innerHTML = await (
		await fetch(`/plugins/${plugin.name.toLowerCase()}/${plugin.css}`)
	).text();

	const script = document.createElement("script");
	script.src = `/plugins/${plugin.name.toLowerCase()}/${plugin.js}`;

	wrapper.innerHTML = html;
	wrapper.appendChild(style);
	wrapper.appendChild(script);
}

//#endregion Plugins

function hasUserInfoParams() {
	if (!userInfo.id || !userInfo.username || !userInfo.exp) return false;
	return true;
}

function logout() {
	localStorage.clear("user_info");
	localStorage.clear("refresh_token");
	fetch("/api/auth/logout", {
		method: "delete",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({ refresh_token: refreshToken }),
	}).finally(() => {
		window.location.href = "/login";
	});
}
