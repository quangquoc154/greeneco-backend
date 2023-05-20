const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");

const initRoutes = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/user", user);
  app.use('/api/admin', admin)
  app.use((req, res) => {
    res.status(404).json({
      err: 1,
      message: "This route is not defined",
    });
  });
};

module.exports = initRoutes;
