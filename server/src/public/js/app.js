let userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
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

const settingsButton = document.getElementById("settings");

settingsButton.addEventListener("click", async () => {
	openSettings();
});

async function openSettings() {
	wrapper.innerHTML = await (await fetch("/html/settings.html")).text();
	window.location.hash = "settings";
	if (oldActive) oldActive.classList.remove("sidenav-active");
	oldActive = null;
	document.getElementById("changePasswordForm").addEventListener("submit", changePassword);
}

//#region Plugins

const sidenavMiddle = document.getElementById("sidenav-middle");
let oldActive = undefined;

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

		if (plugin.name === pluginConfig.defaultPlugin && window.location.hash == "") {
			window.location.hash = i + "-" + plugin.name.toLowerCase();
			newHash = true;
		}

		const sidenavPluginElement = document.createElement("div");
		sidenavPluginElement.setAttribute("onclick", `window.location.hash = "${i}-${plugin.name.toLowerCase()}"`);
		sidenavPluginElement.id = `btn-${i}`;
		sidenavPluginElement.innerHTML = plugin.name;
		sidenavMiddle.appendChild(sidenavPluginElement);
	}

	if (!newHash) {
		if (window.location.hash == "#settings") {
			openSettings();
			return;
		}
		const id = Number(window.location.hash.split("#")[1].split("-")[0]);
		loadPlugin(id);
		oldActive = document.getElementById(`btn-${id}`);
		oldActive.classList.add("sidenav-active");
	}
}

window.addEventListener("hashchange", async (event) => {
	if (pluginConfig == {}) return;
	if (window.location.hash !== "#settings") {
		const id = Number(window.location.hash.split("#")[1].split("-")[0]);
		loadPlugin(id);
		if (oldActive) oldActive.classList.remvove("sidenav-active");
		oldActive = document.getElementById(`btn-${id}`);
		oldActive.classList.add("sidenav-active");
	}
});

async function loadPlugin(index) {
	const plugin = pluginConfig.plugins[index];

	const html = await (await fetch(`/plugins/${plugin.name.toLowerCase()}/${plugin.html}`)).text();

	const style = document.createElement("style");
	style.innerHTML = await (await fetch(`/plugins/${plugin.name.toLowerCase()}/${plugin.css}`)).text();

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

function changePassword(event) {
	event.preventDefault();

	const oldPassword = document.getElementById("oldPassword").value;
	const newPassword = document.getElementById("newPassword").value;

	if (!oldPassword || !newPassword) {
		alert("You must enter the old and the new password to change your password");
		return;
	}

	fetch("/api/account/changePassword", {
		method: "post",
		headers: {
			Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			oldPassword,
			newPassword,
		}),
	}).then(async (res) => {
		if (res.status === 200) {
			alert("Changed password successfully, you will be logged out.");
			logout();
			return;
		} else {
			alert(await res.body.json().error);
		}
	});
}

function logout() {
	localStorage.clear("user_info");
	localStorage.clear("refresh_token");
	localStorage.clear(LOCAL_DB_CACHE_NAME);
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
