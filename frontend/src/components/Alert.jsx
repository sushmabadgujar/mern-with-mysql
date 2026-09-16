import React from "react";
const Alert = ({ type = "danger", message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} />
      )}
    </div>
  );
};

export default Alert;
