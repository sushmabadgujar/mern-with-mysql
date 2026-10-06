'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            totalAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM(
                    "Pending",
                    "Confirmed",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Cancelled"
                ),
                allowNull: false,
                defaultValue: "Pending",
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
    await queryInterface.dropTable("orders");

        await queryInterface.sequelize.query(
            "DROP TYPE IF EXISTS `enum_orders_status`;"
        );
  }
};
