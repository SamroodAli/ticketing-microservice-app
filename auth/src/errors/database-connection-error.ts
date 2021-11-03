export class DatabaseConnectionError extends Error {
  constructor(
    public reason = "Error connecting to the database",
    public statusCode = 500
  ) {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.reason }];
  };
}
