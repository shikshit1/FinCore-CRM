import Bank from '../models/Bank.js';
import LoanApplication from '../models/LoanApplication.js';

export const getAllBanks = async (req, res) => {
  try {
    const banks = await Bank.find({ isActive: true }).sort({ name: 1 });
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBankById = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    res.json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBank = async (req, res) => {
  try {
    const bank = new Bank(req.body);
    await bank.save();
    res.status(201).json({
      message: 'Bank created successfully',
      bank,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBank = async (req, res) => {
  try {
    const bank = await Bank.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    res.json({
      message: 'Bank updated successfully',
      bank,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBankApprovals = async (req, res) => {
  try {
    const loans = await LoanApplication.find({
      bank: req.params.id,
      status: { $in: ['approved', 'rejected', 'disbursed'] },
    })
      .populate('customer', 'firstName lastName email')
      .sort({ approvalDate: -1 });

    const approvalStats = {
      totalApplications: 0,
      approved: 0,
      rejected: 0,
      disbursed: 0,
      approvalRate: 0,
    };

    loans.forEach(loan => {
      if (loan.status === 'approved') approvalStats.approved++;
      if (loan.status === 'rejected') approvalStats.rejected++;
      if (loan.status === 'disbursed') approvalStats.disbursed++;
    });

    approvalStats.totalApplications = loans.length;
    approvalStats.approvalRate =
      loans.length > 0 ? ((approvalStats.approved / loans.length) * 100).toFixed(2) : 0;

    res.json({
      stats: approvalStats,
      loans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
