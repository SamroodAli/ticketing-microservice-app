import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[], public statusCode = 400) {
    super();

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors = () => {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  };
}
