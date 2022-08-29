const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

//import routes
const authRoute = require("./routes/auth/auth");
const postRoute = require("./routes/post/post");

//middleware
app.use(express.json());

// Route middleware
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

//connect to mongodb
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
	console.log("connected to mongodb");
});

app.listen(3000);
