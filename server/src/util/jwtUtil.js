const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;

const RefreshTokenModel = require("../models/refreshToken");

const config = global.config;

module.exports.isTokenValid = (token, refreshToken = false) => {
	const secret =
		refreshToken === false
			? config.access_token_secret
			: config.refresh_token_secret;
	// The try-catch prefents the server from crashing because if the token has an invalid signature, then the server would spit out an error and crash
	try {
		const verifyRes = jwt.verify(token, secret);
		if (verifyRes.username) return true;
	} catch {}
	return false;
};

module.exports.generateAccessToken = (refreshToken) => {
	const refreshTokenData = jwt.verify(refreshToken, config.refresh_token_secret);

	console.log(refreshTokenData);

	if (!refreshTokenData) return undefined;

	return jwt.sign(
		{ id: refreshTokenData.id, username: refreshTokenData.username },
		config.access_token_secret,
		{
			expiresIn: config.access_token_expire_time,
		}
	);
};

module.exports.generateRefreshToken = (id, username) => {
	const token = jwt.sign({ id, username }, config.refresh_token_secret, {
		expiresIn: String(config.refresh_token_expire_time) + "d",
	});
	RefreshTokenModel.create({ id: uuid(), token, account_id: id });
	return token;
};
