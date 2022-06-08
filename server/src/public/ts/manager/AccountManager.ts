export default class AccountManager {
	async logout() {
		localStorage.clear();
		await fetch("/api/auth/logout", { method: "delete", body: JSON.stringify({ refresh_token: localStorage.getItem("refresh_token") }) });
		window.location.href = "/login";
	}
}
