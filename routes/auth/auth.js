const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
	registerValidation,
	loginValidation,
} = require("../../utilities/validation");
const bcrypt = require("bcryptjs");

//Validation

router.post("/register", async (req, res) => {
	//Validate data before creating a user
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//Check if user already exists
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("Email already exists");

	//hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//create a new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//Check if user exists
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email if not found");

	//Check if password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("Invalid password");

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);

});

module.exports = router;
