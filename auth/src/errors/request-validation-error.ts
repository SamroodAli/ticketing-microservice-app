import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[], public statusCode = 400) {
    // for error logging purposes
    super("Invalid request parameters");

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
