import LoanApplication from '../models/LoanApplication.js';
import LoanNotification from '../models/LoanNotification.js';
import Customer from '../models/Customer.js';
import ActivityLog from '../models/ActivityLog.js';
import { LOAN_STATUSES } from '../config/loanStatuses.js';
import { sendLoanStatusWhatsApp } from '../services/notificationService.js';

const populateLoanQuery = (query) =>
  query
    .populate('customer', 'firstName lastName email phone alternatePhone')
    .populate('bank', 'name code')
    .populate('assignedEmployee', 'name email')
    .populate('timeline.updatedBy', 'name email')
    .populate('statusHistory.updatedBy', 'name email');

export const getAllLoans = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, customerId, bankId } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    const rawStatus = status ? String(status).trim() : '';
    const statusFilter =
      rawStatus && !['all', 'All Status', 'all status'].includes(rawStatus.toLowerCase())
        ? rawStatus
        : '';
    if (statusFilter) query.status = statusFilter;
    if (customerId) query.customer = customerId;
    if (bankId) query.bank = bankId;

    const loans = await LoanApplication.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('bank', 'name')
      .populate('assignedEmployee', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await LoanApplication.countDocuments(query);

    res.json({
      loans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await populateLoanQuery(LoanApplication.findById(req.params.id));

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const notifications = await LoanNotification.find({ loan: loan._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ ...loan.toObject(), notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const loan = new LoanApplication({
      ...req.body,
      status: 'pending',
      assignedEmployee: req.body.assignedEmployee || userId,
      timeline: [
        {
          action: 'created',
          status: 'pending',
          remarks: 'Loan application created',
          date: new Date(),
          updatedBy: userId,
        },
      ],
      statusHistory: [],
    });
    await loan.save();

    await Customer.findByIdAndUpdate(req.body.customer, {
      $push: { loanApplications: loan._id },
    });

    await ActivityLog.create({
      user: userId,
      action: 'Created loan application',
      entityType: 'LoanApplication',
      entityId: loan._id,
      newValues: loan.toObject(),
    });

    const populated = await populateLoanQuery(LoanApplication.findById(loan._id));

    res.status(201).json({
      message: 'Loan application created successfully',
      loan: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { status, remarks, rejectionReason, bank } = req.body;
    const userId = req.user.userId;

    if (!status || !LOAN_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid loan status' });
    }

    const loan = await LoanApplication.findById(req.params.id).populate('customer').populate('bank');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const previousStatus = loan.status;
    if (previousStatus === status) {
      return res.status(400).json({ message: 'Loan is already in this status' });
    }

    const now = new Date();

    let notificationResult = null;
    let notificationSent = false;

    const notifyResult = await sendLoanStatusWhatsApp({
      loan,
      customer: loan.customer,
      newStatus: status,
      sentByUserId: userId,
      rejectionReason,
    });

    if (!notifyResult.skipped) {
      notificationResult = notifyResult;
      notificationSent = Boolean(notifyResult.whatsapp?.success);
    }

    const update = {
      status,
      updatedAt: now,
      $push: {
        timeline: {
          action: 'status_change',
          status,
          previousStatus,
          remarks: remarks || `Status updated to ${status}`,
          date: now,
          updatedBy: userId,
          notificationSent,
        },
        statusHistory: {
          fromStatus: previousStatus,
          toStatus: status,
          remarks: remarks || '',
          updatedBy: userId,
          updatedAt: now,
          notificationSent,
        },
      },
    };

    if (status === 'approved') update.approvalDate = now;
    if (status === 'disbursed') update.disbursalDate = now;
    if (status === 'rejected' && rejectionReason) update.rejectionReason = rejectionReason;
    if (bank) update.bank = bank;
    if (notificationSent) update.lastWhatsAppAt = now;

    const updatedLoan = await LoanApplication.findByIdAndUpdate(req.params.id, update, { new: true });

    await ActivityLog.create({
      user: userId,
      action: `Loan status: ${previousStatus} → ${status}`,
      entityType: 'LoanApplication',
      entityId: loan._id,
      newValues: { status, remarks, rejectionReason },
    });

    const populated = await populateLoanQuery(LoanApplication.findById(updatedLoan._id));

    res.json({
      message: 'Loan status updated successfully',
      loan: populated,
      notification: notificationResult
        ? {
            sent: notificationResult.whatsapp?.success,
            provider: notificationResult.whatsapp?.provider,
            simulated: notificationResult.whatsapp?.simulated,
            error: notificationResult.whatsapp?.error,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const { status, ...rest } = req.body;
    if (status) {
      return res.status(400).json({
        message: 'Use PATCH /loans/:id/status to update loan status',
      });
    }

    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { ...rest, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Updated loan application',
      entityType: 'LoanApplication',
      entityId: loan._id,
      newValues: rest,
    });

    res.json({
      message: 'Loan updated successfully',
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveLoan = async (req, res) => {
  req.body = { ...req.body, status: 'approved', remarks: req.body.remarks || 'Loan approved' };
  return updateLoanStatus(req, res);
};

export const rejectLoan = async (req, res) => {
  req.body = {
    ...req.body,
    status: 'rejected',
    remarks: req.body.remarks || 'Loan rejected',
    rejectionReason: req.body.rejectionReason,
  };
  return updateLoanStatus(req, res);
};

export const getLoanStatuses = async (req, res) => {
  res.json({
    statuses: LOAN_STATUSES.filter(s => !['submitted', 'completed'].includes(s)),
  });
};
