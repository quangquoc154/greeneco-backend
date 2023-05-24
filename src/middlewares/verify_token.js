const jwt = require("jsonwebtoken");
const db = require("../models");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({
      err: 1,
      message: "Require authorization",
    });
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, async (error, decode) => {
    if(error) {
      const isChecked = error instanceof jwt.TokenExpiredError
      if (!isChecked) {
        return res.status(401).json({
          err: 1,
          message: "Access Token invalid",
        });
      } 
      // Check the expiration date of the access token
      if (isChecked) {
        return res.status(401).json({
          err: 2,
          message: "Access Token has expired",
        });
      }
    }
    const user = await db.User.findOne({
      where: {id: decode.id},
      attributes: {
        exclude: ["password", "roleId", "refreshToken", "createdAt", "updatedAt"]
      },
      include: [
        { model: db.Role, attributes: ["id", "code", "value"] },
      ],
    })
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
