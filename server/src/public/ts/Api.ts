import TokenManager from "./manager/TokenManager";
import AccountManager from "./manager/AccountManager";

export default class Api {
	tokenManager: TokenManager;
	accountManager: AccountManager;

	constructor(tokenManager: TokenManager, accountManager: AccountManager) {
		this.tokenManager = tokenManager;
		this.accountManager = accountManager;
	}
}
