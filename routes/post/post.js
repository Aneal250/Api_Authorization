const express = require("express");
const router = express.Router();
const verify = require("../../utilities/verifyToken");

router.get("/", verify, (req, res) => {
	res.send({
		posts: { title: "my first post", description: "this is my first post" },
	});
});

module.exports = router;
