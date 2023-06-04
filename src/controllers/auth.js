const authServices = require("../services/auth");
const joi = require("joi");
const { email, password, fullname, refreshToken } = require("../helpers/joi_schema");

const register = async (req, res) => {
  try {
    // Validate data
    const { error } = joi.object({ email, password, fullname }).validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });
    const response = await authServices.register(req.body, res);
    return response;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    // Validate data
    const { error } = joi.object({ email, password }).validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });
    const response = await authServices.login(req.body, res);
    return response;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const refreshTokenCrl = async (req, res) => {
  try {
    const { error } = joi.object({ refreshToken }).validate(req.cookies);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });
    const response = await authServices.refreshToken(req.cookies.refreshToken, res);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const logout = async (req, res) => {
  try {
    const { error } = joi.object({ refreshToken }).validate(req.cookies);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });
    const response = await authServices.logout(req.cookies.refreshToken, res);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { error } = joi.object({ email }).validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });
    const response = await authServices.forgotPassword(req.body.email, res);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  login,
  register,
  refreshTokenCrl,
  logout,
};
