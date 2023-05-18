const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

// router.get("/", shopController.getIndex);

// router.get("/products/:productId", shopController.getProduct);

// router.get("/cart", shopController.getCart);

// router.post("/cart", shopController.postCart);

// router.delete("/cart-delete-item", shopController.postCartDeleteItem);

// router.post("/create-order", shopController.postOrder);

// router.get("/orders", shopController.getOrders);

router.get("/", (req, res, next) => {
  res.status(200).send("hello world");
});

router.get("/ab*cd", (req, res, next) => {
  res.status(201).send("ab*cd");
});

module.exports = router;
