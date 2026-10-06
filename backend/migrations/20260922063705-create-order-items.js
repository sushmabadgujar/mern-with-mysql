'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("order_items", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "orders",
                    key: "id",
                },

                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "products",
                    key: "id",
                },

                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },

            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },

            subtotal: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
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
      await queryInterface.dropTable("order_items");
  }
};
