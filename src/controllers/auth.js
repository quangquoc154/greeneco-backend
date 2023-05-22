const authServices = require("../services/auth");
const joi = require("joi");
const { email, password, name, address, phone } = require("../helpers/joi_schema");

const register = async (req, res) => {
  try {
    // Validate data
    const { error } = joi.object({ email, password, name, address, phone }).validate(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
      });
    const response = await authServices.register(req.body);
    return res.status(200).json(response);
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
    const response = await authServices.login(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
  register,
};
