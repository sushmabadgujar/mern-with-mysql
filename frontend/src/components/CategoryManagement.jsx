
import React, { useEffect, useState } from "react";
import { showSuccess, showError } from "../utils/toast";
import FormError from "../components/FormError";

import { createCategory, getCategories, updateCategory, deleteCategory } from "../api/categoryApi";
const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalPages: 1,
        totalItems: 0,
    });

   const fetchCategories = async () => {
    try {
        setLoading(true);

        const response = await getCategories({
            page: pagination.page,
            limit: pagination.limit,
            search,
            sortBy: "id",
            sortOrder: "DESC",
        });

        const data = response.data;

        console.log("Category Response:", data);

        setCategories(data.categories || []);

        setPagination((prev) => ({
            ...prev,
            totalPages: data.pagination?.totalPages || 1,
            totalItems: data.pagination?.total || 0,
        }));

    } catch (error) {
        console.log(error.response);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchCategories();
    }, [pagination.page, pagination.limit, search]);

    const handleChange = (e) => {
        const { name, value } = e.target;


        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
        });


        setEditingId(null);


    };
    const validateForm = () => {
        const newErrors = {};

        const name = form.name.trim();
        const description = form.description.trim();

        if (!name) {

            newErrors.name = "Category name is required.";
        } else if (name.length < 2) {
            newErrors.name = "Category name must be at least 2 characters.";
        } else if (name.length > 100) {
            newErrors.name = "Category name cannot exceed 100 characters.";
        }

        if (!description) {
            console.log("errrr", name);
            newErrors.name = "Category description is required.";
        } else if (description.length > 50) {
            console.log("errrr", description.length);
            newErrors.description =
                "Description cannot exceed 50 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);

            if (editingId) {
                await updateCategory(editingId, {
                    name: form.name.trim(),
                    description: form.description.trim(),
                });

                showSuccess("Category updated successfully");
            } else {
                await createCategory({
                    name: form.name.trim(),
                    description: form.description.trim(),
                });

                showSuccess("Category created successfully");
            }

            resetForm();

            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));

            await fetchCategories();
        } catch (error) {
            console.log(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }


    };

    const handleEdit = (category) => {
        setEditingId(category.id);


        setForm({
            name: category.name || "",
            description: category.description || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });


    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );


        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await deleteCategory(id);
            console.log(id);
            showSuccess("Category deleted successfully");

            if (categories.length === 1 && pagination.page > 1) {
                setPagination((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                }));
            } else {
                await fetchCategories();
            }
        } catch (error) {
            console.log(
                error.response?.data?.message || "Failed to delete category"
            );
        } finally {
            setLoading(false);
        }


    };

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.totalPages) {
            return;
        }


        setPagination((prev) => ({
            ...prev,
            page,
        }));


    };

    return (<div className="container-fluid py-4"> <div className="d-flex justify-content-between align-items-center mb-4"> <div> <h3 className="mb-1">Category Management</h3> <p className="text-muted mb-0">
        Manage your product categories </p> </div>
        {editingId && (
            <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
            >
                Cancel Edit
            </button>
        )}
    </div>

        <div className="card shadow-sm mb-4">
            <div className="card-header">
                <h5 className="mb-0">
                    {editingId ? "Edit Category" : "Create Category"}
                </h5>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label">
                                Category Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter category name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <FormError message={errors.name} />
                        </div>

                        <div className="col-md-5">
                            <label className="form-label">
                                Description
                            </label>

                            <input
                                type="text"
                                name="description"
                                className="form-control"
                                placeholder="Enter description"
                                value={form.description}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <FormError message={errors.description} />
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {editingId ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div className="card shadow-sm">
            <div className="card-header">
                <div className="row align-items-center g-3">
                    <div className="col-md-6">
                        <h5 className="mb-0">Categories</h5>
                    </div>

                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination((prev) => ({
                                    ...prev,
                                    page: 1,
                                }));
                            }}
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
                                <th>Name</th>
                                <th>Description</th>
                                <th>Products</th>
                                <th>Created At</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>

                                        <td className="fw-semibold">
                                            {category.name}
                                        </td>

                                        <td>
                                            {category.description || "-"}
                                        </td>

                                        <td>
                                            <span className="badge bg-info">
                                                {category.productCount || 0}
                                            </span>
                                        </td>

                                        <td>
                                            {category.createdAt
                                                ? new Date(
                                                    category.createdAt
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleEdit(category)}
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    handleDelete(category.id)
                                                }
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination.totalPages > 1 && (
                <div className="card-footer">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                            Total Categories: {pagination.totalItems}
                        </span>

                        <nav>
                            <ul className="pagination mb-0">
                                <li
                                    className={`page-item ${pagination.page === 1
                                        ? "disabled"
                                        : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>
                                </li>

                                {Array.from(
                                    { length: pagination.totalPages },
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
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}

                                <li
                                    className={`page-item ${pagination.page ===
                                        pagination.totalPages
                                        ? "disabled"
                                        : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    </div>


    );
};

export default CategoryManagement;
