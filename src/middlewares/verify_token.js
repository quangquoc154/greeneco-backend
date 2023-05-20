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
    if (error)
      return res.status(401).json({
        err: 1,
        message: "Access Token may be expired or invalid",
      });
    req.user = user;
  });
  next();
};

module.exports = verifyToken;
