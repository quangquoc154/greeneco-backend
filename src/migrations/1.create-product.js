("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: Sequelize.STRING(50),
      price: Sequelize.FLOAT,
      available: Sequelize.INTEGER,
      imageUrl: Sequelize.STRING,
      description: Sequelize.TEXT,
      dateOfManufacture: Sequelize.INTEGER,
      madeIn: Sequelize.STRING(50),
      certificate: Sequelize.STRING(50),
      category: Sequelize.STRING(20),
      fileName: Sequelize.STRING(50),
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
