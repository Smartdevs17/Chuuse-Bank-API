const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true});

const connection = mongoose.connection;
connection.on("open",() => console.log("Successfully connected to DB"));
connection.once("error",(error) => console.log(error.message));


module.exports = connection;