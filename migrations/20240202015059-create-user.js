'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(100)
      },
      phoneNumber: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30)
      },
      address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      image: {
        allowNull: false,
        type: Sequelize.TEXT
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};