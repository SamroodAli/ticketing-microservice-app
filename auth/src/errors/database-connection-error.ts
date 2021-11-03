export class DatabaseConnectionError extends Error {
  constructor(public reason = "Error connecting to the database") {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
