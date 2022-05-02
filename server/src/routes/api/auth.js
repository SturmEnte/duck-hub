const { Router, json } = require("express");
const uuid = require("uuid").v4;
const bcrypt = require("bcrypt");

const AccountModel = require("../../models/account");

const config = global.config;

const router = Router();

router.use(json());

router.post("/login", (req, res) => {
	console.log(req.body);
});

router.post("/signup", async (req, res) => {
	if (checkRequiredParams(req, res)) {
		return;
	}

	if (
		await AccountModel.exists({
			username: req.body.username,
		})
	) {
		res.status(422).json({ error: "Account already exists" });
		return;
	}

	await AccountModel.create({
		id: uuid(),
		username: req.body.username,
		password: await bcrypt.hash(req.body.password, config.salt_rounds),
	});

	console.log('Created account with username "' + req.body.username + '"');

	res.sendStatus(201);
});

function checkRequiredParams(req, res) {
	if (req.headers["content-type"] != "application/json") {
		res.status(415).json({ error: "Unsupported content type" });
		return true;
	}

	if (!req.body.username) {
		res.status(422).json({ error: "No username was given" });
		return true;
	}

	if (!req.body.password) {
		res.status(422).json({ error: "No password was given" });
		return true;
	}

	return false;
}

module.exports = router;
