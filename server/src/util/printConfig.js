module.exports = (config) => {
	console.log("Config:");
	console.log("Port: ", config.port);
	console.log("Web interface: ", config.web_interface);
	console.log("MongoDB Uri: ", config.mongodb_uri);
};
