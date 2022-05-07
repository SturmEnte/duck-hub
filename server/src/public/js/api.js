const refreshToken = localStorage.getItem("refresh_token");
let accessToken = sessionStorage.getItem("access_token") || "";

let api = {};

//#region Non-API stuff
async function getAccessToken() {
	const res = await fetch("/api/auth/token", {
		method: "post",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			refresh_token: refreshToken,
		}),
	});

	if (res.status != 200) {
		console.log("Error while requesting access token", res);
		return;
	}

	let data = await res.json();

	if (!data.access_token) {
		console.log("No access token included in the response", res);
		return;
	}

	accessToken = data.access_token;
	sessionStorage.setItem("access_token", accessToken);

	data = JSON.parse(base64.decode(accessToken.split(".")[1]));

	// Automaticly requests a new access token after the current one expires
	setTimeout(() => {
		getAccessToken();
	}, data.exp * 1000 - Date.now());
}

if (!accessToken) getAccessToken();
if (
	Date.now() - JSON.parse(base64.decode(accessToken.split(".")[1])).exp * 1000 >
	0
) {
	getAccessToken();
}
//#endregion Non-API stuff
