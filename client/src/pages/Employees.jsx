import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import PasswordInput from '../components/auth/PasswordInput';
import { ASSIGNABLE_EMPLOYEE_ROLES } from '../utils/roles';
import {
  Search,
  Plus,
  X,
  UserCog,
  KeyRound,
  UserCheck,
  UserX,
  Loader2,
  Shield,
} from 'lucide-react';

const emptyEmployee = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'employee',
};

export default function Employees() {
  const { user: currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState(emptyEmployee);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await userService.getAll(params);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(t);
  }, [fetchEmployees]);

  const showToast = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.password) {
      showToast('Name, email, and password are required', true);
      return;
    }
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', true);
      return;
    }

    try {
      setFormLoading(true);
      await userService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || undefined,
        role: formData.role,
      });
      showToast('Employee created successfully');
      setFormData(emptyEmployee);
      setShowAddModal(false);
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to create employee', true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (emp) => {
    if (emp._id === currentUser?.id || emp._id === currentUser?._id) {
      showToast('You cannot change your own account status', true);
      return;
    }
    if (emp.role === 'admin') {
      showToast('Admin accounts cannot be deactivated', true);
      return;
    }

    const activating = emp.isActive === false;
    try {
      setActionLoading(emp._id);
      if (activating) {
        await userService.activate(emp._id);
        showToast(`${emp.name} activated`);
      } else {
        await userService.deactivate(emp._id);
        showToast(`${emp.name} deactivated`);
      }
      fetchEmployees();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setActionLoading(null);
    }
  };

  const openResetPassword = (emp) => {
    setResetTarget(emp);
    setNewPassword('');
    setShowResetModal(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', true);
      return;
    }
    try {
      setFormLoading(true);
      await userService.resetPassword(resetTarget._id, newPassword);
      showToast(`Password reset for ${resetTarget.name}`);
      setShowResetModal(false);
      setResetTarget(null);
      setNewPassword('');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  const roleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300',
      manager: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300',
      employee: 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[role] || styles.employee}`}>
        {role === 'admin' && <Shield size={12} />}
        {role}
      </span>
    );
  };

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <UserCog className="text-blue-600" size={28} /> Employees
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                Create and manage internal CRM accounts (admin only)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition"
            >
              <Plus size={20} /> Add Employee
            </button>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm flex justify-between">
              <span>{success}</span>
              <button type="button" onClick={() => setSuccess(null)}><X size={18} /></button>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm flex justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}><X size={18} /></button>
            </div>
          )}

          <div className="fincore-card p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="fincore-input pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="fincore-input lg:w-40"
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="fincore-input lg:w-40"
              >
                <option value="">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="fincore-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-slate-300">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-slate-300">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-slate-300 hidden md:table-cell">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-slate-300">Role</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-slate-300">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-slate-300 hidden lg:table-cell">Created</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500 dark:text-slate-400">
                        No employees found. Add your first team member.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => {
                      const isSelf = emp._id === currentUser?.id || emp._id === currentUser?._id;
                      const isAdminAccount = emp.role === 'admin';
                      return (
                        <tr key={emp._id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">
                            {emp.name}
                            {isSelf && (
                              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(you)</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-slate-400">{emp.email}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-slate-400 hidden md:table-cell">
                            {emp.phone || '—'}
                          </td>
                          <td className="px-4 py-3">{roleBadge(emp.role)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                emp.isActive !== false
                                  ? 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300'
                                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                              }`}
                            >
                              {emp.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-slate-400 hidden lg:table-cell">
                            {formatDate(emp.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1 flex-wrap">
                              <button
                                type="button"
                                onClick={() => openResetPassword(emp)}
                                className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600"
                                title="Reset password"
                              >
                                <KeyRound size={16} />
                              </button>
                              {!isSelf && !isAdminAccount && (
                                <button
                                  type="button"
                                  disabled={actionLoading === emp._id}
                                  onClick={() => handleToggleStatus(emp)}
                                  className={`p-2 rounded-lg transition ${
                                    emp.isActive !== false
                                      ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40'
                                      : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40'
                                  }`}
                                  title={emp.isActive !== false ? 'Deactivate' : 'Activate'}
                                >
                                  {actionLoading === emp._id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : emp.isActive !== false ? (
                                    <UserX size={16} />
                                  ) : (
                                    <UserCheck size={16} />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Employee" size="md">
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name *</label>
                <input name="name" required value={formData.name} onChange={handleFormChange} className="fincore-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email *</label>
                <input name="email" type="email" required value={formData.email} onChange={handleFormChange} className="fincore-input" />
              </div>
              <div>
                <PasswordInput
                  label="Password *"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleFormChange} className="fincore-input" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Role *</label>
                <select name="role" value={formData.role} onChange={handleFormChange} className="fincore-input">
                  {ASSIGNABLE_EMPLOYEE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create'}
                </button>
              </div>
            </form>
      </Modal>

      <Modal
        isOpen={showResetModal && !!resetTarget}
        onClose={() => setShowResetModal(false)}
        title="Reset Password"
        size="md"
      >
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Set a new password for <strong className="text-gray-800 dark:text-slate-200">{resetTarget?.name}</strong>
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <PasswordInput
                label="New password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowResetModal(false)} className="flex-1 py-2.5 border rounded-lg dark:border-slate-600">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {formLoading ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
}
