let page;

// Set the auth page type
if (document.title.toLowerCase().includes("login")) {
	page = "login";
} else if (document.title.toLowerCase().includes("sign up")) {
	page = "signup";
} else {
	alert("Unknown auth page. You will be redirected to the login page");
	window.location.href = "/login";
}

const authForm = document.getElementById(page + "-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorObject = document.getElementById("error");

authForm.addEventListener("submit", (event) => {
	event.preventDefault();

	let username = usernameInput.value;
	let password = passwordInput.value;

	if (page == "login") {
		// Usernames with spaces are not allowed
		// This means that we can inform the user that the username or password is wrong
		if (username.includes(" ")) {
			errorObject.innerHTML = "Username or password wrong";
			return;
		}
	} else {
		// Check if the username contains spaces
		if (username.includes(" ")) {
			errorObject.innerHTML = "Spaces in usernames are not allowed";
			return;
		}
	}

	fetch("/api/auth/" + page, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	})
		.then((res) => {
			res.json().then((data) => {
				if (res.status != 201) {
					errorObject.innerHTML = data.error;
					return;
				}
				console.log(res);
				console.log(data);
				localStorage.setItem("refresh_token", data.refresh_token);
				window.location.href = "/app";
			});
		})
		.catch(console.log);
});
