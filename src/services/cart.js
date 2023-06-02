const db = require("../models");

const addToCart = async (user, { prodId, quantity }) => {
  try {
    let newQuantity = +quantity;
    const cart = await user.getCart();
    const [productCart] = await cart.getProducts({
      where: { id: prodId },
    });
    if (productCart) {
      newQuantity += productCart.CartItem.quantity;
    }

    // Add product into cart (No product in cart / Exist product in cart)
    const product = await db.Product.findByPk(prodId);
    const totalPrice = product.price * newQuantity;
    await cart.addProduct(product, { through: { quantity: newQuantity, totalPrice } });

    // Calculate total amount of cart
    const products = await cart.getProducts();
    const totalAmount = products.reduce((sum, product) => sum + (product.price * product.CartItem.quantity), 0);
    // products.map(product => {
    //   totalAmount += product.price * product.CartItem.quantity
    // })
    await cart.update({
      totalAmount: totalAmount
    })

    return {
      message: product ? "Add to cart successfully" : "Has error when add product to cart",
    }
  } catch (error) {
    throw new Error(error)
  }
};

const getCart = async(user) => {
  try {
    const cart = await user.getCart({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      }
    });
    const products = await cart.getProducts({
      attributes: {
        exclude: ["available", "dateOfManufacture", "madeIn", "certificate", "fileName", "createdAt", "updatedAt"],
      }
    });
    return {
      message: cart.length > 0 ? "Get item in cart successfully" : "No product in cart",
      cartData: cart,
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