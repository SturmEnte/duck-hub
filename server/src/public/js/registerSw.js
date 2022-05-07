if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then(() => console.log("Registered service worker"))
		.catch((err) => {
			console.log(err);
			console.log("Error while registering serive worker");
		});
}
