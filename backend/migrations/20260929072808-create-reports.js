'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("reports", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            reportType: {
                type: Sequelize.ENUM(
                    "USER",
                    "PRODUCT",
                    "ORDER",
                    "SALES"
                ),
                allowNull: false,
            },

            generatedBy: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            format: {
                type: Sequelize.ENUM(
                    "EXCEL",
                    "PDF"
                ),
                allowNull: false,
            },

            filters: {
                type: Sequelize.JSON,
                allowNull: true,
            },

            fileName: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            filePath: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
            },
        });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable("reports");
  }
};
