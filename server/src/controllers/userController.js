import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import {
  STAFF_ROLES,
  ASSIGNABLE_EMPLOYEE_ROLES,
  isStaffRole,
} from '../config/roles.js';

const staffOnlyQuery = { role: { $in: STAFF_ROLES } };

export const getTeamUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true, ...staffOnlyQuery })
      .select('name email role')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const query = { ...staffOnlyQuery };

    if (role && STAFF_ROLES.includes(role)) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search?.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!isStaffRole(user.role)) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role: requestedRole } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (requestedRole === 'customer') {
      return res.status(400).json({
        message: 'Customer accounts must be created via public customer registration',
      });
    }

    if (requestedRole === 'admin') {
      return res.status(400).json({
        message: 'Admin accounts cannot be created from employee management',
      });
    }

    const role = ASSIGNABLE_EMPLOYEE_ROLES.includes(requestedRole) ? requestedRole : 'employee';

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone?.trim() || undefined,
      role,
      isActive: true,
    });

    await user.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Created employee',
      entityType: 'User',
      entityId: user._id,
    });

    res.status(201).json({
      message: 'Employee created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, phone, role, department } = req.body;

    const user = await User.findById(req.params.id);
    if (!user || !isStaffRole(user.role)) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin' && role && role !== 'admin') {
      return res.status(400).json({ message: 'Admin role cannot be changed from this screen' });
    }

    const updates = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone || undefined;
    if (department !== undefined) updates.department = department;

    if (role !== undefined && user.role !== 'admin') {
      if (role === 'customer' || role === 'admin') {
        return res.status(400).json({ message: 'Invalid role for employee account' });
      }
      if (ASSIGNABLE_EMPLOYEE_ROLES.includes(role)) {
        updates.role = role;
      }
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Updated employee',
      entityType: 'User',
      entityId: user._id,
    });

    res.json({
      message: 'Employee updated successfully',
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user || !isStaffRole(user.role)) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deactivated here' });
    }

    user.isActive = false;
    user.updatedAt = new Date();
    await user.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Deactivated employee',
      entityType: 'User',
      entityId: user._id,
    });

    res.json({ message: 'Employee deactivated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !isStaffRole(user.role)) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;
    user.updatedAt = new Date();
    await user.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Activated employee',
      entityType: 'User',
      entityId: user._id,
    });

    res.json({ message: 'Employee activated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user || !isStaffRole(user.role)) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    user.updatedAt = new Date();
    await user.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Reset employee password',
      entityType: 'User',
      entityId: user._id,
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
