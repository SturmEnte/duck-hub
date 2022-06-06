export default class AccountManager {
	logout() {
		localStorage.clear();
		window.location.href = "/login";
	}
}
