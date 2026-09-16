import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(form);
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-4">Create Account</h2>

            <Alert message={error} />
            <Alert type="success" message={success} />

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  name="mobileNumber"
                  className="form-control"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  maxLength="15"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-text mb-3">
                Minimum 8 characters with uppercase, lowercase and number.
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </button>
            </form>

            <p className="mt-3 mb-0 text-center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
