let userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
const refreshToken = localStorage.getItem("refresh_token") || "";

// Check if the user is authenticated
if (!refreshToken) logout();

// Check if the localy stored user info has all required parameters
// If not, will the code try to read them out of the refresh token
// If that fails too, will the user be logged out
if (!hasUserInfoParams()) {
	userInfo = JSON.parse(atob(refreshToken.split(".")[1]));
	if (!hasUserInfoParams()) logout();
	localStorage.setItem("user_info", JSON.stringify(userInfo));
}

// Check if the refresh token is outdated
if (Date.now() - userInfo.exp * 1000 >= 0) {
	logout();
}

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
	})
		.then((res) => {
			console.log(res);
		})
		.finally(() => {
			window.location.href = "/login";
		});
}
