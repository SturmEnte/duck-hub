import Route from "../types/Route";

// A path is for example / or /foo/bar
export default class Router {
	urls: Map<string, Route>;
	fallback: string;
	wrapper: HTMLElement;

	constructor() {
		this.urls = new Map<string, Route>();
		this.wrapper = document.getElementById("wrapper");
		this.wrapper.innerHTML = "Hello World";
	}

	public set(path: string, html: string, css: string | undefined, js: string | undefined) {
		this.urls.set(path, { html, css, js });
	}

	public setFallback(fileUrl: string) {
		this.fallback = fileUrl;
	}

	public async setCurrent(path: string) {
		window.history.pushState(path, path, path);
		if (this.urls.has(path)) await this.loadPage(this.urls.get(path));
		else await this.loadPage({ html: this.fallback, css: undefined, js: undefined });
	}

	private async loadPage(route: Route) {
		this.wrapper.innerHTML = await (await fetch(route.html)).text();

		if (route.css) {
			const style: HTMLElement = document.createElement("style");
			style.innerHTML = await (await fetch(route.css)).text();
			this.wrapper.appendChild(style);
		}

		if (route.js) {
			const script: HTMLScriptElement = document.createElement("script");
			script.src = route.js;
			this.wrapper.appendChild(script);
		}
	}
}
