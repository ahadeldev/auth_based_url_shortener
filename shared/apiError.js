class ApiError extends Error{
  constructor(message, status, isOperational) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
  }
}

export default ApiError;