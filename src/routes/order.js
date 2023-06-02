const orderControllers = require("../controllers/order");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const router = express.Router();

// PROTECTED ROUTES
router.use(verifyToken);
router.post("/create-order", orderControllers.createOrder);
router.post("/create-form-cart", orderControllers.createOrderFormCart);
router.get("/get-order", orderControllers.getOrder);
router.delete("/cancel-order/:orderId", orderControllers.cancelOrder);

module.exports = router;
