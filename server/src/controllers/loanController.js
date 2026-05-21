import LoanApplication from '../models/LoanApplication.js';
import Customer from '../models/Customer.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllLoans = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, customerId } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (customerId) query.customer = customerId;

    const loans = await LoanApplication.find(query)
      .populate('customer', 'firstName lastName email')
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
    const loan = await LoanApplication.findById(req.params.id)
      .populate('customer')
      .populate('bank')
      .populate('assignedEmployee', 'name email');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const loan = new LoanApplication(req.body);
    await loan.save();

    await Customer.findByIdAndUpdate(req.body.customer, {
      $push: { loanApplications: loan._id },
    });

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Created loan application',
      entityType: 'LoanApplication',
      entityId: loan._id,
      newValues: loan.toObject(),
    });

    res.status(201).json({
      message: 'Loan application created successfully',
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
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
      newValues: req.body,
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
  try {
    const { approvalDate, bank } = req.body;
    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvalDate: approvalDate || new Date(),
        bank,
        updatedAt: new Date(),
      },
      { new: true }
    );

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Approved loan application',
      entityType: 'LoanApplication',
      entityId: loan._id,
    });

    res.json({
      message: 'Loan approved successfully',
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectLoan = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason,
        updatedAt: new Date(),
      },
      { new: true }
    );

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Rejected loan application',
      entityType: 'LoanApplication',
      entityId: loan._id,
      newValues: { rejectionReason },
    });

    res.json({
      message: 'Loan rejected successfully',
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
