const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");

Category.hasMany(Product, {
foreignKey: "categoryId",
as: "products",
onDelete: "RESTRICT",
onUpdate: "CASCADE",
});

Product.belongsTo(Category, {
foreignKey: "categoryId",
as: "category",
onDelete: "RESTRICT",
onUpdate: "CASCADE",
});

module.exports = {
User,
Category,
Product,
};
