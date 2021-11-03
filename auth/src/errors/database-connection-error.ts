export class DatabaseConnectionError extends Error {
  reason = "Error connecting to the database";
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
