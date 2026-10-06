import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyCart } from "../../api/cartApi";
import { getProductById} from "../../api/productApi";
import { placeOrder } from "../../api/orderApi";
import { showSuccess, showError } from "../../utils/toast";
import "../../style/checkout.css";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const buyNow = location.state?.buyNow === true;
    const buyNowProductId = location.state?.productId;
    const buyNowQuantity = Number(location.state?.quantity) || 1;

    const [cart, setCart] = useState({
        cartId: null,
        items: [],
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const fetchCheckoutData = async () => {
        try {
            setLoading(true);
            if (buyNow) {
              
                if (!buyNowProductId) {
                    showError("Product information is missing.");
                    // navigate("/shop");
                    return;
                }
                
                const response = await getProductById(buyNowProductId);

                const product = response.data?.data || response.data;

                if (!product) {
                    showError("Product not found.");
                    navigate("/shop");
                    return;
                }

                const subtotal =
                    Number(product.price) * buyNowQuantity;

                setCart({
                    cartId: null,
                    items: [
                        {
                            id: `buy-now-${product.id}`,
                            product,
                            quantity: buyNowQuantity,
                            subtotal,
                        },
                    ],
                    total: subtotal,
                });

                return;
            }

            const response = await getMyCart();

            const items = response.data?.items || [];
            const total = Number(response.data?.total) || 0;

            setCart({
                cartId: response.data?.cartId || null,
                items,
                total,
            });
        } catch (error) {
            console.error("Checkout data error:", error);

            showError(
                error.response?.data?.message ||
                    "Unable to load checkout."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCheckoutData();
    }, [buyNow, buyNowProductId, buyNowQuantity]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cart.items.length) {
            showError("No product available for checkout.");
            return;
        }

        try {
            setPlacingOrder(true);

            const payload = {
                ...formData,
                buyNow,
            };

            if (buyNow) {
                payload.productId = buyNowProductId;
                payload.quantity = buyNowQuantity;
            }

            await placeOrder(payload);

            showSuccess("Order placed successfully.");

            navigate("/my-orders");
        } catch (error) {
            console.error("Place order error:", error);

            showError(
                error.response?.data?.message ||
                    "Failed to place order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    const totalItems = cart.items.reduce(
        (total, item) => total + Number(item.quantity),
        0
    );

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status"></div>

                <p className="mt-3">
                    Loading checkout...
                </p>
            </div>
        );
    }

    if (!cart.items.length) {
        return (
            <div className="container py-5 text-center checkout-empty">
                <div className="checkout-empty-icon">
                    🛒
                </div>

                <h3>
                    {buyNow
                        ? "Product Not Available"
                        : "Your Cart is Empty"}
                </h3>

                <p className="text-muted">
                    {buyNow
                        ? "The selected product is no longer available."
                        : "Add some products before proceeding to checkout."}
                </p>

                <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => navigate("/shop")}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5 checkout-page">
            <div className="mb-4">
                <h2 className="fw-bold">
                    Checkout
                </h2>

                <p className="text-muted">
                    Complete your information to place your order
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="card checkout-card mb-4">
                            <div className="card-body">
                                <h4 className="fw-bold mb-4">
                                    Customer Information
                                </h4>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Mobile Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="mobile"
                                            className="form-control"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card checkout-card">
                            <div className="card-body">
                                <h4 className="fw-bold mb-4">
                                    Shipping Address
                                </h4>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            className="form-control"
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            className="form-control"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            className="form-control"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            maxLength="6"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card checkout-summary-card">
                            <div className="card-body">
                                <h4 className="fw-bold mb-4">
                                    Your Order
                                </h4>

                                <div className="checkout-products">
                                    {cart.items.map((item) => {
                                        const product = item.product;

                                        return (
                                            <div
                                                className="checkout-product"
                                                key={item.id}
                                            >
                                                <div className="checkout-product-image-wrapper">
                                                    {product?.productImage ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
                                                            alt={product?.name}
                                                            className="checkout-product-image"
                                                        />
                                                    ) : (
                                                        <div className="checkout-no-image">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="checkout-product-info">
                                                    <h6>
                                                        {product?.name}
                                                    </h6>

                                                    <p>
                                                        ₹{product?.price} ×{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>

                                                <strong>
                                                    ₹{item.subtotal}
                                                </strong>
                                            </div>
                                        );
                                    })}
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-3">
                                    <span>
                                        Items
                                    </span>

                                    <span>
                                        {totalItems}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹{cart.total}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>
                                        Shipping
                                    </span>

                                    <span className="text-success">
                                        Free
                                    </span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <strong className="fs-5">
                                        Total
                                    </strong>

                                    <strong className="fs-5">
                                        ₹{cart.total}
                                    </strong>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 checkout-place-order-btn"
                                    disabled={placingOrder}
                                >
                                    {placingOrder
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-dark w-100 mt-2"
                                    onClick={() =>
                                        navigate(
                                            buyNow
                                                ? "/shop"
                                                : "/cart"
                                        )
                                    }
                                    disabled={placingOrder}
                                >
                                    {buyNow
                                        ? "Back to Shop"
                                        : "Back to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;

// import { useNavigate, useLocation } from "react-router-dom";
// import { getMyCart } from "../../api/cartApi";
// import { placeOrder } from "../../api/orderApi";
// import { showSuccess, showError } from "../../utils/toast";
// import "../../style/checkout.css";
// const Checkout = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const buyNow = location.state?.buyNow === true;
//     const buyNowProductId = location.state?.productId;
//     const buyNowQuantity = location.state?.quantity || 1;
//     const [cart, setCart] = useState({
//         cartId: null,
//         items: [],
//         total: 0,
//     });

//     const [loading, setLoading] = useState(true);

//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         mobile: "",
//         address: "",
//         city: "",
//         state: "",
//         pincode: "",
//     });

//     const fetchCart = async () => {
//         try {
//             setLoading(true);

//             const response = await getMyCart();

//             setCart({
//                 cartId: response.data?.cartId || null,
//                 items: response.data?.items || [],
//                 total: response.data?.total || 0,
//             });
//         } catch (error) {
//             console.error("Get cart error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     const fetchCheckoutData = async () => {
//         try {
//             setLoading(true);

//             if (buyNow) {
//                 const response = await getProductById(buyNowProductId);

//                 const product = response.data?.data || response.data;

//                 const subtotal =
//                     Number(product.price) * Number(buyNowQuantity);

//                 setCart({
//                     cartId: null,
//                     items: [
//                         {
//                             id: `buy-now-${product.id}`,
//                             product,
//                             quantity: buyNowQuantity,
//                             subtotal,
//                         },
//                     ],
//                     total: subtotal,
//                 });

//                 return;
//             }

//             const response = await getMyCart();

//             setCart({
//                 cartId: response.data?.cartId || null,
//                 items: response.data?.items || [],
//                 total: response.data?.total || 0,
//             });
//         } catch (error) {
//             console.error("Checkout data error:", error);

//             showError(
//                 error.response?.data?.message ||
//                 "Unable to load checkout."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchCart();
//         fetchCheckoutData();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // const response = await placeOrder(formData);

//             const payload = {
//                 ...formData,
//                 buyNow,
//             };

//             if (buyNow) {
//                 payload.productId = buyNowProductId;
//                 payload.quantity = buyNowQuantity;
//             }

//             await placeOrder(payload);
//             showSuccess("Order placed successfully");
//             navigate('/my-orders');
//         } catch (error) {
//             console.log(error);
//             console.error("Place order error:", error);

//             showError(
//                 error.response?.data?.message ||
//                 "Failed to place order"
//             );
//         }
//     };

//     const totalItems = cart.items.reduce(
//         (total, item) => total + Number(item.quantity),
//         0
//     );

//     if (loading) {
//         return (
//             <div className="container py-5 text-center">
//                 <div className="spinner-border" role="status"></div>

//                 <p className="mt-3">
//                     Loading checkout...
//                 </p>
//             </div>
//         );
//     }

//     if (!cart.items.length) {
//         return (
//             <div className="container py-5 text-center checkout-empty">
//                 <div className="checkout-empty-icon">
//                     🛒
//                 </div>

//                 <h3>Your Cart is Empty</h3>

//                 <p className="text-muted">
//                     Add some products before proceeding to checkout.
//                 </p>

//                 <button
//                     type="button"
//                     className="btn btn-dark"
//                     onClick={() => navigate("/shop")}
//                 >
//                     Continue Shopping
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="container py-5 checkout-page">

//             <div className="mb-4">
//                 <h2 className="fw-bold">
//                     Checkout
//                 </h2>

//                 <p className="text-muted">
//                     Complete your information to place your order
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit}>

//                 <div className="row g-4">

//                     {/* Customer Information */}

//                     <div className="col-lg-7">

//                         <div className="card checkout-card mb-4">

//                             <div className="card-body">

//                                 <h4 className="fw-bold mb-4">
//                                     Customer Information
//                                 </h4>

//                                 <div className="row g-3">

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             First Name
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="firstName"
//                                             className="form-control"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                         />

//                                     </div>

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             Last Name
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="lastName"
//                                             className="form-control"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                         />

//                                     </div>

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             Email
//                                         </label>

//                                         <input
//                                             type="email"
//                                             name="email"
//                                             className="form-control"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />

//                                     </div>

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             Mobile Number
//                                         </label>

//                                         <input
//                                             type="tel"
//                                             name="mobile"
//                                             className="form-control"
//                                             value={formData.mobile}
//                                             onChange={handleChange}
//                                             maxLength="10"
//                                             required
//                                         />

//                                     </div>

//                                 </div>

//                             </div>

//                         </div>

//                         {/* Shipping Address */}

//                         <div className="card checkout-card">

//                             <div className="card-body">

//                                 <h4 className="fw-bold mb-4">
//                                     Shipping Address
//                                 </h4>

//                                 <div className="row g-3">

//                                     <div className="col-12">

//                                         <label className="form-label">
//                                             Address
//                                         </label>

//                                         <textarea
//                                             name="address"
//                                             className="form-control"
//                                             rows="3"
//                                             value={formData.address}
//                                             onChange={handleChange}
//                                             required
//                                         ></textarea>

//                                     </div>

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             City
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="city"
//                                             className="form-control"
//                                             value={formData.city}
//                                             onChange={handleChange}
//                                             required
//                                         />

//                                     </div>

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             State
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="state"
//                                             className="form-control"
//                                             value={formData.state}
//                                             onChange={handleChange}
//                                             required
//                                         />

//                                     </div>

//                                     <div className="col-md-6">

//                                         <label className="form-label">
//                                             Pincode
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="pincode"
//                                             className="form-control"
//                                             value={formData.pincode}
//                                             onChange={handleChange}
//                                             maxLength="6"
//                                             required
//                                         />

//                                     </div>

//                                 </div>

//                             </div>

//                         </div>

//                     </div>

//                     {/* Order Summary */}

//                     <div className="col-lg-5">

//                         <div className="card checkout-summary-card">

//                             <div className="card-body">

//                                 <h4 className="fw-bold mb-4">
//                                     Your Order
//                                 </h4>

//                                 {/* Products */}

//                                 <div className="checkout-products">

//                                     {cart.items.map((item) => {

//                                         const product = item.product;

//                                         return (
//                                             <div
//                                                 className="checkout-product"
//                                                 key={item.id}
//                                             >

//                                                 <div className="checkout-product-image-wrapper">

//                                                     {product?.productImage ? (
//                                                         <img
//                                                             src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
//                                                             alt={product?.name}
//                                                             className="checkout-product-image"
//                                                         />
//                                                     ) : (
//                                                         <div className="checkout-no-image">
//                                                             No Image
//                                                         </div>
//                                                     )}

//                                                 </div>

//                                                 <div className="checkout-product-info">

//                                                     <h6>
//                                                         {product?.name}
//                                                     </h6>

//                                                     <p>
//                                                         ₹{product?.price} × {item.quantity}
//                                                     </p>

//                                                 </div>

//                                                 <strong>
//                                                     ₹{item.subtotal}
//                                                 </strong>

//                                             </div>
//                                         );

//                                     })}

//                                 </div>

//                                 <hr />

//                                 <div className="d-flex justify-content-between mb-3">

//                                     <span>
//                                         Items
//                                     </span>

//                                     <span>
//                                         {totalItems}
//                                     </span>

//                                 </div>

//                                 <div className="d-flex justify-content-between mb-3">

//                                     <span>
//                                         Subtotal
//                                     </span>

//                                     <span>
//                                         ₹{cart.total}
//                                     </span>

//                                 </div>

//                                 <div className="d-flex justify-content-between mb-3">

//                                     <span>
//                                         Shipping
//                                     </span>

//                                     <span className="text-success">
//                                         Free
//                                     </span>

//                                 </div>

//                                 <hr />

//                                 <div className="d-flex justify-content-between mb-4">

//                                     <strong className="fs-5">
//                                         Total
//                                     </strong>

//                                     <strong className="fs-5">
//                                         ₹{cart.total}
//                                     </strong>

//                                 </div>

//                                 <button
//                                     type="submit"
//                                     className="btn btn-dark w-100 checkout-place-order-btn"
//                                 >
//                                     Place Order
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className="btn btn-outline-dark w-100 mt-2"
//                                     onClick={() => navigate("/cart")}
//                                 >
//                                     Back to Cart
//                                 </button>

//                             </div>

//                         </div>

//                     </div>

//                 </div>

//             </form>

//         </div>
//     );
// };

// export default Checkout;