'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("activity_logs", {
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

            action: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            module: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            referenceId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
            },

            ipAddress: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            userAgent: {
                type: Sequelize.TEXT,
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
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("activity_logs");
  }
};
