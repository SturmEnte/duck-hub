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
const auth = require("./routes/auth");
const api = require("./routes/api");

// Setting up express
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(auth);
app.use("/api", api);

if (config.web_interface) {
	app.get("/", (req, res) => {
		res.render("app", { version: info.version });
	});
}

app.listen(config.port, () => {
	console.log("Listening to port ", config.port);
});
