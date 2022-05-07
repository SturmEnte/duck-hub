const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorObject = document.getElementById("error");

loginForm.addEventListener("submit", (event) => {
	event.preventDefault();

	let username = usernameInput.value;
	let password = passwordInput.value;

	// Usernames with spaces are not allowed
	// This means that we can inform the user that the username or password is wrong
	if (username.includes(" ")) {
		errorObject.innerHTML = "Username or password wrong";
		return;
	}

	fetch("/api/auth/login", {
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
				localStorage.setItem("refresh_token", data.refresh_token);
				window.location.href = "/app";
			});
		})
		.catch((error) => {
			console.log(error);
		});
});
