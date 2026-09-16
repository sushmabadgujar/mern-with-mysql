const { Cart, CartItem, Product } = require("../models");
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
            });
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const cart = await Cart.findOrCreate({
            where: {
                userId,
            },
            defaults: {
                userId,
            },
        });

        const userCart = cart[0];

        const existingItem = await CartItem.findOne({
            where: {
                cartId: userCart.id,
                productId,
            },
        });

        const qty = quantity ? Number(quantity) : 1;

        if (qty <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0",
            });
        }

        if (existingItem) {
            existingItem.quantity += qty;
            await existingItem.save();

            return res.status(200).json({
                message: "Product quantity updated in cart",
                item: existingItem,
            });
        }

        const item = await CartItem.create({
            cartId: userCart.id,
            productId,
            quantity: qty,
        });

        return res.status(201).json({
            message: "Product added to cart",
            item,
        });
    } catch (error) {
        console.error("Add To Cart Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("user",userId);
        const cart = await Cart.findOne({
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
        });

        if (!cart) {
            return res.status(200).json({
                cart: null,
                items: [],
                total: 0,
            });
        }

        let total = 0;

        const items = cart.items.map((item) => {
            const price = Number(item.product.price);
            const subtotal = price * item.quantity;

            total += subtotal;

            return {
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                product: item.product,
                subtotal,
            };
        });

        return res.status(200).json({
            cartId: cart.id,
            items,
            total,
        });
    } catch (error) {
        console.error("Get Cart Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || Number(quantity) <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0",
            });
        }

        const cart = await Cart.findOne({
            where: {
                userId,
            },
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const item = await CartItem.findOne({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });

        if (!item) {
            return res.status(404).json({
                message: "Cart item not found",
            });
        }

        item.quantity = Number(quantity);

        await item.save();

        return res.status(200).json({
            message: "Cart quantity updated",
            item,
        });
    } catch (error) {
        console.error("Update Cart Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({
            where: {
                userId,
            },
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        await CartItem.destroy({
            where: {
                cartId: cart.id,
            },
        });

        return res.status(200).json({
            message: "Cart cleared successfully",
        });
    } catch (error) {
        console.error("Clear Cart Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.findAll({
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
            order: [["id", "DESC"]],
        });

        const data = carts.map((cart) => {
            let total = 0;

            const items = cart.items.map((item) => {
                const price = Number(item.product?.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const subtotal = price * quantity;

                total += subtotal;

                return {
                    id: item.id,
                    productId: item.productId,
                    quantity,
                    price,
                    subtotal,
                    product: item.product,
                };
            });

            return {
                cartId: cart.id,
                userId: cart.userId,
                items,
                total,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
            };
        });

        return res.status(200).json({
            carts: data,
        });
    } catch (error) {
        console.error("Get All Carts Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    // removeFromCart,
    getAllCarts,
    clearCart,
};