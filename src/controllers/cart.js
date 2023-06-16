const joi = require("joi")
const { prodId, quantity } = require("../helpers/joi_schema")
const cartService = require("../services/cart")

const addToCart = async (req, res) => {
  try {
    const { error } = joi.object({ prodId, quantity }).validate(req.body);
    if(error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await cartService.addToCart(req.user, req.body, res)
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const response = await cartService.getCart(req.user, res);
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const editQuantity = async (req, res) => {
  try {
    const { error } = joi.object({ prodId, quantity }).validate(req.body);
    if(error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await cartService.editQuantity(req.user, req.body, res);
  return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteCartItem = async(req, res) => {
  try {
    const { error } = joi.object({ prodId }).validate(req.body);
    if(error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await cartService.deleteCartItem(req.user, req.body.prodId, res);
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addToCart,
  editQuantity,
  getCart,
  deleteCartItem,
};
