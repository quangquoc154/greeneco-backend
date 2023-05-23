const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({
      err: 1,
      message: "Require authorization",
    });
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (error, user) => {
    if(error) {
      const isChecked = error instanceof jwt.TokenExpiredError
      if (!isChecked) {
        return res.status(401).json({
          err: 1,
          message: "Access Token invalid",
        });
      } 
      if (isChecked) {
        return res.status(401).json({
          err: 2,
          message: "Access Token has expired",
        });
      }
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
