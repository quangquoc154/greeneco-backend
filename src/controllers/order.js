const joi = require("joi")
const orderService = require("../services/order")

const createOrder = async (req, res) => {
  try {
    const response = await orderService.createOrder(req.user, req.body, res)
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createOrderFormCart = async (req, res) => {
  try {
    const response = await orderService.createOrderFormCart(req.user, req.body, res)
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const response = await orderService.getOrder(req.user, res);
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const response = await orderService.cancelOrder(req.user, req.params.orderId, res);
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
    createOrder,
    createOrderFormCart, 
    getOrder,
    cancelOrder,
};
