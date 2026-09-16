import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/authApi";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword(formData);

      setSuccess(response.data.message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to change password."
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

            <div className="card-header bg-white">
              <h4 className="mb-0">
                Change Password
              </h4>
            </div>

            <div className="card-body p-4">

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Current Password */}
                <div className="mb-3">
                  <label className="form-label">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />

                  <small className="text-muted">
                    Minimum 8 characters with uppercase,
                    lowercase and number.
                  </small>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="d-flex gap-2">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Changing..."
                      : "Change Password"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChangePassword;