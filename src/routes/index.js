const auth = require("./auth");
const user = require("./user");
const product = require("./product");
const cart = require("./cart");
const order = require("./order");
const feedback = require("./feedback");

const initRoutes = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/user", user);
  app.use("/api/product", product);
  app.use("/api/cart", cart);
  app.use("/api/order", order);
  app.use("/api/feedback", feedback);
  app.use((req, res) => {
    res.status(404).json({
      err: 1,
      message: "This route is not defined",
    });
  });
};

module.exports = initRoutes;
