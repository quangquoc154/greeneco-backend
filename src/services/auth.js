const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = async ({ email, password, fullname, address, phone }) => {
  try {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const [user, created] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        id: uuidv4(),
        fullname,
        email,
        password: hashPassword,
        address,
        phone,
        roleId: 2,
      },
    });
    
    return {
      message: created ? "Register is successfully" : "Email is used",
    };
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
    
    return {
      message: accessToken ? "Login is successfully" : user ? "Password was incorrect" : "Email hasn't been registered",
      'accessToken': accessToken ? accessToken : null,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const refreshToken = async ( refreshToken ) => {
  try {
    let response;
    const user = await db.User.findOne({
      where: { refreshToken: refreshToken }
    })
    const role = user && (await user.getRole());
    if (user) {
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (error) => {
        if(error) {
          response = res.status(401).json({
            message: "Refresh token has expired. Require login again",
          });
        } else {
          const accessToken = jwt.sign({ id: user.id, email: user.email, roleCode: role.code }, process.env.JWT_SECRET, { expiresIn: "5d" })
          response = {
            message: accessToken ? "Generate access token successfully" : "Fail to generate new access token. Let's try more time",
            'newAccessToken': accessToken ? accessToken : null,
          }
        }
      })
    }
    return response;
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

// const resetPassword = async (req, res) => {
//   try {
//     const { error } = joi.object({ refreshToken }).validate(req.body);
//     if (error)
//       return res.status(400).json({
//         message: error.details[0].message,
//       });
//     const response = await authServices.logout(req.body.refreshToken);
//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

module.exports = {
  login,
  register,
  refreshToken,
  logout
};
