const { Schema, model } = require("mongoose");

const schema = new Schema({
	id: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	account_id: {
		type: String,
		required: true,
	},
});

module.exports = model("refresh_token", schema);
