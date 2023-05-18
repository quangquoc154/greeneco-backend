const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./util/database");

const shopController = require("./controller/shopController");
const adminController = require("./controller/adminController");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res, next) => {
  res.status(200).send("hello world");
});

app.use("/ab*cd", (req, res, next) => {
  res.status(201).send("ab*cd");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Server is running on the port " + listener.address().port);
});
