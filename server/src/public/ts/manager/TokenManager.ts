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

		let tokenData;

		// Firefox doesn't support hi-base64 because of that it needs to use the already included base64 decoder
		if (navigator.userAgent.includes("Firefox")) {
			// Displaying a notice that tells the user, that maybe not all features work in Firefox
			if (!localStorage.getItem("ff-notice-done")) {
				alert(
					"Firefox detected! Some features may not work in Firefox. If you encounter any problems, please get in contact with a developer of Duck Hub. You can get in contact with me, by creating a issue describing your problem in the Duck Hub repository (https://github.com/sturmente/duck-hub)\n\nThis message will not appear again!"
				);
				localStorage.setItem("ff-notice-done", "y");
			}

			tokenData = JSON.parse(atob(this.refreshToken.split(".")[1]));
		} else {
			tokenData = JSON.parse(base64.decode(this.refreshToken.split(".")[1]));
		}

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
