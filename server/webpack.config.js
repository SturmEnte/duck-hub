const path = require("path");

module.exports = {
	entry: "./src/public/ts/app.ts",
	module: {
		rules: [
			{
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "src", "public"),
	},
};
