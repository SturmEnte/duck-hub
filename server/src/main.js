const express = require("express");
const path = require("path");

const printConfig = require("./util/printConfig");

const auth = require("./routes/auth");
const info = require("../json/info.json");
const config = require("../json/config.json");

// Setting all config variables that can be set by the environment vars to the environment var value if they have one
config.port = process.env.PORT || config.port;

console.log("Running duck-hub-server version " + info.version);
printConfig(config);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(auth);

app.get("/", (req, res) => {
	res.render("app", { version: info.version });
});

app.listen(config.port);
