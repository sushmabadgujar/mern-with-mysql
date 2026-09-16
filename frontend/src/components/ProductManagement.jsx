
import React, { useEffect, useState } from "react";

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../api/productApi";

import { getCategories } from "../api/categoryApi";

import { showSuccess, showError } from "../utils/toast";

import FormError from "../components/FormError";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        productImage: null,
    });

    const [errors, setErrors] = useState({});

    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalPages: 1,
        totalItems: 0,
    });

    const fetchProducts = async (page = pagination.page) => {
        try {
            setLoading(true);

            const response = await getProducts({
                page,
                limit: pagination.limit,
                search,
                sortBy: "id",
                sortOrder: "DESC",
            });

            const data = response.data;

            console.log("Products Response:", data);

            setProducts(data.data || []);

            setPagination((prev) => ({
                ...prev,
                page: data.pagination?.currentPage || page,
                totalPages: data.pagination?.totalPages || 1,
                totalItems: data.pagination?.total || 0,
            }));
        } catch (error) {
            console.error("Fetch Products Error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to fetch products"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories({
                page: 1,
                limit: 100,
                search: "",
                sortBy: "name",
                sortOrder: "ASC",
            });

            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("Fetch Categories Error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to fetch categories"
            );
        }
    };

    useEffect(() => {
        fetchProducts(pagination.page);
    }, [pagination.page, pagination.limit, search]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        const fieldValue = files
            ? files[0]
            : value;

        setForm((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateProductForm = () => {
        const newErrors = {};

        const name = form.name.trim();
        const description = form.description.trim();

        // Product Name
        if (!name) {
            newErrors.name = "Product name is required";
        } else if (name.length < 2) {
            newErrors.name =
                "Product name must be at least 2 characters";
        } else if (name.length > 100) {
            newErrors.name =
                "Product name must not exceed 100 characters";
        }

        // Category
        if (!form.categoryId) {
            newErrors.categoryId =
                "Please select a category";
        }

        // Price
        if (form.price === "") {
            newErrors.price = "Price is required";
        } else if (Number.isNaN(Number(form.price))) {
            newErrors.price = "Please enter a valid price";
        } else if (Number(form.price) <= 0) {
            newErrors.price =
                "Price must be greater than 0";
        }

        // Stock
        if (form.stock === "") {
            newErrors.stock = "Stock is required";
        } else if (Number.isNaN(Number(form.stock))) {
            newErrors.stock = "Please enter a valid stock";
        } else if (Number(form.stock) < 0) {
            newErrors.stock =
                "Stock cannot be negative";
        } else if (!Number.isInteger(Number(form.stock))) {
            newErrors.stock =
                "Stock must be a whole number";
        }

        // Description
        if (!description) {
            newErrors.description =
                "Description is required";
        } else if (description.length < 3) {
            newErrors.description =
                "Description must be at least 3 characters";
        } else if (description.length > 500) {
            newErrors.description =
                "Description must not exceed 500 characters";
        }

        // Product Image
        if (!editingId && !form.productImage) {
            newErrors.productImage =
                "Product image is required";
        }

        if (form.productImage) {
            if (!form.productImage.type.startsWith("image/")) {
                newErrors.productImage =
                    "Please select a valid image file";
            } else if (
                form.productImage.size > 2 * 1024 * 1024
            ) {
                newErrors.productImage =
                    "Image size must not exceed 2 MB";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            productImage: null,
        });

        setErrors({});
        setEditingId(null);

        const fileInput =
            document.getElementById("productImage");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateProductForm();

        if (!isValid) {
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "price",
                form.price
            );

            formData.append(
                "stock",
                form.stock
            );

            formData.append(
                "categoryId",
                form.categoryId
            );

            if (form.productImage) {
                formData.append(
                    "productImage",
                    form.productImage
                );
            }

            if (editingId) {
                await updateProduct(
                    editingId,
                    formData
                );

                showSuccess(
                    "Product updated successfully"
                );
            } else {
                await createProduct(formData);

                showSuccess(
                    "Product created successfully"
                );
            }

            resetForm();

            await fetchProducts(1);
        } catch (error) {
            console.error(
                "Product Submit Error:",
                error
            );

            showError(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);

        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            stock: product.stock ?? "",
            categoryId: product.categoryId || "",
            productImage: null,
        });

        setErrors({});

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await deleteProduct(id);

            showSuccess(
                "Product deleted successfully"
            );

            if (
                products.length === 1 &&
                pagination.page > 1
            ) {
                await fetchProducts(
                    pagination.page - 1
                );
            } else {
                await fetchProducts(
                    pagination.page
                );
            }
        } catch (error) {
            console.error(
                "Delete Product Error:",
                error
            );

            showError(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > pagination.totalPages ||
            page === pagination.page
        ) {
            return;
        }

        setPagination((prev) => ({
            ...prev,
            page,
        }));
    };

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));
    };

    return (
        <div className="container-fluid py-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        Product Management
                    </h3>

                    <p className="text-muted mb-0">
                        Manage your products
                    </p>
                </div>

                {editingId && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Cancel Edit
                    </button>
                )}
            </div>

            {/* Product Form */}
            <div className="card shadow-sm mb-4">

                <div className="card-header">
                    <h5 className="mb-0">
                        {editingId
                            ? "Edit Product"
                            : "Create Product"}
                    </h5>
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* Product Name */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${errors.name
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    placeholder="Enter product name"
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <FormError
                                    message={errors.name}
                                />
                            </div>

                            {/* Category */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Category
                                </label>

                                <select
                                    name="categoryId"
                                    className={`form-select ${errors.categoryId
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <FormError
                                    message={
                                        errors.categoryId
                                    }
                                />
                            </div>

                            {/* Price */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    className={`form-control ${errors.price
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <FormError
                                    message={errors.price}
                                />
                            </div>

                            {/* Stock */}
                            <div className="col-md-6">
                                <label className="form-label">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    className={`form-control ${errors.stock
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    placeholder="Enter stock"
                                    min="0"
                                    step="1"
                                    value={form.stock}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <FormError
                                    message={errors.stock}
                                />
                            </div>

                            {/* Description */}
                            <div className="col-md-8">
                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className={`form-control ${errors.description
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    rows="3"
                                    placeholder="Enter product description"
                                    value={
                                        form.description
                                    }
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <FormError
                                    message={
                                        errors.description
                                    }
                                />
                            </div>

                            {/* Product Image */}
                            <div className="col-md-4">
                                <label className="form-label">
                                    Product Image
                                </label>

                                <input
                                    id="productImage"
                                    type="file"
                                    name="productImage"
                                    className={`form-control ${errors.productImage
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    accept="image/*"
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <FormError
                                    message={
                                        errors.productImage
                                    }
                                />

                                {editingId && (
                                    <small className="text-muted">
                                        Leave empty to keep
                                        the existing image.
                                    </small>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="col-12">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Please wait..."
                                        : editingId
                                            ? "Update Product"
                                            : "Create Product"}
                                </button>

                            </div>

                        </div>

                    </form>

                </div>
            </div>

            {/* Product List */}
            <div className="card shadow-sm">

                <div className="card-header">

                    <div className="row align-items-center g-3">

                        <div className="col-md-6">
                            <h5 className="mb-0">
                                Products
                            </h5>
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={search}
                                onChange={
                                    handleSearch
                                }
                            />
                        </div>

                    </div>

                </div>

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Description</th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : products.length ===
                                    0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4"
                                        >
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(
                                        (product) => (
                                            <tr
                                                key={
                                                    product.id
                                                }
                                            >
                                                <td>
                                                    {
                                                        product.id
                                                    }
                                                </td>

                                                <td>
                                                    {product.productImage ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
                                                            alt={
                                                                product.name
                                                            }
                                                            width="60"
                                                            height="60"
                                                            className="rounded object-fit-cover"
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>

                                                <td className="fw-semibold">
                                                    {
                                                        product.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        product
                                                            .category
                                                            ?.name ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {
                                                        product.price
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${Number(
                                                            product.stock
                                                        ) >
                                                                0
                                                                ? "bg-success"
                                                                : "bg-danger"
                                                            }`}
                                                    >
                                                        {
                                                            product.stock
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        product.description ||
                                                        "-"
                                                    }
                                                </td>

                                                <td className="text-center">

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() =>
                                                            handleEdit(
                                                                product
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>
                                        )
                                        )
                                )}

                            </tbody>


                        </table>

                    </div>

                </div>

                {/* Pagination */}
                <div className="card-footer">
                    <div className="d-flex justify-content-between align-items-center">

                        <span className="text-muted">
                            Total Products: {pagination.totalItems}
                        </span>

                        {pagination.totalPages > 1 && (
                            <nav>
                                <ul className="pagination mb-0">

                                    {/* Previous */}
                                    <li
                                        className={`page-item ${pagination.page === 1
                                                ? "disabled"
                                                : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page - 1
                                                )
                                            }
                                            disabled={
                                                pagination.page === 1 ||
                                                loading
                                            }
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {/* Page Numbers */}
                                    {Array.from(
                                        {
                                            length: pagination.totalPages,
                                        },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${pagination.page === page
                                                    ? "active"
                                                    : ""
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                disabled={loading}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    {/* Next */}
                                    <li
                                        className={`page-item ${pagination.page ===
                                                pagination.totalPages
                                                ? "disabled"
                                                : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page + 1
                                                )
                                            }
                                            disabled={
                                                pagination.page ===
                                                pagination.totalPages ||
                                                loading
                                            }
                                        >
                                            Next
                                        </button>
                                    </li>

                                </ul>
                            </nav>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ProductManagement;

