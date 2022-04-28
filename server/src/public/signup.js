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
				console.log(data);
				if (res.status != 201) {
					errorObject.innerHTML = data.error;
				}
			});
		})
		.catch((error) => {
			console.log(error);
		});
});
