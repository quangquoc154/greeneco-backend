const db = require("../models");

const addToCart = async (user, prodId) => {
  try {
    let newQuantity = 1;
    let totalAmount = 0;
    const cart = await user.getCart();
    const [productCart] = await cart.getProducts({
      where: { id: prodId },
    });
    if (productCart) {
      newQuantity = productCart.CartItem.quantity + 1;
    }

    // Add product into cart (No product in cart / Exist product in cart)
    const product = await db.Product.findOne({
      where: { id: prodId },
    });
    const totalPrice = product.price * newQuantity
    
    await cart.addProduct(product, { through: { quantity: newQuantity, totalPrice } });

    // Calculate total amount of cart
    const products = await cart.getProducts();
    products.map(product => {
      totalAmount += product.price * product.CartItem.quantity
    })
    await cart.update({
      totalAmount: totalAmount
    })

    return {
      message: "Add to cart successfully",
    }
  } catch (error) {
    throw new Error(error)
  }
};

const getCart = async(user) => {
  try {
    const cart = await user.getCart();
    const products = await cart.getProducts();
    return {
      message: products > 0 ? "Get item in cart successfully" : "No product in cart",
      productsData: products
    };
  } catch (error) {
    throw new Error(error)
  }
};

const deleteCartItem = async(user, prodId) => {
  try {
    const cart = await user.getCart();
    const [product] = await cart.getProducts({
      where: { id: prodId }
    })
    console.log(product);
    await product.CartItem.destroy();
    return {
      message: "Delete item in cart successfully",
    };
  } catch (error) {
    throw new Error(error)
  }
};

module.exports = {
  addToCart,
  getCart,
  deleteCartItem,
};