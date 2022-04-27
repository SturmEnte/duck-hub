const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const printConfig = require("./util/printConfig");

const auth = require("./routes/auth");
const info = require("../json/info.json");
const config = require("../json/config.json");

// Setting all config variables that can be set by the environment vars to the environment var value if they have one
config.port = process.env.PORT || config.port;
config.mongodb_uri = process.env.mongodb_uri || config.mongodb_uri;

console.log("Running duck-hub-server version " + info.version);
printConfig(config);

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

// Setting up express
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(auth);

app.get("/", (req, res) => {
	res.render("app", { version: info.version });
});

app.listen(config.port);
