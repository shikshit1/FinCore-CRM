import Customer from '../models/Customer.js';
import LoanApplication from '../models/LoanApplication.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import Lead from '../models/Lead.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalCustomers: await Customer.countDocuments(),
      activeCustomers: await Customer.countDocuments({ status: 'active' }),
      totalLoans: await LoanApplication.countDocuments(),
      approvedLoans: await LoanApplication.countDocuments({ status: 'approved' }),
      pendingLoans: await LoanApplication.countDocuments({ status: 'pending' }),
      totalTasks: await Task.countDocuments(),
      pendingTasks: await Task.countDocuments({ status: 'pending' }),
      completedTasks: await Task.countDocuments({ status: 'completed' }),
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      totalLeads: await Lead.countDocuments(),
      newLeads: await Lead.countDocuments({ status: 'new_lead' }),
    };

    const loanAmount = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$loanAmount' },
        },
      },
    ]);

    const approvedAmount = loanAmount.find(x => x._id === 'approved')?.totalAmount || 0;
    const disbursedAmount = loanAmount.find(x => x._id === 'disbursed')?.totalAmount || 0;

    stats.totalApprovedAmount = approvedAmount;
    stats.totalDisbursedAmount = disbursedAmount;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardBreakdown = async (req, res) => {
  try {
    const loansByType = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$loanType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$loanAmount' },
        },
      },
    ]);

    const loansByStatus = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const customersByStatus = await Customer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      loansByType,
      loansByStatus,
      customersByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.find()
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const myTasks = await Task.find({ assignedTo: userId })
      .populate('relatedCustomer')
      .populate('relatedLoan')
      .sort({ dueDate: 1 })
      .limit(5);

    const myCustomers = await Customer.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const myLoans = await LoanApplication.find({ assignedEmployee: userId })
      .populate('customer')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      pendingTasks: await Task.countDocuments({ assignedTo: userId, status: 'pending' }),
      completedTasks: await Task.countDocuments({ assignedTo: userId, status: 'completed' }),
      myCustomersCount: await Customer.countDocuments({ assignedTo: userId }),
      myLoansCount: await LoanApplication.countDocuments({ assignedEmployee: userId }),
      myPendingLoans: await LoanApplication.countDocuments({
        assignedEmployee: userId,
        status: 'pending',
      }),
    };

    res.json({
      tasks: myTasks,
      customers: myCustomers,
      loans: myLoans,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
