# FinCore CRM - Automated Setup Execution Guide

## 🎯 Three-Step Automated Setup

This guide will walk you through setting up the entire FinCore CRM project automatically.

---

## Step 1: Run Complete Setup Script

**What it does:**
- Creates directory structure (server, client, and all subdirectories)
- Generates package.json files for server and client
- Creates environment variable templates (.env.example)
- Sets up root package.json for monorepo

**How to run:**

**Option A: Double-click (Easiest)**
```
Double-click: COMPLETE_SETUP.py
```

**Option B: Command prompt**
```bash
cd "C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
python COMPLETE_SETUP.py
```

**Expected output:**
```
============================================================
  🚀 FinCore CRM - Complete Project Setup
============================================================

📁 Creating project structure...
  ✓ server/src/models
  ✓ server/src/routes
  ... (more directories)
  
📦 Creating configuration files...
  ✓ server/package.json
  ✓ client/package.json
  
🔧 Creating environment files...
  ✓ server/.env.example
  ✓ client/.env.example

============================================================
  ✅ Project structure created successfully!
============================================================
```

---

## Step 2: Generate All Source Files

**What it does:**
- Creates all Express.js server files
- Sets up MongoDB models
- Generates middleware and utilities
- Creates authentication system
- Sets up error handling

**How to run:**

```bash
cd "C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
python generate_all_source.py
```

**Expected output:**
```
======================================================================
 🚀 FinCore CRM - Full Source Code Generator
======================================================================

📝 Generating server source code...

  ✓ server/src/server.js
  ✓ server/src/config/database.js
  ✓ server/src/config/constants.js
  ✓ server/src/middleware/auth.js
  ✓ server/src/middleware/errorHandler.js
  ✓ server/src/utils/tokenUtils.js
  ✓ server/src/utils/validators.js
  ✓ User.js
  ✓ Customer.js
  ✓ LoanApplication.js
  ✓ Bank.js
  ✓ Task.js
  ✓ Document.js
  ✓ ActivityLog.js

✅ Generated 20 server files!
```

---

## Step 3: Install Dependencies & Configure

### 3a: Create Environment Files

**Server Configuration:**
1. Open `server/.env.example`
2. Copy all content
3. Create new file: `server/.env`
4. Paste content
5. Update MongoDB connection:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/fincore
JWT_SECRET=YourSuperSecureSecretKeyHere_ChangeInProduction_Min32Chars!
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

**Client Configuration:**
1. Open `client/.env.example`
2. Copy all content
3. Create new file: `client/.env.local`
4. Paste content

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FinCore CRM
```

### 3b: Install Node Packages

**Terminal 1 - Install Server Dependencies:**
```bash
cd server
npm install
```

**Terminal 2 - Install Client Dependencies:**
```bash
cd client
npm install
```

**From Root - Install Development Tools:**
```bash
npm install
```

---

## Step 4: Start Development

### Option A: Start Both Servers Together
```bash
cd "C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
npm run dev
```

### Option B: Start Separately (Recommended for debugging)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Should show:
```
Server running on port 5000
MongoDB connected: cluster0.xxxxx.mongodb.net
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Should show:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## ✅ Verify Everything Works

### Backend Health Check
Open browser and visit:
```
http://localhost:5000/api/health
```

Should respond with:
```json
{
  "status": "ok",
  "message": "FinCore CRM API is running"
}
```

### Frontend
Open browser and visit:
```
http://localhost:5173/
```

Should show React app running (basic App component)

---

## 📊 Project Structure Created

```
FinCore  CRM/
│
├── 📁 server/
│   ├── 📁 src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Customer.js
│   │   │   ├── LoanApplication.js
│   │   │   ├── Bank.js
│   │   │   ├── Task.js
│   │   │   ├── Document.js
│   │   │   └── ActivityLog.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── utils/
│   │   │   ├── tokenUtils.js
│   │   │   └── validators.js
│   │   └── server.js
│   ├── package.json
│   ├── .env (create from .env.example)
│   └── node_modules/
│
├── 📁 client/
│   ├── 📁 src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── .env.local (create from .env.example)
│   ├── vite.config.js
│   └── node_modules/
│
├── package.json
├── README.md
├── SETUP-GUIDE.md
└── Documentation files
```

---

## 🔧 MongoDB Atlas Setup (If Not Already Done)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create new project (or use existing)
4. Create a cluster:
   - Choose free tier (M0)
   - Select region closest to you
   - Click "Create Cluster"
5. Wait for cluster to be created (5-10 minutes)
6. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `fincore_user`
   - Password: (generate strong password, save it!)
7. Allow network access:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere"
8. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy MongoDB URI: `mongodb+srv://username:password@cluster.mongodb.net/...`
   - Replace `<username>` and `<password>` with your database user credentials
9. Paste into `server/.env` as `MONGODB_URI`

---

## 📝 Environment Variables Reference

### server/.env
| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Backend server port |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | Random string | Secret key for JWT tokens |
| `JWT_EXPIRE` | 7d | Access token expiration |
| `JWT_REFRESH_EXPIRE` | 30d | Refresh token expiration |
| `NODE_ENV` | development | Environment mode |
| `FRONTEND_URL` | http://localhost:5173 | Frontend address (for CORS) |

### client/.env.local
| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:5000/api | Backend API address |
| `VITE_APP_NAME` | FinCore CRM | Application name |

---

## ⚠️ Troubleshooting

### npm: command not found
**Solution:** Install Node.js from https://nodejs.org/
- Download LTS version
- Run installer
- Restart command prompt/terminal

### Port already in use (Error: EADDRINUSE)
**Solution:** Change PORT in server/.env
```env
PORT=5001
```

### MongoDB connection error
**Solutions:**
- Verify MONGODB_URI in .env is correct
- Check IP is whitelisted in MongoDB Atlas
- Ensure password doesn't have special characters, or URL-encode them
- Test connection at https://www.mongodb.com/atlas

### npm install fails
**Solution:**
```bash
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

### Can't connect to localhost:5000 or 5173
- Make sure both servers are running
- Check firewall isn't blocking ports
- Use correct URLs: http:// not https://

---

## 🎉 You're Done!

Your FinCore CRM project is now:
- ✅ Fully configured
- ✅ Connected to MongoDB
- ✅ Ready for development
- ✅ Has all models and middleware
- ✅ Has Express server running
- ✅ Has React frontend running

## 🚀 Next Phase: Building Features

The next phase will include:
- Creating all API endpoints
- Building React pages
- Implementing authentication flows
- Adding dashboard analytics
- Creating customer management system
- Building loan tracking system
- Adding employee management
- And much more!

---

## 📞 Quick Reference

**Start development:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Backend only:**
```bash
cd server && npm run dev
```

**Frontend only:**
```bash
cd client && npm run dev
```

**View project structure:**
```bash
tree /L 3
```

---

**Happy coding! 🚀**
