import React, { useEffect, useState } from "react";
import Alert from "../components/Alert";
import { getProfile, updateProfile } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    profileImage: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        const user = response.data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          mobileNumber: user.mobileNumber || "",
          profileImage: user.profileImage || ""
        });

        setUser(user);

        if (user.profileImage) {
          setPreview(`${import.meta.env.VITE_API_URL}${user.profileImage}`);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setUser]);

  // Input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Optional validation
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPEG and WEBP images are allowed.");
      return;
    }

    // Optional size validation - 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile image must be less than 2MB.");
      return;
    }

    setError("");
    setSelectedImage(file);

    // Preview only
    setPreview(URL.createObjectURL(file));
  };

  // Submit complete profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("mobileNumber", form.mobileNumber);

      // Image only if user selected a new image
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }
      
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
      const response = await updateProfile(formData);

      const updatedUser = response.data.user;
    
      setUser(updatedUser);

      // Update preview from server response
      if (updatedUser.profileImage) {
        setPreview(
          `http://localhost:5000${updatedUser.profileImage}`
        );
      }

      // Reset selected image
      setSelectedImage(null);

      setMessage(
        response.data.message || "Profile updated successfully."
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Profile update failed."
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
      <div className="col-md-7 col-lg-6">

        <div className="card shadow-sm">
          <div className="card-body p-4">

            <h2 className="mb-4">My Profile</h2>

            <Alert type="success" message={message} />
            <Alert message={error} />

            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </div>

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
                    objectFit: "cover"
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
                  name="name"
                  className="form-control"
                  value={form.name}
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
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mobile */}
              <div className="mb-4">
                <label className="form-label">
                  Mobile Number
                </label>

                <input
                  name="mobileNumber"
                  className="form-control"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Single Update Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update Profile"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;