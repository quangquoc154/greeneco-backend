"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "userId" });
      Order.belongsToMany(models.Product, {
        through: models.OrderItem,
        foreignKey: "orderId",
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.STRING,
      totalAmount: DataTypes.FLOAT,
      paymentMethod: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
