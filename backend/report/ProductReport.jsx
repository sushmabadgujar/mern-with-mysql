import React from "react";

const ProductReportPDF = ({
  products = [],
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

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const totalValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) *
        Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <= 5
  );

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
              Product Report
            </h2>

            <p className="text-muted mb-0">
              Complete product and inventory report
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
              Total Products
            </small>

            <h4 className="fw-bold mb-0">
              {products.length}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Total Stock
            </small>

            <h4 className="fw-bold mb-0">
              {totalStock}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Low Stock
            </small>

            <h4 className="fw-bold mb-0">
              {lowStockProducts.length}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="border rounded p-3">
            <small className="text-muted">
              Inventory Value
            </small>

            <h4 className="fw-bold mb-0">
              ₹{totalValue.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      {(filters.search ||
        filters.categoryId ||
        filters.minStock ||
        filters.maxStock) && (
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

            {filters.categoryId && (
              <div className="col-md-3">
                <small className="text-muted">
                  Category ID
                </small>

                <div className="fw-semibold">
                  {filters.categoryId}
                </div>
              </div>
            )}

            {filters.minStock && (
              <div className="col-md-3">
                <small className="text-muted">
                  Minimum Stock
                </small>

                <div className="fw-semibold">
                  {filters.minStock}
                </div>
              </div>
            )}

            {filters.maxStock && (
              <div className="col-md-3">
                <small className="text-muted">
                  Maximum Stock
                </small>

                <div className="fw-semibold">
                  {filters.maxStock}
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
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created Date</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={
                    product.id || index
                  }
                >
                  <td>{index + 1}</td>

                  <td className="fw-semibold">
                    {product.name || "-"}
                  </td>

                  <td>
                    {product.category?.name ||
                      "-"}
                  </td>

                  <td>
                    ₹
                    {Number(
                      product.price || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    <span className="badge text-bg-light border">
                      {product.stock ?? 0}
                    </span>
                  </td>

                  <td>
                    {formatDate(
                      product.createdAt
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-top mt-4 pt-3 d-flex justify-content-between">
        <small className="text-muted">
          Total Records: {products.length}
        </small>

        <small className="text-muted">
          Product Report
        </small>
      </div>
    </div>
  );
};

export default ProductReportPDF;