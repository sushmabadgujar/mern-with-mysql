const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define(
    "ActivityLog",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        module: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        referenceId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },

        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "activity_logs",
        timestamps: true,
    }
);

module.exports = ActivityLog;