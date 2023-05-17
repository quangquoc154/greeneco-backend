const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");

const shopController = require("./controller/shopController");
const adminController = require("./controller/adminController");

const User = require("./model/user");
const Product = require("./model/product");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", (req, res, next) => {
  res.status(200).send("hello world");
});

app.use("/ab*cd", (req, res, next) => {
  res.status(201).send("ab*cd");
});

(async () => {
  try {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
    app.listen(5000);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
