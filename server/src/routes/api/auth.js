const { Router, json } = require("express");

const router = Router();

router.use(json());

router.post("/login", (req, res) => {
	console.log(req.body);
});

router.post("/signup", (req, res) => {
	console.log(req.body);
});

module.exports = router;
