
import React from "react";

const FormError = ({ message }) => {
    if (!message) {
        return null;
    }

    return (
        <div className="text-danger small mt-1">
            {message}
        </div>
    );
};

export default FormError;

