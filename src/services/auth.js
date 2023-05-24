const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = async ({ email, password, name, address, phone }) => {
  try {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const [user, created] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        id: uuidv4(),
        name,
        email,
        password: hashPassword,
        address,
        phone,
        roleId: 2,
      },
    });

    const role = await user.getRole();
    const accessToken = created
      && jwt.sign({ id: user.id, email: user.email, roleCode: role.code }, process.env.JWT_SECRET, { expiresIn: "1h" })
    const refreshToken = created
      && jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: "60d" })

    if(refreshToken) {
      await db.User.update({
        refreshToken: refreshToken
      }, {
        where: { id: user.id },
      })
    }
    return {
      message: created ? "Register is successfully" : "Email is used",
      'accessToken': accessToken ? `Bearer ${accessToken}` : null,
      'refreshToken': refreshToken ? refreshToken : null,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await db.User.findOne({
      where: { email },
    });
    const role = user && (await user.getRole());
    const isChecked = user && bcrypt.compareSync(password, user.password);

    const accessToken = isChecked
      && jwt.sign({ id: user.id, email: user.email, roleCode: role.code}, process.env.JWT_SECRET, { expiresIn: "1h" })
    const refreshToken = isChecked
      && jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: "60d" })

    if(refreshToken) {
      await db.User.update({
        refreshToken: refreshToken
      }, {
        where: { id: user.id },
      })
    }
    return {
      message: accessToken ? "Login is successfully" : user ? "Password was incorrect" : "Email hasn't been registered",
      'accessToken': accessToken ? `Bearer ${accessToken}` : null,
      'refreshToken': refreshToken ? refreshToken : null,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const refreshToken = async ( refreshToken ) => {
  try {
    const user = await db.User.findOne({
      where: { refreshToken: refreshToken }
    })
    const role = user && (await user.getRole());
    if (user) {
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (error) => {
        if(error) {
          return res.status(401).json({
            message: "Refresh token has expired. Require login again",
          });
        } else {
          const accessToken = jwt.sign({ id: user.id, email: user.email, roleCode: role.code }, process.env.JWT_SECRET, { expiresIn: "5d" })
          return {
            message: accessToken ? "Generate access token successfully" : "Fail to generate new access token. Let's try more time",
            'accessToken': accessToken ? `Bearer ${accessToken}` : null,
            'refreshToken': refreshToken
          }
        }
      })
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  login,
  register,
  refreshToken
};
