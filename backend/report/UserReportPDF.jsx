import React from "react";

const UserReportPDF = ({
  users = [],
  filters = {},
}) => {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="container-fluid bg-white p-4"
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="border-bottom pb-3 mb-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h2 className="fw-bold mb-1">
              User Report
            </h2>

            <p className="text-muted mb-0">
              Complete user information report
            </p>
          </div>

          <div className="text-end">
            <small className="text-muted d-block">
              Generated On
            </small>

            <strong>
              {new Date().toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Total Users
            </small>

            <h4 className="fw-bold mb-0">
              {users.length}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Active Users
            </small>

            <h4 className="fw-bold mb-0">
              {
                users.filter(
                  (user) => user.status === "active"
                ).length
              }
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Admin Users
            </small>

            <h4 className="fw-bold mb-0">
              {
                users.filter(
                  (user) => user.role === "admin"
                ).length
              }
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Regular Users
            </small>

            <h4 className="fw-bold mb-0">
              {
                users.filter(
                  (user) => user.role === "user"
                ).length
              }
            </h4>
          </div>
        </div>
      </div>

      {(filters.search ||
        filters.status ||
        filters.role ||
        filters.startDate ||
        filters.endDate) && (
        <div className="border rounded p-3 mb-4">
          <h6 className="fw-bold mb-3">
            Applied Filters
          </h6>

          <div className="row">
            {filters.search && (
              <div className="col-md-3">
                <small className="text-muted">
                  Search
                </small>

                <div className="fw-semibold">
                  {filters.search}
                </div>
              </div>
            )}

            {filters.status && (
              <div className="col-md-3">
                <small className="text-muted">
                  Status
                </small>

                <div className="fw-semibold">
                  {filters.status}
                </div>
              </div>
            )}

            {filters.role && (
              <div className="col-md-3">
                <small className="text-muted">
                  Role
                </small>

                <div className="fw-semibold">
                  {filters.role}
                </div>
              </div>
            )}

            {filters.startDate && (
              <div className="col-md-3">
                <small className="text-muted">
                  Start Date
                </small>

                <div className="fw-semibold">
                  {filters.startDate}
                </div>
              </div>
            )}

            {filters.endDate && (
              <div className="col-md-3">
                <small className="text-muted">
                  End Date
                </small>

                <div className="fw-semibold">
                  {filters.endDate}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Role</th>
              <th>Created Date</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{index + 1}</td>

                  <td className="fw-semibold">
                    {user.name || "-"}
                  </td>

                  <td>
                    {user.email || "-"}
                  </td>

                  <td>
                    {user.mobileNumber || "-"}
                  </td>

                  <td>
                    <span className="badge text-bg-light border">
                      {user.status || "-"}
                    </span>
                  </td>

                  <td>
                    <span className="badge text-bg-light border">
                      {user.role || "-"}
                    </span>
                  </td>

                  <td>
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-top mt-4 pt-3 d-flex justify-content-between">
        <small className="text-muted">
          Total Records: {users.length}
        </small>

        <small className="text-muted">
          User Report
        </small>
      </div>
    </div>
  );
};

export default UserReportPDF;