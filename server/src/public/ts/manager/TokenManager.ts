import base64 from "../declarations/base64";

import Config from "../types/Config";
import TokenUserData from "../types/TokenUserData";

export default class TokenManager {
	private config: Config;
	private refreshToken: string;
	private accessToken: string;
	private userData: TokenUserData;

	constructor(config: Config) {
		this.config = config;
		this.refreshToken = localStorage.getItem(this.config.refreshTokenStoreName) || "";

		// Validate refresh token
		if (!this.refreshToken) {
			// Logout
			console.log("Logout");
		}

		const tokenData = JSON.parse(base64.decode(this.refreshToken.split(".")[1]));

		this.userData = {
			id: tokenData.id,
			username: tokenData.username,
		};

		if (!tokenData.id || !tokenData.username) {
			// Logout
			console.log("Logout");
		}

		// Check if token is expired
		if (Date.now() - tokenData.exp * 1000 >= 0) {
			// Logout
			console.log("Logout");
		}
	}

	public getTokenUserData(): TokenUserData {
		return this.userData;
	}
}
