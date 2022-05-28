import TokenManager from "./manager/TokenManager";

export default class Api {
	tokenManager: TokenManager;

	constructor(tokenManager: TokenManager) {
		this.tokenManager = tokenManager;
	}
}
