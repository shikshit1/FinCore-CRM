/**
 * Treat missing/undefined isActive as active (schema default).
 * Only explicit false deactivates an account.
 */
export const isUserActive = (user) => {
  if (!user) return false;
  if (user.isActive === false) return false;
  if (user.isActive === 'false' || user.isActive === 0) return false;
  return true;
};
