const { Router } = require("express");
const uuid = require("uuid").v4;
const bcrypt = require("bcrypt");

const {
	generateRefreshToken,
	generateAccessToken,
	isTokenValid,
} = require("../../util/jwtUtil");

const AccountModel = require("../../models/account");
const RefreshTokenModel = require("../../models/refreshToken");

const config = global.config;

const router = Router();

router.post("/login", async (req, res) => {
	if (checkRequiredParams(req, res)) {
		return;
	}

	const account = await AccountModel.findOne({
		username: req.body.username,
	});

	if (!account) {
		res.status(422).json({ error: "Username or password wrong" });
		return;
	}

	if (!bcrypt.compareSync(req.body.password, account.password)) {
		res.status(422).json({ error: "Username or password wrong" });
		return;
	}

	res.status(201).json({
		refresh_token: generateRefreshToken(account.id, account.username),
	});
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

	const id = uuid();

	await AccountModel.create({
		id,
		username: req.body.username,
		password: await bcrypt.hash(req.body.password, config.salt_rounds),
	});

	console.log('Created account with username "' + req.body.username + '"');

	res.status(201).json({
		refresh_token: generateRefreshToken(id, req.body.username),
	});
});

router.delete("/logout", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	if (!refreshToken) {
		res.status(401).json({ error: "Refresh Token required" });
		return;
	}

	if ((await RefreshTokenModel.exists({ token: refreshToken })) === false) {
		res.status(401).json({ error: "Refresh token invalid" });
		return;
	}

	if (!isTokenValid(refreshToken, true)) {
		res.status(401).json({ error: "Refresh token invalid" });
		await RefreshTokenModel.deleteOne({ token: refreshToken });
		return;
	}

	await RefreshTokenModel.deleteOne({ token: refreshToken });

	res.sendStatus(200);
});

router.post("/token", async (req, res) => {
	const refreshToken = req.body.refresh_token;

	if (!refreshToken) {
		res.status(401).json({ error: "Refresh Token required" });
		return;
	}

	if ((await RefreshTokenModel.exists({ token: refreshToken })) === false) {
		res.status(401).json({ error: "Refresh token invalid" });
		return;
	}

	if (!isTokenValid(refreshToken, true)) {
		res.status(401).json({ error: "Refresh token invalid" });
		await RefreshTokenModel.deleteOne({ token: refreshToken });
		return;
	}

	res.status(200).json({ access_token: generateAccessToken(refreshToken) });
});

function checkRequiredParams(req, res) {
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
