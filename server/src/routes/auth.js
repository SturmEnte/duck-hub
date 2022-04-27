const { Router } = require("express");

const router = Router();

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/signup", (req, res) => {
	res.render("signup");
});

module.exports = router;
