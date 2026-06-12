/** Map Mongoose / Mongo errors to client-friendly auth messages */
export const formatAuthError = (error) => {
  if (!error) return 'Request failed';

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    if (field === 'email') return 'An account with this email already exists';
    return `Duplicate value for ${field}`;
  }

  if (error.name === 'ValidationError') {
    return Object.values(error.errors)
      .map((e) => e.message)
      .join('. ');
  }

  return error.message || 'Request failed';
};

export const sendAuthError = (res, error, context, statusCode = 500) => {
  console.error(`[auth] ${context}:`, error);
  const message = formatAuthError(error);
  const code = error?.code === 11000 || error?.name === 'ValidationError' ? 400 : statusCode;
  return res.status(code).json({ message });
};
