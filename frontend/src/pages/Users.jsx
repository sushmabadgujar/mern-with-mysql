import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { getUsers, deleteUser } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0
  });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await getUsers({
        page,
        limit: pagination.limit,
        search,
        sortBy,
        sortOrder
      });

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [search, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      fetchUsers(pagination.page);
    } catch (error) {
      setError(error.response?.data?.message || "Delete failed.");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, index) => index + 1
  );

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="mb-1">Users</h2>
          <p className="text-muted mb-0">Manage registered users.</p>
        </div>

        <input
          className="form-control search-box"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <Alert message={error} />

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th role="button" onClick={() => toggleSort("id")}>ID</th>
                <th role="button" onClick={() => toggleSort("name")}>Name</th>
                <th role="button" onClick={() => toggleSort("email")}>Email</th>
                <th>Mobile</th>
                <th role="button" onClick={() => toggleSort("status")}>Status</th>
                <th>Created</th>
                 {isAdmin && ( <th>Action</th>)}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm me-2" />
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>
                      <span className={`badge ${user.status === "active" ? "text-bg-success" : "text-bg-secondary"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>)}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center">
          <small className="text-muted">
            Total users: {pagination.total}
          </small>

          <nav>
            <ul className="pagination pagination-sm mb-0">
              {pageNumbers.map((page) => (
                <li key={page} className={`page-item ${page === pagination.page ? "active" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => fetchUsers(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Users;
