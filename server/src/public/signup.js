const signupForm = document.getElementById("signup-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorObject = document.getElementById("error");

signupForm.addEventListener("submit", (event) => {
	event.preventDefault();

	fetch("/api/auth/signup", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: usernameInput.value,
			password: passwordInput.value,
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
