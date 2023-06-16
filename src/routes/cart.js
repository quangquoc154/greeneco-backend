const cartControllers = require("../controllers/cart");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");
const createCart = require("../middlewares/create_cart")

const router = express.Router();

// PROTECTED ROUTES
router.use(verifyToken);
router.use(createCart);
router.post("/add-to-cart", cartControllers.addToCart);
router.put("/edit-quantity", cartControllers.editQuantity); 
router.get("/get-cart", cartControllers.getCart);
router.delete("/delete-cart-item", cartControllers.deleteCartItem);

module.exports = router;
