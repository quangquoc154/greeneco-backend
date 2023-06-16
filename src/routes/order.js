const orderControllers = require("../controllers/order");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");

const router = express.Router();

// Admin
router.use(verifyToken);
router.use(isAdmin);
router.get("/get-all-order", orderControllers.getAllOrder);

// PROTECTED ROUTES
router.use(verifyToken);
router.post("/create-order", orderControllers.createOrder);
router.post("/create-form-cart", orderControllers.createOrderFormCart);
router.get("/get-order", orderControllers.getOrder);
router.delete("/cancel-order/:orderId", orderControllers.cancelOrder);

module.exports = router;
