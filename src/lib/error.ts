interface HandlerErrorOptions {
  type:
    | typeof ERROR_INVALID_CONFIGURATION
    | typeof ERROR_PERMISSION_DENIED
    | typeof ERROR_ALREADY_EXISTS
    | typeof ERROR_UNEXPECTED
    | typeof ERROR_NOT_FOUND;
  message: string;
}

export class HandlerError extends Error {
  type: string;

  constructor(options: HandlerErrorOptions) {
    super(options.message);
    this.type = options.type;
    this.name = "HandlerError";
  }
}

export const ERROR_INVALID_CONFIGURATION = "ERROR_INVALID_CONFIGURATION";
export const ERROR_PERMISSION_DENIED = "ERROR_PERMISSION_DENIED";
export const ERROR_ALREADY_EXISTS = "ERROR_ALREADY_EXISTS";
export const ERROR_UNEXPECTED = "ERROR_UNEXPECTED";
export const ERROR_NOT_FOUND = "ERROR_NOT_FOUND";

/*
! ERROR_INVALID_CONFIGURATION - This error is thrown when the config file or config property is invalid.
! ERROR_PERMISSION_DENIED - This error is thrown when the user doesn't have the required permissions to execute the command. ( user doesn't have all the required flags )
! ERROR_ALREADY_EXISTS - This error is thrown when the command already exists.
! ERROR_UNEXPECTED - This error is thrown when an unexpected error occurs.
! ERROR_NOT_FOUND - This error is thrown when the command is not found.
*/
