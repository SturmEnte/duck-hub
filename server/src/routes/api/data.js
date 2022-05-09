const { Router } = require("express");
const { verify } = require("jsonwebtoken");

const UserData = require("../../models/userData");

const config = global.config;

const router = Router();

router.get("/getAllUserData", (req, res) => {
	const tokenData = verify(
		req.headers.authorization.split(" ")[1],
		config.access_token_secret
	);

	console.log(tokenData);

	res.json([]);
});

router.post("/setUserData", async (req, res) => {
	const tokenData = verify(
		req.headers.authorization.split(" ")[1],
		config.access_token_secret
	);

	if (!tokenData.id) {
		res.status(422).json({ error: "The token doesn't cotain the required data" });
		return;
	}

	const userDataObject = await UserData.findOne({ user_id: tokenData.id });

	if (userDataObject) {
		let newData = userDataObject.data;
		newData = newData.filter((data) => data.key !== req.body.key);
		newData.push(req.body);
		await UserData.updateOne({ user_id: tokenData.id }, { data: newData });
	} else {
		await UserData.create({ user_id: tokenData.id, data: [req.body] });
	}

	res.sendStatus(200);
});

module.exports = router;
