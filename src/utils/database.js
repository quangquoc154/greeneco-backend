const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("greeneco_db", "root", 'Tin@1542002', {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectionDatabase();

// module.exports = sequelize;
