require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const accountRoute = require("./routes/Customer");
const transactionRoute = require("./routes/Transaction");

app.use("/api/account",accountRoute);
app.use("/api/transaction",transactionRoute);



module.exports = app;