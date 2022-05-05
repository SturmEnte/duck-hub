const { Schema, model } = require("mongoose");

// Converts the expiration time from days to minutes
const expires =
	Number(global.config.refresh_token_expire_time) * (24 * 60 * 60);

const schema = new Schema({
	token: {
		type: String,
		required: true,
	},
	account_id: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		expires,
		default: Date.now,
	},
});

module.exports = model("refresh_token", schema);
