import { useEffect, useState } from 'react';
import { dashboardService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-100',
    },
    {
      title: 'Active Loans',
      value: stats?.totalLoans || 0,
      icon: FileText,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-100',
    },
    {
      title: 'Approved Loans',
      value: stats?.approvedLoans || 0,
      icon: TrendingUp,
      color: 'bg-green-600',
      lightColor: 'bg-green-100',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.approvedLoans * 50000 || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-500 mt-1">Business performance and key metrics</p>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading report data...</p>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {reportCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${card.lightColor} p-3 rounded-lg`}>
                            <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                          </div>
                          <span className="text-green-600 text-sm font-medium">↑ 12%</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Loan Status Distribution */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Loan Status Distribution</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Approved', value: 65, color: 'bg-green-500' },
                        { label: 'Pending', value: 25, color: 'bg-yellow-500' },
                        { label: 'Rejected', value: 10, color: 'bg-red-500' },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Growth */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Growth</h3>
                    <div className="space-y-4">
                      {[
                        { month: 'Jan', loans: 12, customers: 45 },
                        { month: 'Feb', loans: 18, customers: 62 },
                        { month: 'Mar', loans: 24, customers: 89 },
                        { month: 'Apr', loans: 31, customers: 125 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 w-12">{item.month}</span>
                          <div className="flex-1 ml-4">
                            <div className="flex h-8 gap-2">
                              <div className="flex-1 bg-blue-400 rounded flex items-end" style={{ height: `${(item.loans / 31) * 100}%` }} title={`${item.loans} loans`}></div>
                              <div className="flex-1 bg-purple-400 rounded flex items-end" style={{ height: `${(item.customers / 125) * 100}%` }} title={`${item.customers} customers`}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded"></div>
                        <span className="text-gray-600">Loans</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded"></div>
                        <span className="text-gray-600">Customers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm mb-2">Avg Loan Amount</p>
                    <p className="text-3xl font-bold text-gray-900">₹3.5L</p>
                    <p className="text-green-600 text-xs mt-2">↑ 8% from last month</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm mb-2">Approval Rate</p>
                    <p className="text-3xl font-bold text-gray-900">78%</p>
                    <p className="text-green-600 text-xs mt-2">↑ 5% improvement</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 text-sm mb-2">Customer Retention</p>
                    <p className="text-3xl font-bold text-gray-900">92%</p>
                    <p className="text-green-600 text-xs mt-2">↑ 3% from last month</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
