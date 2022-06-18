type ValidErrorType =
  | "ERROR_INVALID_CONFIGURATION"
  | "ERROR_PERMISSION_DENIED"
  | "ERROR_ALREADY_EXISTS"
  | "ERROR_INVALID_SYNTAX"
  | "ERROR_UNEXPECTED"
  | "ERROR_NOT_FOUND";

interface HandlerErrorOptions {
  type: ValidErrorType;
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

export const ERROR_INVALID_CONFIGURATION: ValidErrorType =
  "ERROR_INVALID_CONFIGURATION";
export const ERROR_PERMISSION_DENIED: ValidErrorType =
  "ERROR_PERMISSION_DENIED";
export const ERROR_ALREADY_EXISTS: ValidErrorType = "ERROR_ALREADY_EXISTS";
export const ERROR_INVALID_SYNTAX: ValidErrorType = "ERROR_INVALID_SYNTAX";
export const ERROR_UNEXPECTED: ValidErrorType = "ERROR_UNEXPECTED";
export const ERROR_NOT_FOUND: ValidErrorType = "ERROR_NOT_FOUND";

/*
! ERROR_INVALID_CONFIGURATION - This error is thrown when the config file or a config property is invalid.
! ERROR_PERMISSION_DENIED - This error is thrown when the user doesn't have the required permissions to execute the command. ( user doesn't have all the required flags )
! ERROR_ALREADY_EXISTS - This error is thrown when the command already exists.
! ERROR_INVALID_SYNTAX - This error is thrown when the syntax of the command is invalid.
! ERROR_UNEXPECTED - This error is thrown when an unexpected error occurs.
! ERROR_NOT_FOUND - This error is thrown when the command is not found.
*/
