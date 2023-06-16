const db = require("../models");

const createOrder = async (user, { paymentMethod, name, address, phone, prodId, quantity }, res) => {
  try {
    let totalAmount = 0;
    const product = await db.Product.findByPk(prodId);
    const totalPrice = product.price * +quantity;
    totalAmount += totalPrice;

    // Create new order
    const order = await user.createOrder({
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      name: name || user.fullname,
      address: address || user.address,
      phone: phone || user.phone,
      status: "Ordered"
    });

    // Add product form cart into order
    await order.addProduct(product, {
      through: {
        quantity: +quantity,
        totalPrice: totalPrice
      }
    });
    const status = order ? 201 : 409;
    return res.status(status).json({
      message: order ? "Create order successfully" : "Has error when create order",
    });
  } catch (error) {
    throw new Error(error);
  }
};

const createOrderFormCart = async (user, { paymentMethod, name, address, phone }, res) => {
  try {
    const cart = await user.getCart();
    const products = await cart.getProducts();

    // Create new order
    const order = await user.createOrder({
      totalAmount: cart.totalAmount,
      paymentMethod: paymentMethod,
      name: name || user.fullname,
      address: address || user.address,
      phone: phone || user.phone,
      status: "Ordered"
    });

    // Add product form cart into order
    for (let product of products) {
      await order.addProduct(product, {
        through: {
          quantity: product.CartItem.quantity,
          totalPrice: product.CartItem.totalPrice
        }
      });
    }
    // Delete the current cart after the order has been created
    await cart.setProducts(null);

    const status = order ? 201 : 409;
    return res.status(status).json({
      message: order ? "Create order successfully" : "Has error when create order",
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getOrder = async (user, res) => {
  try {
    const orders = await user.getOrders({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [ {
        model: db.Product,
        through: {
          attributes: {
            exclude: ["orderId", "prodId", "createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["available", "description", "dateOfManufacture", "madeIn", "certificate", "fileName", "createdAt", "updatedAt"],
        },
      }],
      // include: [
      //   { model: db.Product, attributes: ["id", "title", "price", "imageUrl", "category"] },
      // ],
    });
    return res.status(200).json({
      message: orders.length > 0 ? "Get order successfully" : "No order in your account",
      ordersData: orders
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllOrder = async (res) => {
  try {
    const orders = await db.Order.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [ {
        model: db.Product,
        through: {
          attributes: {
            exclude: ["orderId", "prodId", "createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["available", "description", "dateOfManufacture", "madeIn", "certificate", "fileName", "createdAt", "updatedAt"],
        },
      }],
    });
    return res.status(200).json({
      message: orders.length > 0 ? "Get order successfully" : "No order in database",
      ordersData: orders
    });
  } catch (error) {
    throw new Error(error);
  }
};

const cancelOrder = async(user, orderId, res) => {
  try {
    const order = await db.Order.findOne({
      where: { id: orderId, userId: user.id },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order has already been cancelled"
      });
    }
    
    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
    });
  } catch (error) {
    throw new Error(error)
  }
};

module.exports = {
  createOrder,
  createOrderFormCart,
  getOrder,
  getAllOrder,
  cancelOrder,
};
