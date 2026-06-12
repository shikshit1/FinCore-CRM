import jwt from 'jsonwebtoken';

export const generateToken = (userId, role, customerId = null, expiresIn) => {
  const payload = { userId, role };
  if (customerId) payload.customerId = customerId.toString();
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: expiresIn || process.env.JWT_EXPIRE || '7d',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    return null;
  }
};
