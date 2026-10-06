import React from "react";

const SalesReportPDF = ({
  orders = [],
  summary = {},
  filters = {},
}) => {
  const completedOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  );

  const cancelledOrders = orders.filter(
    (order) =>
      order.status === "Cancelled"
  );

  const totalSales =
    summary.totalSales !== undefined
      ? Number(summary.totalSales)
      : completedOrders.reduce(
          (total, order) =>
            total +
            Number(order.totalAmount || 0),
          0
        );

  const cancelledAmount =
    summary.cancelledAmount !== undefined
      ? Number(summary.cancelledAmount)
      : cancelledOrders.reduce(
          (total, order) =>
            total +
            Number(order.totalAmount || 0),
          0
        );

  const averageOrderValue =
    summary.averageOrderValue !== undefined
      ? Number(summary.averageOrderValue)
      : completedOrders.length > 0
      ? totalSales /
        completedOrders.length
      : 0;

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
              Sales Report
            </h2>

            <p className="text-muted mb-0">
              Sales performance and revenue report
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
        <div className="col-md-4">
          <div className="border rounded p-3">
            <small className="text-muted">
              Total Orders
            </small>

            <h4 className="fw-bold mb-0">
              {summary.totalOrders ??
                orders.length}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded p-3">
            <small className="text-muted">
              Completed Orders
            </small>

            <h4 className="fw-bold mb-0">
              {summary.completedOrders ??
                completedOrders.length}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded p-3">
            <small className="text-muted">
              Cancelled Orders
            </small>

            <h4 className="fw-bold mb-0">
              {summary.cancelledOrders ??
                cancelledOrders.length}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded p-3">
            <small className="text-muted">
              Total Sales
            </small>

            <h4 className="fw-bold mb-0">
              ₹{totalSales.toFixed(2)}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded p-3">
            <small className="text-muted">
              Cancelled Amount
            </small>

            <h4 className="fw-bold mb-0">
              ₹{cancelledAmount.toFixed(2)}
            </h4>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded p-3">
            <small className="text-muted">
              Average Order Value
            </small>

            <h4 className="fw-bold mb-0">
              ₹{averageOrderValue.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      {(filters.startDate ||
        filters.endDate) && (
        <div className="border rounded p-3 mb-4">
          <h6 className="fw-bold mb-3">
            Report Period
          </h6>

          <div className="row">
            <div className="col-md-3">
              <small className="text-muted">
                Start Date
              </small>

              <div className="fw-semibold">
                {filters.startDate || "-"}
              </div>
            </div>

            <div className="col-md-3">
              <small className="text-muted">
                End Date
              </small>

              <div className="fw-semibold">
                {filters.endDate || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {completedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4"
                >
                  No completed sales found
                </td>
              </tr>
            ) : (
              completedOrders.map(
                (order, index) => (
                  <tr
                    key={
                      order.id || index
                    }
                  >
                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      #{order.id}
                    </td>

                    <td>
                      {order.user?.name ||
                        "-"}
                    </td>

                    <td>
                      {order.user?.email ||
                        "-"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount ||
                          0
                      ).toFixed(2)}
                    </td>

                    <td>
                      <span className="badge text-bg-light border">
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>

          {completedOrders.length > 0 && (
            <tfoot>
              <tr className="table-light">
                <td
                  colSpan="4"
                  className="text-end fw-bold"
                >
                  Total Sales
                </td>

                <td
                  colSpan="3"
                  className="fw-bold"
                >
                  ₹{totalSales.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="border-top mt-4 pt-3 d-flex justify-content-between">
        <small className="text-muted">
          Completed Sales:{" "}
          {completedOrders.length}
        </small>

        <small className="text-muted">
          Sales Report
        </small>
      </div>
    </div>
  );
};

export default SalesReportPDF;