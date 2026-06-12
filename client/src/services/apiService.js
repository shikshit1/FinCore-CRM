const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Build query string — omits empty, null, and undefined params */
const buildQueryString = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    const str = String(value).trim();
    if (!str || str === 'all' || str.toLowerCase() === 'all status') return;
    search.append(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    const msg = data.message || data.errors?.join(', ') || 'API Error';
    throw new Error(msg);
  }
  return data;
};

// User Service (admin employee management)
export const userService = {
  getTeam: () => apiCall('/users/team/list'),
  getAll: (params = {}) => apiCall(`/users${buildQueryString(params)}`),
  create: (data) =>
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deactivate: (id) => apiCall(`/users/${id}/deactivate`, { method: 'POST' }),
  activate: (id) => apiCall(`/users/${id}/activate`, { method: 'POST' }),
  resetPassword: (id, password) =>
    apiCall(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// Auth Service
export const authService = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerCustomer: (name, email, password, phone) =>
    apiCall('/auth/register/customer', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    }),
  getCurrentUser: () => apiCall('/auth/me'),
};

// Customer Service
export const customerService = {
  getAll: (params = {}) => apiCall(`/customers${buildQueryString(params)}`),
  getById: (id) => apiCall(`/customers/${id}`),
  create: (customer) =>
    apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    }),
  update: (id, customer) =>
    apiCall(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    }),
  delete: (id) =>
    apiCall(`/customers/${id}`, {
      method: 'DELETE',
    }),
};

// Loan Service
export const loanService = {
  getAll: (params = {}) => apiCall(`/loans${buildQueryString(params)}`),
  getById: (id) => apiCall(`/loans/${id}`),
  create: (loan) =>
    apiCall('/loans', {
      method: 'POST',
      body: JSON.stringify(loan),
    }),
  update: (id, loan) =>
    apiCall(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(loan),
    }),
  approve: (id, data) =>
    apiCall(`/loans/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  reject: (id, data) =>
    apiCall(`/loans/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id, data) =>
    apiCall(`/loans/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  getStatuses: () => apiCall('/loans/meta/statuses'),
};

// Bank Service
export const bankService = {
  getAll: () => apiCall('/banks'),
  getById: (id) => apiCall(`/banks/${id}`),
  getApprovals: (id) => apiCall(`/banks/${id}/approvals`),
  getAnalytics: () => apiCall('/banks/analytics/summary'),
  create: (bank) =>
    apiCall('/banks', {
      method: 'POST',
      body: JSON.stringify(bank),
    }),
  update: (id, bank) =>
    apiCall(`/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bank),
    }),
  delete: (id) =>
    apiCall(`/banks/${id}`, {
      method: 'DELETE',
    }),
};

// Task Service
export const taskService = {
  getAll: (params = {}) => apiCall(`/tasks${buildQueryString(params)}`),
  getById: (id) => apiCall(`/tasks/${id}`),
  create: (task) =>
    apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  update: (id, task) =>
    apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
  complete: (id, data) =>
    apiCall(`/tasks/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

// Dashboard Service
export const dashboardService = {
  getStats: () => apiCall('/dashboard/stats'),
  getBreakdown: () => apiCall('/dashboard/breakdown'),
  getActivities: () => apiCall('/dashboard/activities'),
  getMyDashboard: () => apiCall('/dashboard/my-dashboard'),
};

// Call Service
export const callService = {
  getAll: (params = {}) => apiCall(`/calls${buildQueryString(params)}`),
  getById: (id) => apiCall(`/calls/${id}`),
  create: (call) =>
    apiCall('/calls', {
      method: 'POST',
      body: JSON.stringify(call),
    }),
  update: (id, call) =>
    apiCall(`/calls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(call),
    }),
  delete: (id) =>
    apiCall(`/calls/${id}`, {
      method: 'DELETE',
    }),
  getAnalytics: () => apiCall('/calls/analytics'),
};

// Customer Portal Service
export const portalService = {
  getDashboard: () => apiCall('/portal/dashboard'),
  getProfile: () => apiCall('/portal/profile'),
  updateProfile: (data) =>
    apiCall('/portal/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getLoans: () => apiCall('/portal/loans'),
  getLoanById: (id) => apiCall(`/portal/loans/${id}`),
  getDocuments: () => apiCall('/portal/documents'),
  getNotifications: () => apiCall('/portal/notifications'),
  uploadDocument: async (docType, file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    const response = await fetch(`${API_URL}/portal/documents/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};

// Lead Service
const publicFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.errors?.map((e) => e.msg).join('. ') || 'Request failed');
  return data;
};

export const leadService = {
  submit: (payload) =>
    publicFetch('/leads/submit', { method: 'POST', body: JSON.stringify(payload) }),
  getAll: (params = {}) => apiCall(`/leads${buildQueryString(params)}`),
  getById: (id) => apiCall(`/leads/${id}`),
  getStats: () => apiCall('/leads/stats'),
  updateStatus: (id, data) =>
    apiCall(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  addNote: (id, remarks) =>
    apiCall(`/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ remarks }) }),
  convert: (id, data = {}) =>
    apiCall(`/leads/${id}/convert`, { method: 'POST', body: JSON.stringify(data) }),
};

// Settings Service
export const settingsService = {
  getSettings: () => apiCall('/settings'),
  updateSettings: (settings) =>
    apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};
