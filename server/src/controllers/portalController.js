import Customer from '../models/Customer.js';
import LoanApplication from '../models/LoanApplication.js';
import LoanNotification from '../models/LoanNotification.js';
import { STATUS_LABELS } from '../config/loanStatuses.js';

const WORKFLOW_STEPS = [
  { key: 'pending', label: 'Applied' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'documents_pending', label: 'Documents Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'disbursed', label: 'Disbursed' },
];

const formatLoanForPortal = (loan) => ({
  _id: loan._id,
  applicationNumber: loan.applicationNumber,
  loanType: loan.loanType,
  loanAmount: loan.loanAmount,
  tenure: loan.tenure,
  monthlyEMI: loan.monthlyEMI,
  interestRate: loan.interestRate,
  status: loan.status,
  bank: loan.bank,
  approvalDate: loan.approvalDate,
  disbursalDate: loan.disbursalDate,
  rejectionReason: loan.rejectionReason,
  purpose: loan.purpose,
  createdAt: loan.createdAt,
  updatedAt: loan.updatedAt,
  timeline: loan.timeline,
  statusHistory: loan.statusHistory,
});

export const getPortalDashboard = async (req, res) => {
  try {
    const customerId = req.customerId;
    const loans = await LoanApplication.find({ customer: customerId })
      .populate('bank', 'name')
      .sort({ createdAt: -1 });

    const stats = {
      totalLoans: loans.length,
      pending: loans.filter(l => ['pending', 'under_review', 'documents_pending', 'submitted'].includes(l.status)).length,
      approved: loans.filter(l => ['approved', 'disbursed', 'completed'].includes(l.status)).length,
      rejected: loans.filter(l => l.status === 'rejected').length,
      disbursed: loans.filter(l => l.status === 'disbursed').length,
      totalAmount: loans.reduce((s, l) => s + (l.loanAmount || 0), 0),
    };

    const recentLoans = loans.slice(0, 5).map(formatLoanForPortal);
    const notifications = await LoanNotification.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ stats, recentLoans, notifications, workflowSteps: WORKFLOW_STEPS });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortalProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select('-__v');
    if (!customer) return res.status(404).json({ message: 'Profile not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePortalProfile = async (req, res) => {
  try {
    const allowed = ['phone', 'alternatePhone', 'address', 'dateOfBirth', 'gender'];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    updates.updatedAt = new Date();

    const customer = await Customer.findOneAndUpdate(
      { _id: req.customerId },
      updates,
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated', customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortalLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ customer: req.customerId })
      .populate('bank', 'name code')
      .sort({ createdAt: -1 });
    res.json({
      loans: loans.map(formatLoanForPortal),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortalLoanById = async (req, res) => {
  try {
    const loan = await LoanApplication.findOne({
      _id: req.params.id,
      customer: req.customerId,
    })
      .populate('bank', 'name code')
      .populate('timeline.updatedBy', 'name')
      .populate('statusHistory.updatedBy', 'name');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found or access denied' });
    }

    const notifications = await LoanNotification.find({
      loan: loan._id,
      customer: req.customerId,
    }).sort({ createdAt: -1 });

    const statusLabel = STATUS_LABELS[loan.status] || loan.status;

    res.json({
      loan: formatLoanForPortal(loan),
      notifications,
      statusLabel,
      workflowSteps: WORKFLOW_STEPS,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortalDocuments = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select('documents kycStatus');
    res.json({
      documents: customer?.documents || [],
      kycStatus: customer?.kycStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadPortalDocument = async (req, res) => {
  try {
    const { docType } = req.body;
    const validTypes = ['aadhaar', 'pan', 'salary_slip', 'other'];
    if (!validTypes.includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/customers/${req.customerId}/${req.file.filename}`;

    const doc = {
      docType,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      status: 'pending',
      uploadedAt: new Date(),
    };

    const customer = await Customer.findByIdAndUpdate(
      req.customerId,
      { $push: { documents: doc }, updatedAt: new Date() },
      { new: true }
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: doc,
      documents: customer.documents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortalNotifications = async (req, res) => {
  try {
    const notifications = await LoanNotification.find({ customer: req.customerId })
      .populate('loan', 'applicationNumber loanAmount')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
