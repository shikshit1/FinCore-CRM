import { useEffect, useState } from 'react';
import { taskService, userService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/ui/Modal';
import { CheckCircle, Clock, AlertCircle, Plus, X } from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    category: 'other',
    status: 'pending',
  });

  useEffect(() => {
    fetchTasks();
    fetchTeamUsers();
  }, []);

  const fetchTeamUsers = async () => {
    try {
      const users = await userService.getTeam();
      setTeamUsers(Array.isArray(users) ? users : []);
      if (user?._id || user?.id) {
        setFormData(prev => ({
          ...prev,
          assignedTo: prev.assignedTo || user._id || user.id,
        }));
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      setFormError('Please fill in all required fields: Title, Assigned To, and Due Date');
      return;
    }

    try {
      setFormLoading(true);
      
      // Prepare payload with dueDate in proper format
      const payload = {
        title: formData.title,
        description: formData.description || '',
        assignedTo: formData.assignedTo,
        dueDate: new Date(formData.dueDate).toISOString(),
        priority: formData.priority,
        category: formData.category,
        status: formData.status,
      };
      
      await taskService.create(payload);
      setSuccess('Task created successfully!');
      setFormData({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', category: 'other', status: 'pending' });
      setShowForm(false);
      await fetchTasks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to create task';
      setFormError(errorMsg);
      console.error('Task creation error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleTask = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[priority] || 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-blue-500" />;
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="fincore-main">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="fincore-content">
            <div className="fincore-page-header">
              <div>
                <h1 className="fincore-page-title">Tasks</h1>
                <p className="fincore-page-subtitle">Manage your workflow and deadlines</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="fincore-btn-action"
              >
                <Plus size={20} /> New Task
              </button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="fincore-card p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{tasks.length}</p>
              </div>
              <div className="fincore-card p-6 border-l-4 border-yellow-500">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{tasks.filter(t => t.status === 'pending').length}</p>
              </div>
              <div className="fincore-card p-6 border-l-4 border-green-500">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>

            <Modal
              isOpen={showForm}
              onClose={() => { setShowForm(false); setFormError(null); }}
              title="Create New Task"
              size="md"
            >
              {formError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">{formError}</div>
                  )}
                  {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✓ {success}</div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Follow up with customer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task details..."
                        rows="3"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Assigned To *</label>
                      <select
                        name="assignedTo"
                        required
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select Team Member --</option>
                        {teamUsers.map(u => (
                          <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Due Date *</label>
                        <input
                          type="date"
                          required
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition font-medium"
                      >
                        {formLoading ? 'Creating...' : 'Create Task'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="w-full sm:flex-1 border border-gray-300 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
            </Modal>

            {/* Filter */}
            <div className="mb-6 overflow-x-auto -mx-1 px-1">
              <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                {[
                  { id: 'all', label: 'All Tasks' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition font-medium text-sm whitespace-nowrap ${
                      filter === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="fincore-card p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-slate-400">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="fincore-card p-8 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-slate-400 text-lg">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <div key={task._id} className="fincore-card hover:shadow-lg transition p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <button
                        onClick={() => handleToggleTask(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                        className="mt-1 flex-shrink-0"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <h3 className={`text-base sm:text-lg font-bold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-slate-100'}`}>
                            {task.title}
                          </h3>
                          <span className={`self-start px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-slate-400 text-sm mb-3">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                          <span className="capitalize">{task.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
