const createOrder = async (user, { name, address, phone, note }) => {
  try {
    const cart = await user.getCart();
    const products = await cart.getProducts();
    console.log(name, address, phone, note);

    // // Calculate total amount
    // let totalAmount = 0;
    // products.map(product => {
    //   totalAmount += product.price * product.CartItem.quantity
    // })
    
    // Create new order
    const order = await user.createOrder({
      totalAmount: cart.totalAmount,
      paymentMethod: 'Banking',
      name: name,
      address: address,
      phone: phone,
      note: note,
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
    // await cart.setProducts(null);

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
      include: ["Products"],
    });
    return {
      message:
        orders > 0 ? "Get order successfully" : "No order in your account",
      ordersData: orders,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createOrder,
  getOrder,
};
