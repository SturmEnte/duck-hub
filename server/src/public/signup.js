const signupForm = document.getElementById("signup-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorObject = document.getElementById("error");

signupForm.addEventListener("submit", (event) => {
	event.preventDefault();

	let username = usernameInput.value;
	let password = usernameInput.value;

	// Check if the username contains spaces
	if (username.includes(" ")) {
		errorObject.innerHTML = "Spaces in usernames are not allowed";
		return;
	}

	fetch("/api/auth/signup", {
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
				localStorage.setItem("user_info", atob(data.refresh_token.split(".")[1]));
				window.location.href = "/app";
			});
		})
		.catch((error) => {
			console.log(error);
		});
});
