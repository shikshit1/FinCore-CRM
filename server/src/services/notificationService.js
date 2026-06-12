import LoanNotification from '../models/LoanNotification.js';
import { WHATSAPP_NOTIFY_STATUSES } from '../config/loanStatuses.js';
import { sendWhatsAppMessage } from './whatsappService.js';

const buildLoanStatusMessage = (status, { customerName, applicationNumber, loanAmount, bankName, rejectionReason }) => {
  const name = customerName || 'Customer';
  const appRef = applicationNumber ? ` (${applicationNumber})` : '';
  const amountStr = loanAmount ? ` Amount: ₹${Number(loanAmount).toLocaleString('en-IN')}.` : '';

  const templates = {
    approved: `Congratulations ${name}! Your loan application${appRef} has been approved.${amountStr} — FinCore CRM`,
    rejected: `Dear ${name}, unfortunately your loan application${appRef} was rejected.${rejectionReason ? ` Reason: ${rejectionReason}.` : ''} Contact us for assistance. — FinCore CRM`,
    documents_pending: `Dear ${name}, please upload pending documents for your loan application${appRef} to continue processing.${bankName ? ` Bank: ${bankName}.` : ''} — FinCore CRM`,
    disbursed: `Dear ${name}, great news! Your loan${appRef} has been disbursed.${amountStr} Thank you for choosing us. — FinCore CRM`,
  };

  return templates[status] || `Dear ${name}, your loan application${appRef} status is now: ${status}. — FinCore CRM`;
};

export const shouldNotifyCustomer = (status) => WHATSAPP_NOTIFY_STATUSES.includes(status);

export const sendLoanStatusWhatsApp = async ({
  loan,
  customer,
  newStatus,
  sentByUserId,
  rejectionReason,
}) => {
  if (!shouldNotifyCustomer(newStatus)) {
    return { skipped: true, reason: 'Status does not trigger WhatsApp' };
  }

  const phone = customer?.phone || customer?.alternatePhone;
  const customerName = customer
    ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
    : 'Customer';

  const message = buildLoanStatusMessage(newStatus, {
    customerName,
    applicationNumber: loan.applicationNumber,
    loanAmount: loan.loanAmount,
    bankName: loan.bank?.name,
    rejectionReason: rejectionReason || loan.rejectionReason,
  });

  const sendResult = await sendWhatsAppMessage(phone, message);

  const notification = await LoanNotification.create({
    loan: loan._id,
    customer: customer?._id,
    phone,
    status: newStatus,
    message,
    provider: sendResult.provider || 'none',
    success: sendResult.success,
    externalId: sendResult.externalId,
    error: sendResult.error,
    sentBy: sentByUserId,
  });

  return {
    notification,
    whatsapp: sendResult,
  };
};
