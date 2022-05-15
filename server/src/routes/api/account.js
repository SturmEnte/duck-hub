const { Router } = require("express");
const bcrypt = require("bcrypt");
const { verify } = require("jsonwebtoken");

const config = global.config;

const Account = require("../../models/account");

const router = Router();

router.post("/changePassword", async (req, res) => {
	if (!req.body.oldPassword || !req.body.newPassword) {
		res.status(400).json({ error: "You need to enter the old and new password" });
		return;
	}

	const tokenData = verify(req.headers.authorization.split(" ")[1], config.access_token_secret);

	if (!tokenData) {
		res.sendStatus(400);
		return;
	}

	const account = await Account.findOne({ username: tokenData.username });

	if (!account) {
		res.sendStatus(400);
		return;
	}

	if ((await bcrypt.compare(req.body.oldPassword, account.password)) === false) {
		res.status(400).json({ error: "The password is incorrect" });
		return;
	}

	await Account.findOneAndUpdate({ username: tokenData.username }, { password: await bcrypt.hash(req.body.newPassword, config.salt_rounds) });

	res.sendStatus(200);
});

module.exports = router;
