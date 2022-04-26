const express = require("express");
const path = require("path");

const printConfig = require("./util/printConfig");

const info = require("../json/info.json");
const config = require("../json/config.json");

console.log("Running duck-hub-server version " + info.version);
printConfig(config);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
	res.render("app", { version: info.version });
});

app.listen(config.port);
