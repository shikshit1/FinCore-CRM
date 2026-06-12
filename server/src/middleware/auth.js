import jwt from 'jsonwebtoken';

import User from '../models/User.js';

import { isStaffRole } from '../config/roles.js';
import { isUserActive } from '../utils/userUtils.js';



export const authenticateToken = async (req, res, next) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];



  if (!token) {

    return res.status(401).json({ message: 'Access token required' });

  }



  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const user = await User.findById(decoded.userId).select('role isActive customerProfile');



    if (!user) {

      return res.status(401).json({ message: 'User not found' });

    }



    if (!isUserActive(user)) {

      return res.status(403).json({ message: 'Account is deactivated' });

    }



    if (decoded.role && user.role !== decoded.role) {

      return res.status(403).json({ message: 'Session expired. Please sign in again.' });

    }



    req.user = {

      userId: user._id.toString(),

      role: user.role,

      customerId:

        decoded.customerId?.toString() ||

        (user.role === 'customer' ? user.customerProfile?.toString() : undefined),

    };

    next();

  } catch (error) {

    if (error.name === 'TokenExpiredError') {

      return res.status(401).json({ message: 'Token expired' });

    }

    return res.status(403).json({ message: 'Invalid or expired token' });

  }

};



export const authorize = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({ message: 'User not authenticated' });

    }

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({ message: 'Insufficient permissions' });

    }

    next();

  };

};



/** Blocks customer role from employee CRM APIs */

export const authorizeStaff = (req, res, next) => {

  if (!req.user) {

    return res.status(401).json({ message: 'User not authenticated' });

  }

  if (!isStaffRole(req.user.role)) {

    return res.status(403).json({ message: 'Employee access only' });

  }

  next();

};



/** Only customer portal users */

export const authorizeCustomer = (req, res, next) => {

  if (!req.user) {

    return res.status(401).json({ message: 'User not authenticated' });

  }

  if (req.user.role !== 'customer') {

    return res.status(403).json({ message: 'Customer portal access only' });

  }

  next();

};



/** Attach req.customerId for portal routes */

export const attachCustomerProfile = async (req, res, next) => {

  try {

    let customerId = req.user.customerId;



    if (!customerId) {

      const user = await User.findById(req.user.userId).select('customerProfile role');

      if (!user?.customerProfile) {

        return res.status(403).json({ message: 'No customer profile linked to this account' });

      }

      customerId = user.customerProfile.toString();

    }



    req.customerId = customerId;

    next();

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


