# FinCore CRM - Modern Finance Direct Selling Agency CRM

A full-stack CRM application built with React, Express.js, and MongoDB for managing customers, loan applications, and bank approvals in a finance direct selling agency.

## 🚀 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Mongoose, JWT
- **Database**: MongoDB Atlas
- **Authentication**: JWT with role-based access control

## 📋 Features

### Core Features
- ✅ JWT-based authentication (Email/Password)
- ✅ Role-based access control (Admin, Employee)
- ✅ Customer/Lead management
- ✅ Loan application tracking
- ✅ Bank approval status tracking
- ✅ Dashboard analytics and KPIs

### Additional Features
- ✅ Employee management (Admin)
- ✅ Task and follow-up reminders
- ✅ Document upload and management
- ✅ Advanced search and filtering
- ✅ Reports and data export
- ✅ Activity logging
- ✅ Responsive modern UI

## 📄 Pages

1. **Login** - User authentication
2. **Dashboard** - Analytics and KPIs
3. **Leads** - Customer/lead management
4. **Customer Details** - Individual customer profile
5. **Loan Applications** - Loan tracking and status
6. **Banks** - Bank management and approvals
7. **Tasks** - Task and reminder management
8. **Employees** - Team management (Admin)
9. **Reports** - Data analysis and export
10. **Settings** - User and application settings

## 📁 Project Structure

```text
fincore-crm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express app setup
│   ├── .env.example
│   └── package.json
│
├── README.md
└── package.json            # Monorepo root
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Setup Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd fincore-crm
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**

**Server (.env)**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fincore
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Client (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

This will start both the Express server (port 5000) and React dev server (port 5173) concurrently.

## 🔐 Authentication

- Email/password based login
- JWT tokens with refresh mechanism
- Role-based access control (Admin, Employee)
- Secure password hashing with bcryptjs

## 📊 Database Models

- **User** - Employee/Admin user accounts
- **Customer** - Customer/lead information
- **LoanApplication** - Loan application tracking
- **Bank** - Bank information and approvals
- **Task** - Tasks and reminders
- **Document** - Uploaded documents
- **ActivityLog** - User activity tracking

## 🚀 Deployment

### Backend
- Deploy to render
- Set MongoDB Atlas connection string in environment
- Configure CORS for frontend domain

### Frontend
- Deploy to render
- Set API URL to backend deployment
- Enable automatic deployments from main branch

## 📝 License

MIT

## 👥 Contributors

Built with ❤️ for modern CRM systems
