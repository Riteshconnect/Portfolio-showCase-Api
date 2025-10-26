import { Request, Response, NextFunction } from 'express';

// This is our centralized error handler
// It MUST have these 4 arguments (err, req, res, next)
// for Express to recognize it as an error-handling middleware.

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if a status code was set on the response.
  // If we threw an error after res.status(401), this will be 401.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // We only want to see the stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { errorHandler };  