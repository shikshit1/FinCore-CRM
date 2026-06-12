export const STAFF_ROLES = ['admin', 'manager', 'employee'];
export const ASSIGNABLE_EMPLOYEE_ROLES = ['employee', 'manager'];

export const isStaff = (user) => user && STAFF_ROLES.includes(user.role);
export const isCustomer = (user) => user?.role === 'customer';
export const isAdmin = (user) => user?.role === 'admin';

export const getHomePath = (user) => {
  if (!user) return '/login';
  if (isCustomer(user)) return '/customer/dashboard';
  return '/dashboard';
};
