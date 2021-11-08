import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  constructor(
    public message = "Error connecting to the database",
    public statusCode = 500
  ) {
    super(message);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.message }];
  };
}
