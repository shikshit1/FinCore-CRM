import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import LoanApplication from '../models/LoanApplication.js';
import ActivityLog from '../models/ActivityLog.js';
import { LEAD_STATUSES, OPEN_LEAD_STATUSES } from '../config/leadStatuses.js';

const splitName = (fullName) => {
  const parts = String(fullName).trim().split(/\s+/);
  return {
    firstName: parts[0] || 'Lead',
    lastName: parts.slice(1).join(' ') || parts[0] || 'Customer',
  };
};

/** Public: submit loan interest / lead */
export const submitLead = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      city,
      employmentType,
      monthlyIncome,
      loanType,
      requestedAmount,
      notes,
    } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phone).trim();

    const duplicate = await Lead.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
      status: { $in: OPEN_LEAD_STATUSES },
    });

    if (duplicate) {
      return res.status(400).json({
        message:
          'We already have your interest on file. Our team will contact you shortly.',
      });
    }

    const lead = new Lead({
      fullName,
      phone: normalizedPhone,
      email: normalizedEmail,
      city,
      employmentType: employmentType || 'employed',
      monthlyIncome: Number(monthlyIncome) || 0,
      loanType,
      requestedAmount: Number(requestedAmount),
      notes,
      status: 'new_lead',
      source: 'website',
      timeline: [
        {
          action: 'submitted',
          status: 'new_lead',
          remarks: 'Lead submitted via public website',
          date: new Date(),
        },
      ],
    });

    await lead.save();

    res.status(201).json({
      message: 'Thank you! Your loan interest has been submitted. Our team will contact you soon.',
      leadId: lead._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    const stats = {
      total: await Lead.countDocuments(),
      new_lead: await Lead.countDocuments({ status: 'new_lead' }),
      contacted: await Lead.countDocuments({ status: 'contacted' }),
      documents_requested: await Lead.countDocuments({ status: 'documents_requested' }),
      converted: await Lead.countDocuments({ status: 'converted' }),
      rejected: await Lead.countDocuments({ status: 'rejected' }),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (status && status !== 'all' && LEAD_STATUSES.includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('convertedCustomer', 'firstName lastName email')
      .populate('convertedLoan', 'applicationNumber status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
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

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('convertedCustomer')
      .populate('convertedLoan');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid lead status' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (lead.status === 'converted') {
      return res.status(400).json({ message: 'Converted leads cannot change status' });
    }

    const previous = lead.status;
    lead.status = status;
    lead.updatedAt = new Date();
    lead.timeline.push({
      action: 'status_change',
      status,
      remarks: remarks || `Status changed from ${previous} to ${status}`,
      date: new Date(),
      updatedBy: req.user.userId,
    });

    await lead.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: `Lead status: ${status}`,
      entityType: 'Lead',
      entityId: lead._id,
      newValues: { status, remarks },
    });

    res.json({ message: 'Lead updated', lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addLeadNote = async (req, res) => {
  try {
    const { remarks } = req.body;
    if (!remarks?.trim()) {
      return res.status(400).json({ message: 'Note is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.timeline.push({
      action: 'note',
      status: lead.status,
      remarks: remarks.trim(),
      date: new Date(),
      updatedBy: req.user.userId,
    });
    lead.updatedAt = new Date();
    await lead.save();

    res.json({ message: 'Note added', lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Convert lead → customer + loan application */
export const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (lead.status === 'converted') {
      return res.status(400).json({ message: 'Lead already converted' });
    }

    const userId = req.user.userId;
    const { bank, tenure = 60, purpose } = req.body;
    const { firstName, lastName } = splitName(lead.fullName);

    let customer = await Customer.findOne({ email: lead.email });

    if (!customer) {
      customer = new Customer({
        firstName,
        lastName,
        email: lead.email,
        phone: lead.phone,
        status: 'active',
        leadSource: 'website',
        address: { city: lead.city },
        employment: {
          status: lead.employmentType,
          monthlyIncome: lead.monthlyIncome,
        },
        notes: lead.notes ? `Converted from lead: ${lead.notes}` : 'Converted from website lead',
      });
      await customer.save();
    }

    const loan = new LoanApplication({
      customer: customer._id,
      loanType: lead.loanType,
      loanAmount: lead.requestedAmount,
      tenure: parseInt(tenure) || 60,
      purpose: purpose || `Converted from lead — ${lead.loanType} loan`,
      bank: bank || undefined,
      status: 'pending',
      assignedEmployee: userId,
      timeline: [
        {
          action: 'created',
          status: 'pending',
          remarks: `Converted from lead ${lead._id}`,
          date: new Date(),
          updatedBy: userId,
        },
      ],
    });
    await loan.save();

    await Customer.findByIdAndUpdate(customer._id, {
      $push: { loanApplications: loan._id },
    });

    lead.status = 'converted';
    lead.convertedCustomer = customer._id;
    lead.convertedLoan = loan._id;
    lead.assignedTo = lead.assignedTo || userId;
    lead.updatedAt = new Date();
    lead.timeline.push({
      action: 'converted',
      status: 'converted',
      remarks: `Converted to customer ${customer._id} and loan ${loan.applicationNumber}`,
      date: new Date(),
      updatedBy: userId,
    });
    await lead.save();

    await ActivityLog.create({
      user: userId,
      action: 'Converted lead to loan application',
      entityType: 'Lead',
      entityId: lead._id,
      newValues: { customerId: customer._id, loanId: loan._id },
    });

    res.json({
      message: 'Lead converted successfully',
      lead,
      customer,
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
