const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const OrderItem = require("./OrderItem");
const Order = require("./Order");
const Wishlist = require("./Wishlist");
const Notification = require("./Notification");
const ActivityLog = require("./ActivityLog");
const Report = require("./Report");
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

User.hasMany(Order, {
    foreignKey: "userId",
    as: "orders",
});

Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    as: "items",
});

OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
});

OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});

Product.hasMany(OrderItem, {
    foreignKey: "productId",
    as: "orderItems",
});
User.hasMany(Wishlist, {
    foreignKey: "userId",
    as: "wishlists",
});
Wishlist.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});
Product.hasMany(Wishlist, {
    foreignKey: "productId",
    as: "wishlists",
});
Wishlist.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});
User.hasMany(Notification, {
    foreignKey: "userId",
    as: "notifications",
});

Notification.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});
User.hasMany(ActivityLog, {
    foreignKey: "userId",
    as: "activityLogs",
});

ActivityLog.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});
User.hasMany(Report, {
    foreignKey: "generatedBy",
    as: "reports",
});

Report.belongsTo(User, {
    foreignKey: "generatedBy",
    as: "generator",
});
module.exports = {
    User,
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Wishlist,
    Notification,
    ActivityLog,
};
