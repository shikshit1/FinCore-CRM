export const LOAN_PRODUCTS = [
  {
    id: 'personal',
    title: 'Personal Loan',
    rate: '10.5%',
    maxAmount: '₹25 Lakh',
    approvalTime: '24–48 hrs',
    description: 'Flexible funds for medical, travel, wedding, or any personal need.',
    tenure: '12–60 months',
    processingFee: '1% + GST',
  },
  {
    id: 'home',
    title: 'Home Loan',
    rate: '8.4%',
    maxAmount: '₹2 Crore',
    approvalTime: '5–7 days',
    description: 'Competitive rates for purchase, construction, or balance transfer.',
    tenure: 'Up to 30 years',
    processingFee: '0.5% + GST',
  },
  {
    id: 'business',
    title: 'Business Loan',
    rate: '11.2%',
    maxAmount: '₹50 Lakh',
    approvalTime: '3–5 days',
    description: 'Working capital and expansion funding for SMEs and startups.',
    tenure: '12–84 months',
    processingFee: '1.5% + GST',
  },
  {
    id: 'education',
    title: 'Education Loan',
    rate: '9.1%',
    maxAmount: '₹40 Lakh',
    approvalTime: '4–6 days',
    description: 'Domestic and international studies with moratorium options.',
    tenure: 'Up to 15 years',
    processingFee: '1% + GST',
  },
  {
    id: 'auto',
    title: 'Auto Loan',
    rate: '9.5%',
    maxAmount: '₹15 Lakh',
    approvalTime: '2–3 days',
    description: 'New or pre-owned vehicles with quick disbursal partners.',
    tenure: '12–84 months',
    processingFee: '₹2,999 flat',
  },
];

export const WHY_CHOOSE = [
  { title: 'Fast Approval', desc: 'Digital-first processing with same-day decisions on eligible profiles.' },
  { title: 'Low Interest Rates', desc: 'Partner bank rates starting from 8.4% APR on select products.' },
  { title: 'Trusted Banking Partners', desc: '15+ RBI-regulated lenders in our network.' },
  { title: 'Secure Process', desc: '256-bit encryption and KYC-compliant data handling.' },
  { title: 'Minimal Documentation', desc: 'Paperless upload for salaried and self-employed applicants.' },
  { title: '24/7 Support', desc: 'Dedicated relationship managers and WhatsApp status updates.' },
];

export const PROCESS_STEPS = [
  { step: 1, title: 'Apply Online', desc: 'Submit interest form in under 3 minutes.' },
  { step: 2, title: 'Upload Documents', desc: 'Our team guides you on KYC and income proofs.' },
  { step: 3, title: 'Bank Verification', desc: 'Lender underwriting and bureau checks.' },
  { step: 4, title: 'Loan Approval', desc: 'Sanction letter and final terms shared.' },
  { step: 5, title: 'Amount Disbursed', desc: 'Funds credited to your account.' },
];

export const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', text: 'FinCore helped me get a home loan approved in a week. Transparent process and great support.', loan: 'Home Loan' },
  { name: 'Rahul Mehta', city: 'Ahmedabad', text: 'Business loan for my clinic was smooth. They handled all bank coordination.', loan: 'Business Loan' },
  { name: 'Ananya Reddy', city: 'Hyderabad', text: 'Education loan for my MS abroad — clear EMI breakdown and timely updates.', loan: 'Education Loan' },
];

export const PLATFORM_STATS = [
  { label: 'Total Customers', value: 12500, suffix: '+' },
  { label: 'Loans Approved', value: 8400, suffix: '+' },
  { label: 'Partner Banks', value: 15, suffix: '' },
  { label: 'Amount Disbursed', value: 320, suffix: ' Cr+' },
];

export const EMI_EXAMPLES = [
  { amount: 500000, tenure: 36, rate: 10.5, emi: 16250 },
  { amount: 2500000, tenure: 240, rate: 8.4, emi: 21580 },
  { amount: 1000000, tenure: 60, rate: 11.2, emi: 21800 },
];
