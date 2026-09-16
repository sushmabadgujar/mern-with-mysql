import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../api/userApi";
import Alert from "../components/Alert";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    status: "active",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await getUserById(id);

      const user = response.data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        status: user.status || "active",
      });

      // Existing profile image
      if (user.profileImage) {
        setPreview(`${SERVER_URL}${user.profileImage}`);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load user."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPEG and WEBP images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Profile image must be less than 2MB.");
      return;
    }

    setError("");

    setSelectedImage(file);

    // Show selected image immediately
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobileNumber", formData.mobileNumber);
      data.append("status", formData.status);

      // Add image only if new image selected
      if (selectedImage) {
        data.append("profileImage", selectedImage);
      }

      // Debug
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await updateUser(id, data);

      // If backend returns updated user
      if (response.data.user?.profileImage) {
        setPreview(
          `${SERVER_URL}${response.data.user.profileImage}`
        );
      }

      setSelectedImage(null);

      setSuccess(
        response.data.message || "User updated successfully."
      );

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">

          <div className="card-header bg-white">
            <h4 className="mb-0">Edit User</h4>
          </div>

          <div className="card-body">

            <Alert message={error} />

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Profile Image */}
              <div className="text-center mb-4">

                <img
                  src={
                    preview ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="rounded-circle"
                  width="150"
                  height="150"
                  style={{
                    objectFit: "cover",
                  }}
                />

                <div className="mt-3">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />
                </div>

              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
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

              {/* Mobile Number */}
              <div className="mb-3">
                <label className="form-label">
                  Mobile Number
                </label>

                <input
                  type="text"
                  name="mobileNumber"
                  className="form-control"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Update User"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;

