module.exports = {
    up: function(queryInterface, Sequelize) {
      // logic for transforming into the new state
      return queryInterface.addColumn(
        'Users',
        'resetExpires',
       Sequelize.STRING(50),
      );
    },

    down: function(queryInterface, Sequelize) {
      // logic for reverting the changes
      return queryInterface.removeColumn(
        'Users',
        'resetExpires'
      );
    }
  }