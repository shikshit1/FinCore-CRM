import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Mail, Phone, MapPin, User, Calendar } from 'lucide-react';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const data = await customerService.getById(id);
      setCustomer(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-blue-100 text-blue-800';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      active: 'bg-green-50 border-green-200',
      inactive: 'bg-gray-50 border-gray-200',
      pending: 'bg-yellow-50 border-yellow-200',
    };
    return colors[status] || 'bg-blue-50 border-blue-200';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading customer details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <button
                onClick={() => navigate('/customers')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
              >
                <ArrowLeft size={20} /> Back to Customers
              </button>
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-red-600 text-lg">{error || 'Customer not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition"
            >
              <ArrowLeft size={20} /> Back to Customers
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <p className="text-gray-500 mt-1">Customer ID: {customer._id}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    customer.status
                  )}`}
                >
                  {customer.status?.charAt(0).toUpperCase() + customer.status?.slice(1)}
                </span>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Contact & Personal Info */}
              <div className="lg:col-span-2">
                {/* Contact Information */}
                <div className={`bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-blue-500 ${getStatusBgColor(customer.status)}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={24} className="text-blue-600" /> Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="text-blue-600 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-lg font-medium text-gray-900">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="text-blue-600 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                        <p className="text-lg font-medium text-gray-900">{customer.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {customer.address && (
                  <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-green-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin size={24} className="text-green-600" /> Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customer.address && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Street Address</p>
                            <p className="text-base font-medium text-gray-900">
                              {customer.address || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">City</p>
                            <p className="text-base font-medium text-gray-900">
                              {customer.city || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">State</p>
                            <p className="text-base font-medium text-gray-900">
                              {customer.state || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Pincode</p>
                            <p className="text-base font-medium text-gray-900">
                              {customer.pincode || 'N/A'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Details */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={24} className="text-purple-600" /> Account Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="text-base font-medium text-gray-900">
                        {customer.status?.charAt(0).toUpperCase() + customer.status?.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Member Since</p>
                      <p className="text-base font-medium text-gray-900">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString('en-IN')
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Loans</p>
                      <p className="text-base font-medium text-gray-900">
                        {customer.loanApplications?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                      <p className="text-base font-medium text-gray-900">
                        {customer.totalTransactions || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Stats */}
              <div>
                {/* Stats Cards */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Active Loans</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {customer.activeLoanCount || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Approved Loans</p>
                      <p className="text-2xl font-bold text-green-600">
                        {customer.approvedLoanCount || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-gray-600 mb-1">Pending Loans</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {customer.pendingLoanCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium">
                      Apply for Loan
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-medium">
                      View Documents
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-medium">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
