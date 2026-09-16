export const validateProduct = (form) => {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Product name is required.";
  } else if (form.name.trim().length < 2) {
    errors.name =
      "Product name must be at least 2 characters.";
  }

  if (!form.price) {
    errors.price = "Price is required.";
  } else if (Number(form.price) < 0) {
    errors.price =
      "Price cannot be negative.";
  }

  if (form.stock === "") {
    errors.stock = "Stock is required.";
  } else if (Number(form.stock) < 0) {
    errors.stock =
      "Stock cannot be negative.";
  }

  if (!form.categoryId) {
    errors.categoryId =
      "Please select a category.";
  }

  if (!form.description.trim()) {
    errors.description =
      "Description is required.";
  }

  return errors;
};