const orderControllers = require("../controllers/order");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const router = express.Router();

// PROTECTED ROUTES
router.use(verifyToken);
router.post("/create-order", orderControllers.createOrder);
router.get("/get-order", orderControllers.getOrder);

module.exports = router;
