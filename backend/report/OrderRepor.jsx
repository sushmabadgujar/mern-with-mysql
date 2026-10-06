import React from "react";

const OrderReportPDF = ({
  orders = [],
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

  const totalAmount = orders.reduce(
    (total, order) =>
      total +
      Number(order.totalAmount || 0),
    0
  );

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status === "Cancelled"
    ).length;

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
              Order Report
            </h2>

            <p className="text-muted mb-0">
              Complete order management report
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
              Total Orders
            </small>

            <h4 className="fw-bold mb-0">
              {orders.length}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Delivered
            </small>

            <h4 className="fw-bold mb-0">
              {deliveredOrders}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Pending
            </small>

            <h4 className="fw-bold mb-0">
              {pendingOrders}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Total Amount
            </small>

            <h4 className="fw-bold mb-0">
              ₹{totalAmount.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      {filters && (
        filters.status ||
        filters.userId ||
        filters.startDate ||
        filters.endDate
      ) && (
        <div className="border rounded p-3 mb-4">
          <h6 className="fw-bold mb-3">
            Applied Filters
          </h6>

          <div className="row">
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

            {filters.userId && (
              <div className="col-md-3">
                <small className="text-muted">
                  User ID
                </small>

                <div className="fw-semibold">
                  {filters.userId}
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

      {orders.length === 0 ? (
        <div className="text-center border rounded p-5">
          <h5 className="fw-semibold">
            No Orders Found
          </h5>

          <p className="text-muted mb-0">
            No orders match the selected filters.
          </p>
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            className="border rounded mb-4"
            key={order.id || index}
          >
            <div className="p-3 border-bottom bg-light">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <small className="text-muted">
                    Order ID
                  </small>

                  <div className="fw-bold">
                    #{order.id}
                  </div>
                </div>

                <div className="col-md-3">
                  <small className="text-muted">
                    Customer
                  </small>

                  <div className="fw-semibold">
                    {order.user?.name || "-"}
                  </div>
                </div>

                <div className="col-md-3">
                  <small className="text-muted">
                    Email
                  </small>

                  <div>
                    {order.user?.email || "-"}
                  </div>
                </div>

                <div className="col-md-3 text-md-end">
                  <small className="text-muted">
                    Order Date
                  </small>

                  <div className="fw-semibold">
                    {formatDate(
                      order.createdAt
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>
                  Status:
                  {" "}
                  <span className="badge text-bg-light border">
                    {order.status || "-"}
                  </span>
                </span>

                <strong>
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toFixed(2)}
                </strong>
              </div>

              {order.items?.length > 0 && (
                <table className="table table-sm table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map(
                      (item, itemIndex) => (
                        <tr
                          key={
                            item.id ||
                            itemIndex
                          }
                        >
                          <td>
                            {item.product
                              ?.name || "-"}
                          </td>

                          <td>
                            {item.quantity}
                          </td>

                          <td>
                            ₹
                            {Number(
                              item.price || 0
                            ).toFixed(2)}
                          </td>

                          <td>
                            ₹
                            {Number(
                              item.subtotal || 0
                            ).toFixed(2)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))
      )}

      <div className="border-top mt-4 pt-3 d-flex justify-content-between">
        <small className="text-muted">
          Total Records: {orders.length}
        </small>

        <small className="text-muted">
          Order Report
        </small>
      </div>
    </div>
  );
};

export default OrderReportPDF;