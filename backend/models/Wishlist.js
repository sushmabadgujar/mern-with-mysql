const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Wishlist = sequelize.define(
    "Wishlist",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "wishlists",
        timestamps: true,
    }
);

module.exports = Wishlist;