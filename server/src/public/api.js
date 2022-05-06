const refresh_token = localStorage.getItem("refresh_token");
let accessToken = sessionStorage.getItem("access_token") || "";

async function getAccessToken() {
	const res = await fetch("/api/auth/token", {
		method: "post",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			refresh_token,
		}),
	});

	if (res.status != 200) {
		console.log("Error while requesting access token", res);
	}

	const data = await res.json();

	accessToken = data.access_token;
	sessionStorage.setItem("access_token", accessToken);
}
