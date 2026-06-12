import jwt from 'jsonwebtoken';

import User from '../models/User.js';

import Customer from '../models/Customer.js';

import { generateToken, generateRefreshToken } from '../utils/tokenUtils.js';

import { sendAuthError } from '../utils/authErrors.js';
import { isUserActive } from '../utils/userUtils.js';



const formatUserResponse = (user) => ({

  id: user._id,

  _id: user._id,

  name: user.name,

  email: user.email,

  role: user.role,

  phone: user.phone,

  avatar: user.avatar,

  customerProfile: user.customerProfile,

  isActive: isUserActive(user),

});



const normalizePhone = (phone) => {

  const value = typeof phone === 'string' ? phone.trim() : '';

  if (!value) return undefined;

  return /^\+?[0-9]{10,}$/.test(value) ? value : undefined;

};



/** Public employee signup is disabled — staff accounts are created by admins only. */

export const registerUser = async (req, res) => {

  return res.status(403).json({

    message:

      'Employee registration is not available publicly. Ask your administrator to create a CRM account, or register as a customer.',

  });

};



/** Public signup — role is always customer; any client-supplied role is ignored. */

export const registerCustomer = async (req, res) => {

  try {

    // Public clients cannot set role or staff fields
    delete req.body.role;
    delete req.body.customerProfile;
    delete req.body.isActive;

    const { name, email, password, phone } = req.body;

    const normalizedPhone = normalizePhone(phone);



    if (!normalizedPhone) {

      return res.status(400).json({ message: 'A valid phone number is required for customer accounts' });

    }



    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({ message: 'An account with this email already exists' });

    }



    const nameParts = name.trim().split(/\s+/);

    const firstName = nameParts[0];

    const lastName = nameParts.slice(1).join(' ') || nameParts[0];



    let customer = await Customer.findOne({ email });

    if (customer?.userAccount) {

      return res.status(400).json({ message: 'Customer portal account already exists for this email' });

    }



    if (!customer) {

      customer = new Customer({

        firstName,

        lastName,

        email,

        phone: normalizedPhone,

        status: 'active',

        leadSource: 'website',

      });

      await customer.save();

    } else {

      if (!customer.phone) customer.phone = normalizedPhone;

      if (customer.status !== 'active' && customer.status !== 'inactive') {

        customer.status = 'active';

      }

      await customer.save();

    }



    const user = new User({

      name,

      email,

      password,

      phone: normalizedPhone,

      role: 'customer',

      customerProfile: customer._id,

    });

    await user.save();



    customer.userAccount = user._id;

    await customer.save();



    const token = generateToken(user._id, 'customer', customer._id);

    const refreshToken = generateRefreshToken(user._id);



    res.status(201).json({

      message: 'Customer account created successfully',

      token,

      refreshToken,

      user: formatUserResponse(user),

    });

  } catch (error) {

    return sendAuthError(res, error, 'registerCustomer');

  }

};



export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;



    if (!email || !password) {

      return res.status(400).json({ message: 'Email and password are required' });

    }



    const normalizedEmail = String(email).trim().toLowerCase();

    // +password only — listing extra fields switches to inclusion mode and drops isActive
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {

      return res.status(401).json({ message: 'Invalid credentials' });

    }



    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {

      return res.status(401).json({ message: 'Invalid credentials' });

    }



    if (!isUserActive(user)) {

      if (process.env.NODE_ENV !== 'production') {

        console.warn('[auth] login blocked — inactive:', normalizedEmail, 'isActive=', user.isActive);

      }

      return res.status(403).json({ message: 'Account is deactivated' });

    }



    if (process.env.NODE_ENV !== 'production') {

      console.log('[auth] login ok:', { email: user.email, role: user.role, isActive: user.isActive });

    }



    user.lastLogin = new Date();

    await user.save();



    const customerId = user.role === 'customer' ? user.customerProfile : null;

    const token = generateToken(user._id, user.role, customerId);

    const refreshToken = generateRefreshToken(user._id);



    res.json({

      message: 'Login successful',

      token,

      refreshToken,

      user: formatUserResponse(user),

    });

  } catch (error) {

    return sendAuthError(res, error, 'loginUser');

  }

};



export const refreshAccessToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;



    if (!refreshToken) {

      return res.status(400).json({ message: 'Refresh token is required' });

    }



    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret');

    const user = await User.findById(decoded.userId).select('role customerProfile isActive');



    if (!user) {

      return res.status(401).json({ message: 'User not found' });

    }



    if (!isUserActive(user)) {

      return res.status(403).json({ message: 'Account is deactivated' });

    }



    const customerId = user.role === 'customer' ? user.customerProfile : null;

    const newToken = generateToken(user._id, user.role, customerId);



    res.json({

      message: 'Token refreshed successfully',

      token: newToken,

    });

  } catch (error) {

    res.status(401).json({ message: 'Invalid refresh token' });

  }

};



export const logoutUser = async (req, res) => {

  try {

    res.json({ message: 'Logout successful' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



export const getCurrentUser = async (req, res) => {

  try {

    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {

      return res.status(404).json({ message: 'User not found' });

    }

    res.json(formatUserResponse(user));

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


