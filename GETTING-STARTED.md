# FinCore CRM - Getting Started

## Quick Start (3 Steps)

### 1️⃣ Run Setup Script

Double-click **`COMPLETE_SETUP.py`** or run in command prompt:

```bash
cd "C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
python COMPLETE_SETUP.py
```

This will create the entire directory structure and configuration files.

### 2️⃣ Install Dependencies

```bash
# Open two terminals

# Terminal 1 - Server
cd server
npm install

# Terminal 2 - Client (in separate terminal)
cd client
npm install
```

### 3️⃣ Configure MongoDB & Start

**Create files from examples:**
- Copy `server/.env.example` → `server/.env`
- Copy `client/.env.example` → `client/.env.local`
- Update MongoDB connection string in `server/.env`

**Start development:**
```bash
npm run dev
```

## 📁 Project Structure

```
FinCore  CRM/
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── config/           # Database, constants
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, error handling
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── utils/            # Helper functions
│   │   └── server.js         # Main server file
│   ├── package.json
│   └── .env                  # Create from .env.example
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API calls
│   │   ├── styles/           # Global styles
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── .env.local            # Create from .env.example
│
├── COMPLETE_SETUP.py         # ⭐ RUN THIS FIRST
├── generate_source.py        # Generate all source code
├── init.py                   # Alternative setup script
├── setup.bat                 # Windows batch setup
├── package.json              # Root monorepo config
├── README.md                 # Project overview
├── SETUP-GUIDE.md           # Detailed setup
└── SERVER-SETUP.md          # Backend config

```

## 🗄️ Database Models

The project includes these MongoDB models:

- **User** - Admin and employee accounts with JWT auth
- **Customer** - Client leads with KYC status
- **LoanApplication** - Loan requests with bank tracking
- **Bank** - Bank information and approval rates
- **Task** - Tasks and follow-ups assigned to employees
- **Document** - File uploads (KYC, income, etc.)

## 🔐 Authentication

JWT-based authentication with:
- Email/password login
- Role-based access (admin, employee)
- Automatic token refresh
- Secure password hashing with bcryptjs

## 🌐 API Endpoints (Planning)

**Auth:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
```

**Customers:**
```
GET    /api/customers          # List all
POST   /api/customers          # Create
GET    /api/customers/:id      # Get one
PUT    /api/customers/:id      # Update
DELETE /api/customers/:id      # Delete
```

**Loans:**
```
GET    /api/loans              # List
POST   /api/loans              # Create
GET    /api/loans/:id          # Get
PUT    /api/loans/:id          # Update
```

**Dashboard:**
```
GET    /api/dashboard/stats    # Analytics
GET    /api/dashboard/breakdown
```

And more for Banks, Tasks, Employees, Reports...

## 🎨 Frontend Pages (Planning)

1. **Login** - Authentication
2. **Dashboard** - Analytics & KPIs
3. **Leads** - Customer management
4. **Customer Details** - Individual profile
5. **Loans** - Application tracking
6. **Banks** - Approval status
7. **Tasks** - Reminders
8. **Employees** - Team management (admin)
9. **Reports** - Data analysis
10. **Settings** - Configuration

## 🚀 Development Commands

```bash
# Start both servers (from root)
npm run dev

# Or run separately
npm run dev:server    # Terminal 1
npm run dev:client    # Terminal 2

# Build for production
npm run build
npm run build:server
npm run build:client

# Install all dependencies
npm run install-all
```

## 📊 Technology Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Frontend | React 18 | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Context API | Global state |
| Routing | React Router 6 | Page navigation |
| Backend | Express.js | Web framework |
| Database | MongoDB | Document database |
| Auth | JWT | Token-based auth |
| Security | bcryptjs | Password hashing |
| Validation | express-validator | Input validation |
| File Upload | Multer | File handling |

## 🔧 Configuration Files

### Server Environment (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fincore
JWT_SECRET=secure_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Client Environment (`.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FinCore CRM
```

## ❓ FAQ

**Q: Can I use a different port?**
A: Yes, change `PORT` in `server/.env`

**Q: How to use MongoDB locally?**
A: Use `mongodb://localhost:27017/fincore` instead of Atlas

**Q: How to deploy?**
A: See deployment section in README.md

**Q: Do I need to install anything else?**
A: Just Node.js LTS and Python for setup scripts

## 📞 Support

If you encounter issues:
1. Check SETUP-GUIDE.md for troubleshooting
2. Verify MongoDB connection string
3. Ensure ports 5000 and 5173 are available
4. Clear node_modules and reinstall if needed

## ✅ Next Phase

After setup is complete, the project includes:
- ✅ Full backend API scaffolding
- ✅ React component structure
- ✅ Database models and relationships
- ✅ Authentication system
- ✅ Middleware and error handling

Ready to build the CRM! 🎉
