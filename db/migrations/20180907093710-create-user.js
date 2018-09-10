'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      hash_password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      username: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull:false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull:true
      },
      token: {
        type: Sequelize.TEXT,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};