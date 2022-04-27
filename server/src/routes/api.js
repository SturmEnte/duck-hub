const { Router } = require("express");

const auth = require("./api/auth");

const router = Router();

router.use("/auth", auth);

router.all("*", (req, res) => {
	res.status(404).json({ error: "Endpoint not found" });
});

module.exports = router;
