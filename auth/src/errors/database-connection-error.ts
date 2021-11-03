import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  constructor(
    public reason = "Error connecting to the database",
    public statusCode = 500
  ) {
    super(reason);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.reason }];
  };
}
