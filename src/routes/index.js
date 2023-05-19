const auth = require("./auth");
const user = require("./user");

const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/auth", auth);
  app.use((req, res) => {
    res.status(404).json({
      err: 1,
      mes: "This route is not defined",
    });
  });
};

module.exports = initRoutes;
