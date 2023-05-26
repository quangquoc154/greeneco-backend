const userServices = require("../services/user");
const joi = require("joi");
const { userId } = require('../helpers/joi_schema')

const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await userServices.getUser(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const { error } = joi.object({ userId }).validate({ userId: req.body.id });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await userServices.editUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { error } = joi.object({ userId }).validate({ userId: req.query.id });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await userServices.deleteUser(req.query.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await userServices.getUsers(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCurrentUser,
  editUser,
  deleteUser,
  getUsers,
};
