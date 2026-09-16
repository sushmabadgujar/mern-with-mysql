const FieldError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="text-danger small mt-1">
      {message}
    </div>
  );
};

export default FieldError;