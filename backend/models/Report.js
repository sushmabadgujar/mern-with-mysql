const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Report = sequelize.define(
    "Report",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        reportType: {
            type: DataTypes.ENUM(
                "USER",
                "PRODUCT",
                "ORDER",
                "SALES"
            ),
            allowNull: false,
        },

        generatedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

        format: {
            type: DataTypes.ENUM(
                "EXCEL",
                "PDF"
            ),
            allowNull: false,
        },

        filters: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        fileName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        filePath: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        tableName: "reports",
        timestamps: true,
    }
);

module.exports = Report;