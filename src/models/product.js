"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.Cart, { through: models.CartItem, foreignKey: 'prodId' });
      Product.hasMany(models.Feedback, { foreignKey: 'prodId' });
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.FLOAT,
      available: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING,
      description: DataTypes.TEXT,
      dateOfManufacture: DataTypes.INTEGER,
      madeIn: DataTypes.STRING,
      certificate: DataTypes.STRING,
      fileName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
