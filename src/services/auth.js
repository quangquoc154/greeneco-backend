const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async ({ email, password }) => {
  try {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const [user, created] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        email,
        password: hashPassword,
      },
    });
    console.log([user, created]);
    const token = created
      ? jwt.sign(
          {
            id: user.id,
            email: user.email,
            roleCode: user.roleCode,
          },
          process.env.JWT_SECRET,
          { expiresIn: "5d" }
        )
      : null;
    return {
      err: created ? 0 : 1,
      mes: created ? "Register is successfully" : "Email is used",
      accessToken: token ? `Bearer ${token}` : token,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const login = async ({ email, password }) => {
  try {
    a = 1
    const user = await db.User.findOne({
      where: { email },
      raw: true,
    });
    const isChecked =
      user && bcrypt.compareSync(password, user.password);
    const token = isChecked
      ? jwt.sign(
          {
            id: user.id,
            email: user.email,
            roleCode: user.roleCode,
          },
          process.env.JWT_SECRET,
          { expiresIn: "5d" }
        )
      : null;
    return {
      err: token ? 0 : 1,
      mes: token
        ? "Login is successfully"
        : user
        ? "Password was incorrect"
        : "Email hasn't been registered",
      accessToken: token ? `Bearer ${token}` : token,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  login,
  register
}
