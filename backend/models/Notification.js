const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        type: {
            type: DataTypes.ENUM(
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
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "notifications",
        timestamps: true,
    }
);

module.exports = Notification;