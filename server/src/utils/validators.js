import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional({ values: 'falsy' })
    .matches(/^\+?[0-9]{10,}$/)
    .withMessage('Phone must be at least 10 digits'),
];

export const validateCustomerRegister = [
  ...validateRegister,
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required for customer accounts')
    .matches(/^\+?[0-9]{10,}$/)
    .withMessage('Phone must be at least 10 digits'),
  body('role').not().exists().withMessage('Role cannot be specified during public registration'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateCustomer = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Customer status must be active or inactive'),
];

export const validateLeadSubmit = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').trim().notEmpty().matches(/^\+?[0-9]{10,}$/).withMessage('Valid phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('loanType').isIn(['personal', 'business', 'home', 'auto', 'education']).withMessage('Valid loan type is required'),
  body('requestedAmount').isNumeric().withMessage('Valid loan amount is required'),
  body('monthlyIncome').optional().isNumeric(),
  body('employmentType')
    .optional()
    .isIn(['employed', 'self-employed', 'unemployed', 'student', 'retired']),
];

export const validateLeadStatus = [
  body('status')
    .isIn(['new_lead', 'contacted', 'documents_requested', 'converted', 'rejected'])
    .withMessage('Invalid lead status'),
];

export const validateLoanApplication = [
  body('customer').notEmpty().withMessage('Customer ID is required'),
  body('loanType').isIn(['personal', 'business', 'home', 'auto', 'education']).withMessage('Valid loan type is required'),
  body('loanAmount').isNumeric().withMessage('Valid loan amount is required'),
  body('tenure').isNumeric().withMessage('Valid tenure is required'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arr = errors.array();
    return res.status(400).json({
      message: arr.map((e) => e.msg).join('. '),
      errors: arr,
    });
  }
  next();
};
