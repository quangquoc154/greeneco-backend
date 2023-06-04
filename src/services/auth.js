const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const register = async ({ email, password, fullname, address, phone }, res) => {
  try {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const [user, created] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        id: uuidv4(),
        fullname,
        email,
        password: hashPassword,
        roleId: 2,
      },
    });
    const status = created ? 201 : 409;
    return res.status(status).json({
      message: created ? "Register is successfully" : "Email is used",
    });
  } catch (error) {
    throw new Error(error);
  }
};

const login = async ({ email, password }, res) => {
  try {
    const user = await db.User.findOne({
      where: { email },
    });
    const role = user && (await user.getRole());
    const isChecked = user && bcrypt.compareSync(password, user.password);

    const accessToken = isChecked
      && jwt.sign({ id: user.id, email: user.email, roleCode: role.code}, process.env.JWT_SECRET, { expiresIn: "2d" })
    const refreshToken = isChecked
      && jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: "7d" })

    if(refreshToken) {
      await db.User.update({
        refreshToken: refreshToken
      }, {
        where: { id: user.id },
      })
    }
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    
    const status = accessToken ? 200 : user ? 401 : 404;
    return res.status(status).json({
      message: accessToken ? "Login is successfully" : user ? "Password was incorrect" : "Email hasn't been registered",
      accessToken: accessToken ? accessToken : null
    });
  } catch (error) {
    throw new Error(error);
  }
};

const refreshToken = async ( refreshToken, res ) => {
  try {
    let response, status;
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
          status = accessToken ? 200 : 500;
          response = {
            message: accessToken ? "Generate access token successfully" : "Fail to generate new access token. Let's try more time",
            'newAccessToken': accessToken ? accessToken : null,
          }
        }
      })
    }
    return res.status(status).json(response);
  } catch (error) {
    throw new Error(error);
  }
};

const logout = async ( refreshToken, res ) => {
  // Delete refresh token in db
  await db.User.update({ refreshToken: '' }, {
    where: {
       refreshToken: refreshToken 
    }
  })
  // Delete refresh token in cookie browser
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })
  return {
    success: true,
    mes: 'Logout is done'
  }
}

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  forgotPassword
};
