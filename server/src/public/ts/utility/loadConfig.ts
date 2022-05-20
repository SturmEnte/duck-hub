import Config from "../types/Config";

export default function (): Config {
	return {
		version: "1.0.0",
		pluginCacheName: "duck-hub-plugins",
		refreshTokenStoreName: "refresh_token",
		accessTokenCacheName: "access_token",
	};
}
