const {User, Cart, CartItem, Product,Category } = require("../models");
const { Op } = require("sequelize");
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

        const whereCondition = {};

        // Search
        if (search.trim()) {
            const searchValue = search.trim();

            whereCondition[Op.or] = [
                {
                    "$user.name$": {
                        [Op.like]: `%${searchValue}%`,
                    },
                },
                {
                    "$user.email$": {
                        [Op.like]: `%${searchValue}%`,
                    },
                },
                {
                    "$items.product.name$": {
                        [Op.like]: `%${searchValue}%`,
                    },
                },
                {
                    "$items.quantity$": {
                        [Op.like]: `%${searchValue}%`,
                    },
                },
            ];
        }

        const { count, rows } = await Cart.findAndCountAll({
            where: whereCondition,

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "mobileNumber",
                        "role",
                        "status",
                    ],
                },
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

            limit,
            offset,

            order: [[sortBy, sortOrder]],

            distinct: true,
        });

        // Format cart data
        const data = rows.map((cart) => {
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

                user: cart.user
                    ? {
                          id: cart.user.id,
                          name: cart.user.name,
                          email: cart.user.email,
                          mobileNumber: cart.user.mobileNumber,
                          role: cart.user.role,
                          status: cart.user.status,
                      }
                    : null,

                items,
                total,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
            };
        });

        console.log(
            "Final Cart Data:",
            JSON.stringify(data, null, 2)
        );

        return res.status(200).json({
            carts: data,

            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error("Get All Carts Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

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

              include: [
                {
                  model: Category,
                  as: "category",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(200).json({
        cartId: null,
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
    console.error("Get cart error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

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

    const cartItem = await CartItem.findOne({
      where: {
        id,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await cartItem.destroy();
    const remainingItems = await CartItem.count({
            where: {
                cartId: cart.id,
            },
        });

        if (remainingItems === 0) {
            await cart.destroy();

            return res.status(200).json({
                message: "Product removed and cart deleted",
            });
        }

    return res.status(200).json({
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findByPk(cartId);

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

        await cart.destroy();

        return res.status(200).json({
            message: "Cart deleted successfully",
        });
    } catch (error) {
        console.error("Delete Cart Error:", error);

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
    removeCartItem,
    getAllCarts,
    clearCart,getMyCart,deleteCart
};