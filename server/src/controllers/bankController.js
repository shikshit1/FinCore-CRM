import Bank from '../models/Bank.js';
import LoanApplication from '../models/LoanApplication.js';

const formatDuplicateError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'name';
    if (field === 'name') {
      return 'A bank with this name already exists. Please use a different name.';
    }
    return `This ${field} is already in use. Please choose a different value.`;
  }
  return error.message;
};

const computeBankStats = (loans) => {
  const approved = loans.filter(l => ['approved', 'disbursed', 'completed'].includes(l.status)).length;
  const rejected = loans.filter(l => l.status === 'rejected').length;
  const pending = loans.filter(l =>
    ['pending', 'submitted', 'under_review', 'documents_pending'].includes(l.status)
  ).length;
  const totalAmountDisbursed = loans
    .filter(l => ['approved', 'disbursed', 'completed'].includes(l.status))
    .reduce((sum, l) => sum + (l.loanAmount || 0), 0);
  const decided = approved + rejected;
  const approvalRatio = decided > 0 ? Math.round((approved / decided) * 100) : 0;

  return {
    totalLoans: loans.length,
    approvedLoans: approved,
    rejectedLoans: rejected,
    pendingLoans: pending,
    totalAmountDisbursed,
    approvalRatio,
  };
};

export const getAllBanks = async (req, res) => {
  try {
    const banks = await Bank.find({ isActive: true }).sort({ name: 1 });
    const bankIds = banks.map(b => b._id);

    const loanCounts = await LoanApplication.aggregate([
      { $match: { bank: { $in: bankIds } } },
      {
        $group: {
          _id: '$bank',
          totalLoans: { $sum: 1 },
          approvedLoans: {
            $sum: {
              $cond: [{ $in: ['$status', ['approved', 'disbursed', 'completed']] }, 1, 0],
            },
          },
          rejectedLoans: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
          },
          pendingLoans: {
            $sum: {
              $cond: [
                { $in: ['$status', ['pending', 'submitted', 'under_review', 'documents_pending']] },
                1,
                0,
              ],
            },
          },
          totalAmountDisbursed: {
            $sum: {
              $cond: [
                { $in: ['$status', ['approved', 'disbursed', 'completed']] },
                '$loanAmount',
                0,
              ],
            },
          },
        },
      },
    ]);

    const statsMap = Object.fromEntries(loanCounts.map(s => [s._id.toString(), s]));

    const banksWithStats = banks.map(bank => {
      const stats = statsMap[bank._id.toString()] || {};
      const approved = stats.approvedLoans || 0;
      const rejected = stats.rejectedLoans || 0;
      const decided = approved + rejected;
      return {
        ...bank.toObject(),
        analytics: {
          totalLoans: stats.totalLoans || 0,
          approvedLoans: approved,
          rejectedLoans: rejected,
          pendingLoans: stats.pendingLoans || 0,
          totalAmountDisbursed: stats.totalAmountDisbursed || 0,
          approvalRatio: decided > 0 ? Math.round((approved / decided) * 100) : 0,
        },
      };
    });

    res.json(banksWithStats);
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

    const loans = await LoanApplication.find({ bank: bank._id })
      .populate('customer', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      bank,
      analytics: computeBankStats(loans),
      loans,
    });
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
    const message = formatDuplicateError(error);
    const status = error.code === 11000 ? 400 : 500;
    res.status(status).json({ message });
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
    const message = formatDuplicateError(error);
    const status = error.code === 11000 ? 400 : 500;
    res.status(status).json({ message });
  }
};

export const getBankApprovals = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ bank: req.params.id })
      .populate('customer', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      stats: computeBankStats(loans),
      loans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBanksAnalytics = async (req, res) => {
  try {
    const banks = await Bank.find({ isActive: true });
    const allLoans = await LoanApplication.find({ bank: { $ne: null } }).populate('bank', 'name');

    const overall = computeBankStats(allLoans);

    const byBank = banks.map(bank => {
      const bankLoans = allLoans.filter(l => l.bank?._id?.toString() === bank._id.toString() || l.bank?.toString() === bank._id.toString());
      return {
        bankId: bank._id,
        bankName: bank.name,
        ...computeBankStats(bankLoans),
      };
    });

    res.json({ overall, byBank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
