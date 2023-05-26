const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./src/utils/database");

const initRoutes = require("./src/routes");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

const listener = app.listen(process.env.PORT, () => {
  console.log("Server is running on the port " + listener.address().port);
});
