const db = require("../models");

const createOrder = async (user, { paymentMethod, name, address, phone, prodId, quantity }) => {
  try {
    let totalAmount = 0;
    const product = await db.Product.findByPk(prodId);
    const totalPrice = product.price * +quantity;
    totalAmount += totalPrice;

    if (!name && !address && !phone) {
      name = user.fullname,
      address = user.address,
      phone = user.phone
    }
    // Create new order
    const order = await user.createOrder({
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      name: name,
      address: address,
      phone: phone,
    });

    // Add product form cart into order
    await order.addProduct(product, {
      through: {
        quantity: +quantity,
        totalPrice: totalPrice
      }
    });

    return {
      message: order ? "Create order successfully" : "",
    };
  } catch (error) {
    throw new Error(error);
  }
};

const createOrderFormCart = async (user, { paymentMethod, name, address, phone }) => {
  try {
    const cart = await user.getCart();
    const products = await cart.getProducts();

    if (!name && !address && !phone) {
      name = user.fullName,
      address = user.address,
      phone = user.phone
    }
    // Create new order
    const order = await user.createOrder({
      totalAmount: cart.totalAmount,
      paymentMethod: paymentMethod,
      name: name,
      address: address,
      phone: phone,
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

    return {
      message: order ? "Create order successfully" : "",
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getOrder = async (user) => {
  try {
    const orders = await user.getOrders({
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      include: [
        { model: db.Product, attributes: ["id", "title", "price", "imageUrl", "category"] },
      ],
    });
    return {
      message: orders.length > 0 ? "Get order successfully" : "No order in your account",
      userData: user,
      ordersData: orders
    };
  } catch (error) {
    throw new Error(error);
  }
};

const cancelOrder = async(user, orderId) => {
  try {
    const order = await db.Order.findOne({
      where: { id: orderId, userId: user.id },
    });

    if (!order) {
      return { message: "Order not found" };
    }
    if (order.status === "cancelled") {
      return { message: "Order has already been cancelled" };
    }
    
    order.status = "cancelled";
    await order.save();

    return {
      message: "Order cancelled successfully",
    };
  } catch (error) {
    throw new Error(error)
  }
};

module.exports = {
  createOrder,
  createOrderFormCart,
  getOrder,
  cancelOrder,
};
