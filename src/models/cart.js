"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, { foreignKey: "userId" });
      Cart.belongsToMany(models.Product, { through: models.CartItem, foreignKey: "prodId" });
    }
  }
  Cart.init(
    {
      userId: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      totalPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
