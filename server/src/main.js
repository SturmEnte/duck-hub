require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const printConfig = require("./util/printConfig");

const info = require("../json/info.json");
let config = require("../json/config.json");

// Setting all config variables that can be set by the environment vars to the environment var value if they have one
config.port = process.env.PORT || config.port;
config.mongodb_uri = process.env.mongodb_uri || config.mongodb_uri;
config.access_token_secret =
	process.env.access_token_secret || config.access_token_secret;
config.refresh_token_secret =
	process.env.refresh_token_secret || config.refresh_token_secret;

console.log("Running duck-hub-server version " + info.version);
printConfig(config);

global.config = config;

// Setting up mongodb
mongoose
	.connect(config.mongodb_uri)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((err) => {
		console.log(err);
		console.log("Error while connecting to the database");
		process.exit(1);
	});

// Importing routes
const api = require("./routes/api");

// Setting up express
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", api);

if (config.web_interface) {
	app.get("/", (req, res) => {
		res.redirect("/app");
	});

	app.get("/app", (req, res) => {
		res.sendFile("./views/app.html");
	});

	app.get("/login", (req, res) => {
		res.sendFile("./views/login.html");
	});

	app.get("/signup", (req, res) => {
		res.sendFile("./views/signup.html");
	});

	// Added the 404 page twice so it can be cached by the service worker without any problems
	app.get("/404", (req, res) => {
		res.sendFile("./views/404.html");
	});

	app.get("*", (req, res) => {
		res.sendFile("./views/404.html");
	});
}

app.listen(config.port, () => {
	console.log("Listening to port ", config.port);
});
