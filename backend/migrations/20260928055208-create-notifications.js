'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            userId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            type: {
                type: Sequelize.ENUM(
                    "ORDER",
                    "PRODUCT",
                    "WISHLIST",
                    "CART",
                    "SYSTEM"
                ),
                allowNull: false,
                defaultValue: "SYSTEM",
            },

            referenceId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
            },

            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable("notifications");
  }
};
