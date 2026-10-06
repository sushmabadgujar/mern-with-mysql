import React, { useEffect, useState } from "react";
// import {
//   getMyCart,
//   updateCartItem,
//   removeCartItem,
// } from "../api/cartApi";
// // import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { getMyCart,updateCartItem,removeCartItem} from "../../api/cartApi";
import "../../style/cart.css";
const Cart = () => {
    const navigate = useNavigate();
  const [cart, setCart] = useState({
    cartId: null,
    items: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getMyCart();
      setCart({
        cartId: response.data?.cartId || null,
        items: response.data?.items || [],
        total: response.data?.total || 0,
      });
    } catch (error) {
      console.error("Get cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantity = async (itemId, quantity, stock) => {
    if (quantity < 1) {
      return;
    }

    if (quantity > stock) {
      return;
    }

    try {
      await updateCartItem(itemId, {
        quantity,
      });

      fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);

      fetchCart();
    } catch (error) {
      console.error("Remove cart item error:", error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 cart-page">

      <div className="mb-4">
        <h2 className="fw-bold">Shopping Cart</h2>
        <p className="text-muted">
          Review your selected products
        </p>
      </div>

      {!cart.items.length ? (
        <div className="cart-empty text-center">
          <div className="cart-empty-icon">
            🛒
          </div>

          <h3>Your Cart is Empty</h3>

          <p className="text-muted">
            You haven't added any products yet.
          </p>

          <a href="/shop" className="btn btn-dark">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="row g-4">

          {/* Cart Items */}

          <div className="col-lg-8">

            {cart.items.map((item) => {
              const product = item.product;

              return (
                <div
                  className="card cart-item-card mb-3"
                  key={item.id}
                >
                  <div className="card-body">

                    <div className="row align-items-center">

                      {/* Product Image */}

                      <div className="col-md-2 mb-3 mb-md-0">

                        {product?.productImage ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
                            alt={product?.name}
                            className="cart-product-image"
                          />
                        ) : (
                          <div className="cart-no-image">
                            No Image
                          </div>
                        )}

                      </div>

                      {/* Product Details */}

                      <div className="col-md-4">

                        <h5 className="cart-product-name">
                          {product?.name}
                        </h5>

                        <p className="text-muted mb-1">
                          ₹{product?.price}
                        </p>

                        <small className="text-muted">
                          Stock: {product?.stock}
                        </small>

                      </div>

                      {/* Quantity */}

                      <div className="col-md-3 mt-3 mt-md-0">

                        <div className="cart-quantity">

                          <button
                            type="button"
                            className="btn btn-outline-dark"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              handleQuantity(
                                item.id,
                                item.quantity - 1,
                                product?.stock
                              )
                            }
                          >
                            −
                          </button>

                          <span className="cart-quantity-value">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-dark"
                            disabled={
                              item.quantity >= product?.stock
                            }
                            onClick={() =>
                              handleQuantity(
                                item.id,
                                item.quantity + 1,
                                product?.stock
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* Subtotal + Remove */}

                      <div className="col-md-3 text-md-end mt-3 mt-md-0">

                        <h6 className="fw-bold mb-2">
                          ₹{item.subtotal}
                        </h6>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleRemove(item.id)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Cart Summary */}

          <div className="col-lg-4">

            <div className="card cart-summary-card">

              <div className="card-body">

                <h4 className="fw-bold mb-4">
                  Cart Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Items</span>

                  <span>
                    {cart.items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>

                  <span>
                    ₹{cart.total}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>

                  <span className="text-success">
                    Free
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>

                  <strong>
                    ₹{cart.total}
                  </strong>
                </div>

                <button
                  type="button"
                  className="btn btn-dark w-100 cart-checkout-btn"
                  onClick={() => navigate("/check-out")}
                >
                   
                  Proceed to Checkout
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;