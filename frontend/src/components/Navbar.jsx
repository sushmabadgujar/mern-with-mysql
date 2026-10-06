import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/navbar.css";
import NotificationBell from "./NotificationBell";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {user.role === "admin" ? (
        <>
          <aside className="admin-sidebar">

            <div className="admin-sidebar-header">
              <Link
                to="/dashboard"
                className="admin-sidebar-brand"
              >
                Admin Panel
              </Link>
            </div>

            <div className="admin-sidebar-menu">

              <Link to="/dashboard">
                Dashboard
              </Link>
              <Link to="/activity-logs">
                Activity Logs
              </Link>
              <Link to="/users">
                Users Management
              </Link>

              <Link to="/categories">
                Category Management
              </Link>

              <Link to="/products">
                Product Management
              </Link>

              <Link to="/cart">
                Cart Management
              </Link>

              <Link to="/wishlists">
                Wishlist Management
              </Link>

              <Link to="/all-orders">
                Order Management
              </Link>
              <Link to="/reports">
                Report Management
              </Link>
              <hr />

              <Link to="/profile">
                Profile
              </Link>

              <Link to="/shop">
                Shop
              </Link>

              <Link to="/my-orders">
                My Order
              </Link>

            </div>

          </aside>

          <nav className="navbar navbar-expand-lg bg-secondary navbar-dark">
            <div className="container-fluid">
              <div className="ms-auto d-flex align-items-center gap-3">
                 <span className="text-light">
                Hi, {user.name}
              </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>

                <NotificationBell
                  notificationPath="/all-notification"
                />
              </div>
            </div>
          </nav>
        </>
      ) : (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">

          <div className="container">

            <Link
              className="navbar-brand fw-bold"
              to="/usermanagement"
            >
              User Management
            </Link>

            <div className="navbar-nav ms-auto align-items-center">

              <Link
                className="nav-link"
                to="/profile"
              >
                Profile
              </Link>

              <Link
                className="nav-link"
                to="/shop"
              >
                Shop
              </Link>
              <Link
                className="nav-link"
                to="/product-cart"
              >
                Cart
              </Link>
              <Link to="/wishlist" className="nav-link">
                My Wishlist
              </Link>

              <Link
                className="nav-link"
                to="/my-orders"
              >
                My Orders
              </Link>

              <span className="text-white small mx-3">
                Hi, {user.name}
              </span>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
              <NotificationBell />
            </div>

          </div>

        </nav>
      )}
    </>
  );
};

export default Navbar;