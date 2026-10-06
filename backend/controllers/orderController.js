const {
    Order,
    OrderItem,
    Cart,
    CartItem,
    Product, User
} = require("../models");
const createNotification = require("../config/createNotification");
const {
    sendOrderConfirmationEmail
} = require("../utils/emailService");

const placeOrder = async (req, res) => {
    const transaction = await Order.sequelize.transaction();

    try {
        const userId = req.user.id;

        const {
            buyNow = false,
            productId,
            quantity,
            firstName,
            lastName,
            email,
            mobile,
            address,
            city,
            state,
            pincode,
        } = req.body;

        let orderItems = [];
        let totalAmount = 0;
        let cart = null;

        // =========================
        // BUY NOW
        // =========================
        if (buyNow) {
            if (!productId || !quantity || Number(quantity) <= 0) {
                await transaction.rollback();

                return res.status(400).json({
                    message: "Product and valid quantity are required.",
                });
            }

            const product = await Product.findByPk(productId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (!product) {
                await transaction.rollback();

                return res.status(404).json({
                    message: "Product not found.",
                });
            }

            const orderQuantity = Number(quantity);

            if (orderQuantity > product.stock) {
                await transaction.rollback();

                return res.status(400).json({
                    message: `${product.name} has insufficient stock.`,
                });
            }

            const price = Number(product.price);
            const subtotal = price * orderQuantity;

            orderItems.push({
                productId: product.id,
                quantity: orderQuantity,
                price,
                subtotal,
            });

            totalAmount = subtotal;
        }

        // =========================
        // CART CHECKOUT
        // =========================
        else {
            cart = await Cart.findOne({
                where: {
                    userId,
                },
                include: [
                    {
                        model: CartItem,
                        as: "items",
                        include: [
                            {
                                model: Product,
                                as: "product",
                            },
                        ],
                    },
                ],
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (!cart || !cart.items.length) {
                await transaction.rollback();

                return res.status(400).json({
                    message: "Cart is empty.",
                });
            }

            for (const item of cart.items) {
                const product = item.product;
                const itemQuantity = Number(item.quantity);

                if (!product) {
                    await transaction.rollback();

                    return res.status(400).json({
                        message: "Product not found for cart item.",
                    });
                }

                if (itemQuantity > product.stock) {
                    await transaction.rollback();

                    return res.status(400).json({
                        message: `${product.name} has insufficient stock.`,
                    });
                }

                const price = Number(product.price);
                const subtotal = price * itemQuantity;

                orderItems.push({
                    productId: product.id,
                    quantity: itemQuantity,
                    price,
                    subtotal,
                });

                totalAmount += subtotal;
            }
        }

        // =========================
        // CREATE ORDER
        // =========================
        const order = await Order.create(
            {
                userId,
                firstName,
                lastName,
                email,
                mobile,
                address,
                city,
                state,
                pincode,
                totalAmount,
                status: "Pending",
            },
            {
                transaction,
            }
        );

        // =========================
        // CREATE ORDER ITEMS
        // =========================
        for (const item of orderItems) {
            await OrderItem.create(
                {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.subtotal,
                },
                {
                    transaction,
                }
            );

            await Product.decrement(
                "stock",
                {
                    by: item.quantity,
                    where: {
                        id: item.productId,
                    },
                    transaction,
                }
            );
        }

        // =========================
        // CLEAR CART ONLY
        // FOR NORMAL CART CHECKOUT
        // =========================
        if (!buyNow && cart) {
            await CartItem.destroy({
                where: {
                    cartId: cart.id,
                },
                transaction,
            });

            await cart.destroy({
                transaction,
            });
        }

        const admins = await User.findAll({
            where: {
                role: "admin",
            },
            transaction,
        });
        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                title: "New Order",
                message: `New order #${order.id} has been placed.`,
                type: "ORDER",
                referenceId: order.id,
                transaction,
            });
        }
        await createNotification({
            userId,
            title: "Order Placed",
            message: `Your order #${order.id} has been placed successfully.`,
            type: "ORDER",
            referenceId: order.id,
            transaction,
        });

        const user = await User.findByPk(userId);
        const emailOrder = {
            id: order.id,
            status: order.status,
            total: totalAmount,
            items: orderItems.map((item) =>
            ({
                productName: item.name || "Product", quantity: item.quantity,
                price: item.price,productImage: item.productImage,
            })),
        };
        await transaction.commit();
        await sendOrderConfirmationEmail(user, emailOrder);
        return res.status(201).json({
            message: "Order placed successfully.",
            orderId: order.id,
            totalAmount,
        });
    } catch (error) {
        await transaction.rollback();

        console.error("Place order error:", error);

        return res.status(500).json({
            message: "Failed to place order.",
            error: error.message,
        });
    }
};
const getOrderDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await Order.findOne({
            where: {
                id,
                userId,
            },
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get order details",
            error: error.message,
        });
    }
};
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: {
                userId,
            },
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get order history",
            error: error.message,
        });
    }
};
const getAllOrders = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 5,
            search = "",
            sortBy = "id",
            sortOrder = "DESC",
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const { Op } = require("sequelize");

        const whereCondition = {};

        if (search.trim()) {
            whereCondition[Op.or] = [
                {
                    "$user.name$": {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    "$user.email$": {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    id: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        const allowedSortFields = [
            "id",
            "totalAmount",
            "status",
            "createdAt",
        ];

        if (!allowedSortFields.includes(sortBy)) {
            sortBy = "id";
        }

        sortOrder =
            String(sortOrder).toUpperCase() === "ASC"
                ? "ASC"
                : "DESC";

        const { count, rows } = await Order.findAndCountAll({
            where: whereCondition,

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                    ],
                },
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: [
                                "id",
                                "name",
                                "price",
                                "productImage",
                            ],
                        },
                    ],
                },
            ],

            order: [[sortBy, sortOrder]],

            limit,
            offset,

            distinct: true,
        });

        return res.status(200).json({
            message: "Orders fetched successfully.",

            data: {
                orders: rows,
                totalOrders: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        console.error("Get All Orders Error:", error);

        return res.status(500).json({
            message: "Unable to fetch orders.",
            error: error.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status.",
            });
        }

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully.",
            order,
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);

        return res.status(500).json({
            message: "Unable to update order status.",
            error: error.message,
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const whereCondition = {
            id,
        };

        if (req.user.role !== "admin") {
            whereCondition.userId = req.user.id;
        }

        const order = await Order.findOne({
            where: whereCondition,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        if (
            order.status === "Shipped" ||
            order.status === "Delivered"
        ) {
            return res.status(400).json({
                message: "This order cannot be cancelled.",
            });
        }

        order.status = "Cancelled";

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully.",
            order,
        });
    } catch (error) {
        console.error("Cancel Order Error:", error);

        return res.status(500).json({
            message: "Unable to cancel order.",
            error: error.message,
        });
    }
};
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const whereCondition = {
            id,
        };

        if (req.user.role !== "admin") {
            whereCondition.userId = req.user.id;
        }

        const order = await Order.findOne({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                    ],
                },
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: [
                                "id",
                                "name",
                                "price",
                                "productImage",
                            ],
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully.",
            order,
        });
    } catch (error) {
        console.error("Get Order Error:", error);

        return res.status(500).json({
            message: "Unable to fetch order.",
            error: error.message,
        });
    }
};
module.exports = {
    getOrderById, placeOrder, getOrderDetails, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder
};