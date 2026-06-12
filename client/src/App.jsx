import Banks from './pages/Banks';

import Reports from './pages/Reports';

import Settings from './pages/Settings';

import CallTracking from './pages/CallTracking';

import CustomerDetails from './pages/CustomerDetails';



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import StaffProtectedRoute from './components/StaffProtectedRoute';

import CustomerProtectedRoute from './components/CustomerProtectedRoute';

import GuestOnlyRoute from './components/GuestOnlyRoute';

import HomeRedirect from './components/HomeRedirect';



import Home from './pages/public/Home';

import ApplyLoan from './pages/public/ApplyLoan';

import Login from './pages/Login';

import Register from './pages/Register';

import Dashboard from './pages/Dashboard';

import Customers from './pages/Customers';

import Leads from './pages/Leads';

import LeadDetails from './pages/LeadDetails';

import Loans from './pages/Loans';

import LoanDetails from './pages/LoanDetails';

import Tasks from './pages/Tasks';

import Employees from './pages/Employees';

import AdminProtectedRoute from './components/AdminProtectedRoute';



import CustomerDashboard from './pages/portal/CustomerDashboard';

import CustomerLoans from './pages/portal/CustomerLoans';

import CustomerLoanDetail from './pages/portal/CustomerLoanDetail';

import CustomerProfile from './pages/portal/CustomerProfile';

import CustomerDocuments from './pages/portal/CustomerDocuments';



function App() {

  return (

    <Router>

      <AuthProvider>

        <Routes>

          {/* Public website */}

          <Route path="/" element={<Home />} />

          <Route path="/apply" element={<ApplyLoan />} />



          <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />

          <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />



          {/* Employee CRM */}

          <Route path="/dashboard" element={<StaffProtectedRoute><Dashboard /></StaffProtectedRoute>} />

          <Route path="/leads" element={<StaffProtectedRoute><Leads /></StaffProtectedRoute>} />

          <Route path="/leads/:id" element={<StaffProtectedRoute><LeadDetails /></StaffProtectedRoute>} />

          <Route path="/customers" element={<StaffProtectedRoute><Customers /></StaffProtectedRoute>} />

          <Route path="/customers/:id" element={<StaffProtectedRoute><CustomerDetails /></StaffProtectedRoute>} />

          <Route path="/loans" element={<StaffProtectedRoute><Loans /></StaffProtectedRoute>} />

          <Route path="/loans/:id" element={<StaffProtectedRoute><LoanDetails /></StaffProtectedRoute>} />

          <Route path="/loans/new" element={<StaffProtectedRoute><Loans /></StaffProtectedRoute>} />

          <Route path="/tasks" element={<StaffProtectedRoute><Tasks /></StaffProtectedRoute>} />

          <Route path="/tasks/:id" element={<StaffProtectedRoute><Tasks /></StaffProtectedRoute>} />

          <Route path="/tasks/new" element={<StaffProtectedRoute><Tasks /></StaffProtectedRoute>} />

          <Route path="/banks" element={<StaffProtectedRoute><Banks /></StaffProtectedRoute>} />

          <Route path="/banks/:id" element={<StaffProtectedRoute><Banks /></StaffProtectedRoute>} />

          <Route path="/reports" element={<StaffProtectedRoute><Reports /></StaffProtectedRoute>} />

          <Route path="/employees" element={<AdminProtectedRoute><Employees /></AdminProtectedRoute>} />

          <Route path="/settings" element={<StaffProtectedRoute><Settings /></StaffProtectedRoute>} />

          <Route path="/call-tracking" element={<StaffProtectedRoute><CallTracking /></StaffProtectedRoute>} />



          {/* Customer Portal */}

          <Route path="/customer/dashboard" element={<CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>} />

          <Route path="/customer/loans" element={<CustomerProtectedRoute><CustomerLoans /></CustomerProtectedRoute>} />

          <Route path="/customer/loans/:id" element={<CustomerProtectedRoute><CustomerLoanDetail /></CustomerProtectedRoute>} />

          <Route path="/customer/profile" element={<CustomerProtectedRoute><CustomerProfile /></CustomerProtectedRoute>} />

          <Route path="/customer/documents" element={<CustomerProtectedRoute><CustomerDocuments /></CustomerProtectedRoute>} />



          <Route path="/home" element={<HomeRedirect />} />

          <Route path="*" element={<HomeRedirect />} />

        </Routes>

      </AuthProvider>

    </Router>

  );

}



export default App;


