const { Router, json } = require("express");

const { isTokenValid } = require("../util/jwtUtil");

const auth = require("./api/auth");

const router = Router();

router.use(json());

// Check if the content type is json
router.all("*", (req, res, next) => {
	if (req.method === "post" && req.headers["content-type"] != "application/json")
		return res.status(415).json({ error: "Unsupported content type" });

	// Remove "Bearer" from the authorization header
	const token = String(req.headers.authorization).split(" ")[1];
	if (!req.path.includes("auth") && (!token || isTokenValid(token) == false))
		return res.status(401).json({ error: "Invalid or none authorization token" });

	next();
});

router.use("/auth", auth);

router.all("*", (req, res) => {
	res.status(404).json({ error: "Endpoint not found" });
});

module.exports = router;
