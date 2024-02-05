"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30),
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      stock: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      image: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Items");
  },
};
