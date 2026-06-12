import Customer from '../models/Customer.js';
import LoanApplication from '../models/LoanApplication.js';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

const CUSTOMER_STATUSES = ['active', 'inactive'];

const normalizeCustomerStatus = (status) =>
  CUSTOMER_STATUSES.includes(status) ? status : 'active';

export const getAllCustomers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all' && String(status).trim() !== '') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query)
      .populate('assignedTo', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    const normalizedCustomers = customers.map((c) => {
      const obj = c.toObject();
      obj.status = normalizeCustomerStatus(obj.status);
      return obj;
    });

    res.json({
      customers: normalizedCustomers,
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

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const loans = await LoanApplication.find({ customer: customer._id })
      .populate('bank', 'name code')
      .sort({ createdAt: -1 });

    const tasks = await Task.find({ relatedCustomer: customer._id })
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    const activeLoanCount = loans.filter(l =>
      ['pending', 'submitted', 'approved'].includes(l.status)
    ).length;
    const approvedLoanCount = loans.filter(l =>
      ['approved', 'disbursed', 'completed'].includes(l.status)
    ).length;
    const pendingLoanCount = loans.filter(l =>
      ['pending', 'submitted'].includes(l.status)
    ).length;

    res.json({
      ...customer.toObject(),
      loans,
      tasks,
      activeLoanCount,
      approvedLoanCount,
      pendingLoanCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = new Customer({
      ...req.body,
      status: normalizeCustomerStatus(req.body.status),
    });
    await customer.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Created customer',
      entityType: 'Customer',
      entityId: customer._id,
      newValues: customer.toObject(),
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date() };
    if (req.body.status !== undefined) {
      updates.status = normalizeCustomerStatus(req.body.status);
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Updated customer',
      entityType: 'Customer',
      entityId: customer._id,
      newValues: req.body,
    });

    res.json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Deleted customer',
      entityType: 'Customer',
      entityId: customer._id,
    });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
