
export const validateRequired = (value, fieldName) => {
    if (!value || !value.trim()) {
        return `${fieldName} is required`;
    }

    return "";
};

export const validateName = (name) => {
    if (!name || !name.trim()) {
        return "Name is required";
    }

    if (name.trim().length < 2) {
        return "Name must be at least 2 characters";
    }

    if (name.trim().length > 50) {
        return "Name must not exceed 50 characters";
    }

    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
        return "Name can contain only letters and spaces";
    }

    return "";
};

export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return "Email is required";
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return "Please enter a valid email address";
    }

    return "";
};

export const validateMobileNumber = (mobileNumber) => {
    if (!mobileNumber || !mobileNumber.trim()) {
        return "Mobile number is required";
    }

    if (!/^\d{10}$/.test(mobileNumber.trim())) {
        return "Mobile number must contain exactly 10 digits";
    }

    return "";
};

export const validatePassword = (password) => {
    if (!password) {
        return "Password is required";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    if (password.length > 50) {
        return "Password must not exceed 50 characters";
    }

    return "";
};

export const validateConfirmPassword = (
    password,
    confirmPassword
) => {
    if (!confirmPassword) {
        return "Confirm password is required";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match";
    }

    return "";
};

export const validateDescription = (description) => {
    if (!description || !description.trim()) {
        return "Description is required";
    }

    if (description.trim().length < 3) {
        return "Description must be at least 3 characters";
    }

    if (description.trim().length > 500) {
        return "Description must not exceed 500 characters";
    }

    return "";
};

export const validateForm = (form, rules) => {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const validator = rules[field];

        const error = validator(form[field]);

        if (error) {
            errors[field] = error;
        }
    });

    return errors;
};

