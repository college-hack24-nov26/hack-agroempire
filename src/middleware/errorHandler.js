/**
 * Central Error Handling Middleware
 */

export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Krushi Drushti Error] ${req.method} ${req.url}:`, message);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
}

