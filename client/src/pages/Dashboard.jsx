import { useEffect, useState } from 'react';
import { dashboardService } from '../services/apiService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, FileText, DollarSign, ArrowUpRight, UserPlus } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, breakdownData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getBreakdown(),
      ]);
      setStats(statsData);
      setBreakdown(breakdownData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fincore-page">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-slate-400 text-lg">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fincore-page">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100">Dashboard</h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1">Welcome back! Here's your business overview.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats && (
                <>
                  <div className="fincore-card hover:shadow-lg transition p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <ArrowUpRight size={14} /> 12%
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-1">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.totalCustomers || 0}</p>
                  </div>

                  <div className="fincore-card hover:shadow-lg transition p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <ArrowUpRight size={14} /> 8%
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-1">Active Customers</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.activeCustomers || 0}</p>
                  </div>

                  <div className="fincore-card hover:shadow-lg transition p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <ArrowUpRight size={14} /> 15%
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-1">Total Loans</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.totalLoans || 0}</p>
                  </div>

                  <Link to="/leads" className="fincore-card hover:shadow-lg transition p-6 block">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-orange-100 dark:bg-orange-950/50 p-3 rounded-lg">
                        <UserPlus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      {(stats.newLeads || 0) > 0 && (
                        <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                          {stats.newLeads} new
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-1">Website Leads</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.totalLeads || 0}</p>
                  </Link>

                  <div className="fincore-card hover:shadow-lg transition p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <DollarSign className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        <ArrowUpRight size={14} /> 20%
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-1">Approved Loans</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.approvedLoans || 0}</p>
                  </div>
                </>
              )}
            </div>

            {/* Charts and Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Loans by Status */}
              <div className="fincore-card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Loan Status Distribution</h2>
                {breakdown?.loansByStatus && breakdown.loansByStatus.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.loansByStatus.map((item) => {
                      const total = breakdown.loansByStatus.reduce((sum, i) => sum + i.count, 0);
                      const percentage = ((item.count / total) * 100).toFixed(1);
                      const colors = {
                        pending: 'bg-yellow-400',
                        submitted: 'bg-blue-400',
                        approved: 'bg-green-400',
                        rejected: 'bg-red-400',
                        disbursed: 'bg-indigo-400',
                      };
                      return (
                        <div key={item._id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">{item._id}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${colors[item._id] || 'bg-gray-400'} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-slate-400">No loan data available</p>
                )}
              </div>

              {/* Loans by Type */}
              <div className="fincore-card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Loans by Type</h2>
                {breakdown?.loansByType && breakdown.loansByType.length > 0 ? (
                  <div className="space-y-4">
                    {breakdown.loansByType.map((item) => {
                      const total = breakdown.loansByType.reduce((sum, i) => sum + i.count, 0);
                      const percentage = ((item.count / total) * 100).toFixed(1);
                      const colors = [
                        'bg-blue-500',
                        'bg-purple-500',
                        'bg-pink-500',
                        'bg-indigo-500',
                        'bg-cyan-500',
                      ];
                      const colorIndex = breakdown.loansByType.indexOf(item) % colors.length;
                      return (
                        <div key={item._id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">{item._id || 'Other'}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${colors[colorIndex]} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-slate-400">No loan type data available</p>
                )}
              </div>
            </div>

            {/* Recent Activity / Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="fincore-card p-6">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Monthly Active Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{Math.floor((stats?.activeCustomers || 0) * 0.8)}</p>
                <p className="text-green-600 text-xs mt-2">↑ 5% from last month</p>
              </div>
              <div className="fincore-card p-6">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Average Loan Amount</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">₹3.5L</p>
                <p className="text-green-600 text-xs mt-2">↑ 8% from last month</p>
              </div>
              <div className="fincore-card p-6">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Approval Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">78%</p>
                <p className="text-green-600 text-xs mt-2">↑ 5% improvement</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
