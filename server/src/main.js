const express = require("express");

const printConfig = require("./util/printConfig");

const info = require("../json/info.json");
const config = require("../json/config.json");

console.log("Running duck-hub-server version " + info.version);
printConfig(config);

const app = express();

app.listen(config.port);
