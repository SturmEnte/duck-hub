const { Router } = require("express");
const { verify } = require("jsonwebtoken");

const UserData = require("../../models/userData");

const config = global.config;

const router = Router();

router.get("/lastChange", async (req, res) => {
	const tokenData = verify(req.headers.authorization.split(" ")[1], config.access_token_secret);

	if (!tokenData.id) {
		res.status(422).json({ error: "The token doesn't cotain the required data" });
		return;
	}

	const userData = await UserData.findOne({ user_id: tokenData.id }).select("lastChange").exec();
	res.json({ lastChange: userData.lastChange });
});

router.get("/getAllUserData", async (req, res) => {
	const tokenData = verify(req.headers.authorization.split(" ")[1], config.access_token_secret);

	if (!tokenData.id) {
		res.status(422).json({ error: "The token doesn't cotain the required data" });
		return;
	}

	const userData = await UserData.findOne({ user_id: tokenData.id });
	if (!userData) {
		res.json([]);
		return;
	}

	res.json(userData.data || []);
});

router.post("/setUserData", async (req, res) => {
	const tokenData = verify(req.headers.authorization.split(" ")[1], config.access_token_secret);

	if (!tokenData.id) {
		res.status(422).json({ error: "The token doesn't cotain the required data" });
		return;
	}

	const userDataObject = await UserData.findOne({ user_id: tokenData.id });

	if (userDataObject) {
		let newData = userDataObject.data || [];
		newData = newData.filter((data) => data.key !== req.body.key);
		newData.push({ key: req.body.key, value: req.body.value });
		await UserData.updateOne({ user_id: tokenData.id }, { data: newData });
	} else {
		await UserData.create({ user_id: tokenData.id, data: [{ key: req.body.key, value: req.body.value }], lastChange: req.body.lastChange });
	}

	res.sendStatus(200);
});

module.exports = router;
