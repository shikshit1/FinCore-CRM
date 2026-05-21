import { useEffect, useState } from 'react';
import { callService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Phone, Plus, X, Clock, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function CallTracking() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    telecallerName: '',
    customerName: '',
    phoneNumber: '',
    callStatus: 'connected',
    duration: '',
    leadGenerated: false,
    followUpDate: '',
    notes: '',
  });

  // Mock analytics data
  const analytics = {
    totalCalls: 127,
    connectedCalls: 89,
    connectionRatio: '70%',
    leadsGenerated: 34,
    conversionRatio: '38%',
    avgDuration: '4:23',
    followupsPending: 12,
  };

  // Mock call logs
  const mockCalls = [
    {
      _id: '1',
      telecallerName: 'Rajesh Kumar',
      customerName: 'Amit Sharma',
      phoneNumber: '9876543210',
      callStatus: 'connected',
      duration: '6:45',
      leadGenerated: true,
      followUpDate: '2026-05-25',
      notes: 'Interested in personal loan',
    },
    {
      _id: '2',
      telecallerName: 'Priya Singh',
      customerName: 'Neha Patel',
      phoneNumber: '9123456789',
      callStatus: 'not-connected',
      duration: '0:30',
      leadGenerated: false,
      followUpDate: '2026-05-22',
      notes: 'Line busy, will retry',
    },
    {
      _id: '3',
      telecallerName: 'Vikram Patel',
      customerName: 'Sanjay Verma',
      phoneNumber: '8765432109',
      callStatus: 'interested',
      duration: '8:12',
      leadGenerated: true,
      followUpDate: '2026-05-27',
      notes: 'Ready to apply for home loan',
    },
    {
      _id: '4',
      telecallerName: 'Rajesh Kumar',
      customerName: 'Karan Singh',
      phoneNumber: '9999888777',
      callStatus: 'not-interested',
      duration: '2:15',
      leadGenerated: false,
      followUpDate: null,
      notes: 'Not interested in any offers',
    },
    {
      _id: '5',
      telecallerName: 'Priya Singh',
      customerName: 'Divya Sharma',
      phoneNumber: '9111222333',
      callStatus: 'follow-up-required',
      duration: '4:50',
      leadGenerated: true,
      followUpDate: '2026-05-23',
      notes: 'Needs more information about loan terms',
    },
  ];

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      // For now use mock data, in production this would call the API
      setCalls(mockCalls);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.telecallerName || !formData.customerName || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // For now, just add to local state
      const newCall = {
        _id: Date.now().toString(),
        ...formData,
      };
      setCalls([newCall, ...calls]);
      setSuccess('Call log added successfully!');
      setFormData({
        telecallerName: '',
        customerName: '',
        phoneNumber: '',
        callStatus: 'connected',
        duration: '',
        leadGenerated: false,
        followUpDate: '',
        notes: '',
      });
      setShowForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'connected': 'bg-green-100 text-green-800',
      'not-connected': 'bg-red-100 text-red-800',
      'busy': 'bg-yellow-100 text-yellow-800',
      'switched-off': 'bg-gray-100 text-gray-800',
      'interested': 'bg-blue-100 text-blue-800',
      'not-interested': 'bg-red-100 text-red-800',
      'follow-up-required': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplay = (status) => {
    const display = {
      'connected': 'Connected',
      'not-connected': 'Not Connected',
      'busy': 'Busy',
      'switched-off': 'Switched Off',
      'interested': 'Interested',
      'not-interested': 'Not Interested',
      'follow-up-required': 'Follow-up Required',
    };
    return display[status] || status;
  };

  const filteredCalls = filterStatus === 'all' 
    ? calls 
    : calls.filter(call => call.callStatus === filterStatus);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Call Tracking</h1>
                <p className="text-gray-500 mt-1">Monitor telecaller performance and lead generation</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium flex items-center gap-2 shadow-md"
              >
                <Plus size={20} /> Add Call
              </button>
            </div>

            {/* Alerts */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
                <span>✓ {success}</span>
                <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
                  <X size={20} />
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Add Call Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Log Call</h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telecaller Name *
                        </label>
                        <input
                          type="text"
                          name="telecallerName"
                          required
                          value={formData.telecallerName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Rajesh Kumar"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          required
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Amit Sharma"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          required
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Call Status *
                        </label>
                        <select
                          name="callStatus"
                          value={formData.callStatus}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="connected">Connected</option>
                          <option value="not-connected">Not Connected</option>
                          <option value="busy">Busy</option>
                          <option value="switched-off">Switched Off</option>
                          <option value="interested">Interested</option>
                          <option value="not-interested">Not Interested</option>
                          <option value="follow-up-required">Follow-up Required</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (mm:ss)
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="5:30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Follow-up Date
                        </label>
                        <input
                          type="date"
                          name="followUpDate"
                          value={formData.followUpDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="leadGenerated"
                        checked={formData.leadGenerated}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 font-medium text-gray-700">Lead Generated</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Call details and observations..."
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
                      >
                        Save Call Log
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 text-sm font-medium">Total</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Total Calls</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalCalls}</p>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">{analytics.connectionRatio}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Connected Calls</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.connectedCalls}</p>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-purple-600 text-sm font-medium">{analytics.conversionRatio}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Leads Generated</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.leadsGenerated}</p>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-orange-600 text-sm font-medium">Avg</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Avg Duration</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.avgDuration}</p>
              </div>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Calls
              </button>
              <button
                onClick={() => setFilterStatus('connected')}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  filterStatus === 'connected'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Connected
              </button>
              <button
                onClick={() => setFilterStatus('interested')}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  filterStatus === 'interested'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Interested
              </button>
              <button
                onClick={() => setFilterStatus('follow-up-required')}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  filterStatus === 'follow-up-required'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Follow-up
              </button>
            </div>

            {/* Call Logs Table */}
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading call logs...</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No calls found</p>
                <p className="text-gray-400 mt-2">Start logging calls to track performance</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Telecaller</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lead</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCalls.map((call) => (
                      <tr key={call._id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{call.telecallerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{call.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{call.phoneNumber}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.callStatus)}`}>
                            {getStatusDisplay(call.callStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{call.duration || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          {call.leadGenerated ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Yes</span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {call.followUpDate ? new Date(call.followUpDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
