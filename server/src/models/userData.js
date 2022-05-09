const { Schema, model } = require("mongoose");

const schema = new Schema({
	user_id: {
		type: String,
		required: true,
	},
	data: {
		type: Object,
		required: true,
	},
});

module.exports = model("user_data", schema);
