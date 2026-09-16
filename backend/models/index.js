const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
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
// User - Cart
User.hasOne(Cart, {
    foreignKey: "userId",
    as: "cart",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// Cart - CartItem
Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    as: "items",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

CartItem.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
});

// Product - CartItem
Product.hasMany(CartItem, {
    foreignKey: "productId",
    as: "cartItems",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

CartItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});
module.exports = {
    User,
    Category,
    Product,
    Cart,
    CartItem,
};
