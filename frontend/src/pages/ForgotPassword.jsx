import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h3 className="mb-2">
                Forgot Password
              </h3>

              <p className="text-muted">
                Enter your email and we'll send you a
                password reset link.
              </p>

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login">
                  Back to Login
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;