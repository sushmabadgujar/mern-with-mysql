import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          User Management
        </Link>

        <div className="navbar-nav ms-auto align-items-center">
          {user && (
            <>
             {user.role === "admin" && (
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              )}
              <Link className="nav-link" to="/profile">Profile</Link>
              <span className="text-white small mx-3">
                Hi, {user.name}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          
        </div>
      </div>
     
    </nav>
  );
};

export default Navbar;
