export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    // for error logging purposes
    super(message);
    // since we are extending native class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
