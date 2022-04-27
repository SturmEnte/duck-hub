const { Router } = require("express");

const router = Router();

router.all("*", (req, res) => {
	res.status(404).json({ error: "Endpoint not found" });
});

module.exports = router;
