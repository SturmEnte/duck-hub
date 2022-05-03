const { Router, json } = require("express");

const auth = require("./api/auth");

const router = Router();

router.use(json());

// Check if the content type is json
router.all("*", (req, res, next) => {
	if (req.headers["content-type"] != "application/json")
		res.status(415).json({ error: "Unsupported content type" });
	else next();
});

router.use("/auth", auth);

router.all("*", (req, res) => {
	res.status(404).json({ error: "Endpoint not found" });
});

module.exports = router;
