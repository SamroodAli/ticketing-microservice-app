import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  constructor(public message = "Not authorized", public statusCode = 401) {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
