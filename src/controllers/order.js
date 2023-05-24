const joi = require("joi")
const orderService = require("../services/order")

const createOrder = async (req, res) => {
  try {
    const response = await orderService.createOrder(req.user)
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const response = await orderService.getOrder(req.user);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
    createOrder, 
    getOrder
};
