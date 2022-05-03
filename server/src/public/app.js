let userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
const refreshToken = localStorage.getItem("refresh_token") || "";

// Check if the user is authenticated
if (!refreshToken) logout();

if (!userInfo.id || !userInfo.username) {
	userInfo = JSON.parse(atob(refreshToken.split(".")[1]));
	if (!userInfo.id || !userInfo.username) logout();
	localStorage.setItem("user_info", JSON.stringify(userInfo));
}

// Check if the refresh token is outdated
if (Date.now() - userInfo.exp * 1000 >= 0) {
	logout();
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
	})
		.then((res) => {
			console.log(res);
		})
		.finally(() => {
			window.location.href = "/login";
		});
}
