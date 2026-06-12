export const STAFF_ROLES = ['admin', 'manager', 'employee'];
export const ALL_ROLES = [...STAFF_ROLES, 'customer'];
/** Roles admins can assign when creating employees via CRM */
export const ASSIGNABLE_EMPLOYEE_ROLES = ['employee', 'manager'];

export const isStaffRole = (role) => STAFF_ROLES.includes(role);
export const isCustomerRole = (role) => role === 'customer';
