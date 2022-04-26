const signupForm = document.getElementById("signup-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

signupForm.addEventListener("submit", (event) => {
	event.preventDefault();

	fetch("/api/signup", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: usernameInput.value,
			password: passwordInput.value,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.log(error);
		});
});
