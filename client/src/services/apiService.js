const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    throw new Error(data.message || 'API Error');
  }
  return data;
};

// Auth Service
export const authService = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password, phone) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    }),
  getCurrentUser: () => apiCall('/auth/me'),
};

// Customer Service
export const customerService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/customers?${query}`);
  },
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
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/loans?${query}`);
  },
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
};

// Bank Service
export const bankService = {
  getAll: () => apiCall('/banks'),
  getById: (id) => apiCall(`/banks/${id}`),
  getApprovals: (id) => apiCall(`/banks/${id}/approvals`),
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
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/tasks?${query}`);
  },
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
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/calls?${query}`);
  },
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

// Settings Service
export const settingsService = {
  getSettings: () => apiCall('/settings'),
  updateSettings: (settings) =>
    apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};
