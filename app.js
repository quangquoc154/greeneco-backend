const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/utils/database");

const adminRoutes = require("./src/routes/admin");
const shopRoutes = require("./src/routes/shop");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(shopRoutes);

const listener = app.listen(process.env.PORT, () => {
  console.log("Server is running on the port " + listener.address().port);
});
