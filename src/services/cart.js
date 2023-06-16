const db = require("../models");

const addToCart = async (user, { prodId, quantity }, res) => {
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
    
    await cart.update({
      totalAmount: totalAmount
    })

    const status = product ? 200 : 404;
    return res.status(status).json({
      message: product ? "Add to cart successfully" : "Has error when add product to cart",
    });
  } catch (error) {
    throw new Error(error)
  }
};

const editQuantity = async (user, { prodId, quantity }, res) => {
  try {
    let newQuantity = +quantity;
    const cart = await user.getCart();
    const [productCart] = await cart.getProducts({
      where: { id: prodId },
    });
    if (productCart) {
      productCart.CartItem.quantity = newQuantity;
    }

    // Add product into cart (No product in cart / Exist product in cart)
    const product = await db.Product.findByPk(prodId);
    const totalPrice = product.price * newQuantity;
    await cart.addProduct(product, { through: { quantity: newQuantity, totalPrice } });

    // Calculate total amount of cart
    const products = await cart.getProducts();
    const totalAmount = products.reduce((sum, product) => sum + (product.price * product.CartItem.quantity), 0);
    
    await cart.update({
      totalAmount: totalAmount
    })

    const status = product ? 200 : 404;
    return res.status(status).json({
      message: product ? "Edit quantity successfully" : "Has error when edit quantity cart",
    });
  } catch (error) {
    throw new Error(error)
  }
};


const getCart = async(user, res) => {
  try {
    const cart = await user.getCart({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [ {
        model: db.Product,
        through: {
          attributes: {
            exclude: ["cartId", "prodId", "createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["available", "description", "dateOfManufacture", "madeIn", "certificate", "fileName", "createdAt", "updatedAt"],
        },
      }]
    });
    // const products = await cart.getProducts({
    //   attributes: {
    //     exclude: ["available", "description","dateOfManufacture", "madeIn", "certificate", "fileName", "createdAt", "updatedAt"],
    //   },
    // });
    return res.status(200).json({
      message: cart.Products.length > 0 ? "Get item in cart successfully" : "No product in cart",
      cartData: cart,
    });
  } catch (error) {
    throw new Error(error)
  }
};

const deleteCartItem = async(user, prodId, res) => {
  try {
    const cart = await user.getCart();
    const [product] = await cart.getProducts({
      where: { id: prodId }
    })
    console.log(product);
    await product.CartItem.destroy();

    const status = product ? 200 : 404;
    return res.status(status).json({
      message: product ? "Delete item in cart successfully" : "Has error when delete item in cart",
    });
  } catch (error) {
    throw new Error(error)
  }
};

module.exports = {
  addToCart,
  editQuantity,
  getCart,
  deleteCartItem,
};