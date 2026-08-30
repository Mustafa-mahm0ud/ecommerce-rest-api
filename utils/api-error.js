export default class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true, stack = "") {
    const isObjectMessage = typeof message === "object";
    const baseMessage = isObjectMessage ? "Validation Error" : message;

    super(baseMessage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = isObjectMessage ? message : { general: message };
    this.isOperational = isOperational;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
