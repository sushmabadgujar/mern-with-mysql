import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import EditUser from "./pages/EditUser";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import ProductManagement from "./components/ProductManagement";
import CategoryManagement from "./components/CategoryManagement";
import CartManagement from "./components/CartManagement";
import { useAuth } from "./context/AuthContext";
import Shop from "./pages/Shop";
import AdminRoute from "./components/AdminRoute";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import OrderManagement from "./pages/OrderManagement";
import MyWishlist from "./pages/user/MyWishlist";
import WishlistManagement from "./pages/WishlistManagement";
import Notifications from "./pages/user/Notifications";
import ActivityLogs from "./pages/ActivityLogs";
import Reports from "./pages/Reports";
const App = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <main className={ user?.role === "admin" ? "admin-main-content" : "container py-4" }>

        <Routes>

          {/* Public Routes */}

          <Route path="/" element={<Navigate to={
            !user ? "/login" : user.role === "admin" ? "/dashboard" : "/shop"}
            replace
          />
          }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          {/* Authenticated Routes */}

          <Route element={<ProtectedRoute />}>

            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product-cart" element={<Cart />} />
            <Route path="/check-out" element={<Checkout />} />
            <Route path="/orders/orderId:" element={<Checkout />} />

            <Route path="/my-orders" element={<Orders />} />
            <Route path="/wishlist" element={<MyWishlist />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Admin Only Routes */}

          <Route element={<AdminRoute />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/users" element={<Users />} />

            <Route path="/users/edit/:id" element={<EditUser />} />

            <Route path="/products" element={<ProductManagement />} />

            <Route path="/categories" element={<CategoryManagement />} />

            <Route path="/cart" element={<CartManagement />} />

            <Route path="/wishlists" element={<WishlistManagement />} />

            <Route path="/all-orders" element={<OrderManagement />}
            />
          </Route>
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
          <Route path="/activity-logs" element={ <ActivityLogs /> }
          />
         <Route  path="/reports" element={<Reports />} />

        </Routes>
      </main>
    </>
  );
};

export default App;
