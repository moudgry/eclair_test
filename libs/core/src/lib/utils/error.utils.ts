export class AppError extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode = 500,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static fromError(error: unknown, statusCode = 500): AppError {
    if (error instanceof AppError) return error;

    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Unknown error occurred';

    return new AppError(message, statusCode, error);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}
