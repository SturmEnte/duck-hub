import AccountManager from "./AccountManager";

import base64 from "../declarations/base64";

import Config from "../types/Config";
import TokenUserData from "../types/TokenUserData";

export default class TokenManager {
	private config: Config;
	private refreshToken: string;
	private accessToken: string;
	private userData: TokenUserData;

	constructor(config: Config, accountManager: AccountManager) {
		this.config = config;
		this.refreshToken = localStorage.getItem(this.config.refreshTokenStoreName) || "";
		this.accessToken = sessionStorage.getItem(this.config.accessTokenCacheName);

		// Validate refresh token
		if (!this.refreshToken) {
			accountManager.logout();
		}

		const tokenData = this.getTokenData(this.refreshToken);

		this.userData = {
			id: tokenData.id,
			username: tokenData.username,
		};

		if (!tokenData.id || !tokenData.username) {
			accountManager.logout();
		}

		// Check if token is expired
		if (Date.now() - tokenData.exp * 1000 >= 0) {
			accountManager.logout();
		}
	}

	public getTokenUserData(): TokenUserData {
		return this.userData;
	}

	public async getAccessToken(): Promise<string> {
		let accessToken = this.accessToken;
		let accessTokenData = this.getTokenData(accessToken);

		if (!accessToken || Date.now() - accessTokenData.exp * 1000 >= 0) {
			const res = await fetch("/api/auth/token", {
				method: "post",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					refresh_token: this.refreshToken,
				}),
			});

			if (res.status != 200) {
				console.log("Error while requesting access token", res);
				throw "Error while fetching access token. Response code: " + res.status;
			}

			let data = await res.json();

			if (!data.access_token) {
				console.log("No access token included in the response", res);
				throw "Error while fetching access token. Response code: " + res.status;
			}

			accessToken = data.access_token;
			sessionStorage.setItem(this.config.accessTokenCacheName, accessToken);
		}

		this.accessToken = accessToken;
		return accessToken;
	}

	private getTokenData(token: string): any {
		// Firefox doesn't support hi-base64 because of that it needs to use the already included base64 decoder
		if (navigator.userAgent.includes("Firefox")) {
			// Displaying a notice that tells the user, that maybe not all features work in Firefox
			if (!localStorage.getItem("ff-notice-done")) {
				alert(
					"Firefox detected! Some features may not work in Firefox. If you encounter any problems, please get in contact with a developer of Duck Hub. You can get in contact with me, by creating a issue describing your problem in the Duck Hub repository (https://github.com/sturmente/duck-hub)\n\nThis message will not appear again!"
				);
				localStorage.setItem("ff-notice-done", "y");
			}

			return JSON.parse(atob(this.refreshToken.split(".")[1]));
		} else {
			return JSON.parse(base64.decode(this.refreshToken.split(".")[1]));
		}
	}
}
