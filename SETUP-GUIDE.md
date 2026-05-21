# FinCore CRM - Complete Setup Guide

## ⚠️ Initial Setup Required

Due to system limitations, you need to run the initialization script first to create the project directory structure.

### Step 1: Create Project Structure

**Option A: Using Python (Recommended)**
```bash
cd "C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
python full_setup.py
```

**Option B: Using Batch File**
```batch
cd "C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
setup.bat
```

**Option C: Manual (if others don't work)**
```bash
cd server
npm init -y
cd ../client  
npm init -y
```

### Step 2: Install Dependencies

After directories are created:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install

# Install root dependencies
cd ..
npm install concurrently --save-dev
```

### Step 3: Configure MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and new project
3. Create a cluster (M0 free tier works for development)
4. Create database user with password
5. Get connection string
6. Create `server/.env` file with your connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fincore
JWT_SECRET=your_very_secure_secret_key_here_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

7. Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FinCore CRM
```

### Step 4: Start Development

```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 5173) concurrently.

## Project Structure After Setup

```
FinCore  CRM/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── .env (create from .env.example)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── App.jsx
│   ├── main.jsx
│   ├── package.json
│   └── .env.local
│
├── package.json (root)
├── README.md
├── .gitignore
└── initialization scripts
```

## Next: Source Code Implementation

Once the directory structure is created and dependencies are installed, all the API endpoints, React components, and database models will be implemented in the next phase.

The implementation includes:
- ✅ Express.js API with Mongoose
- ✅ JWT authentication
- ✅ React pages and components
- ✅ Tailwind CSS styling
- ✅ API service layer
- ✅ State management with Context API
- ✅ All 10 pages of the CRM

## Troubleshooting

### npm: command not found
Install Node.js from https://nodejs.org/ (LTS version recommended)

### MongoDB connection error  
- Check MONGODB_URI in .env is correct
- Verify MongoDB Atlas IP whitelist includes your machine IP
- Ensure database user password doesn't contain special characters that need escaping

### Port already in use
- Change PORT in server/.env to another port (e.g., 5001)
- Check what's using ports 5000/5173 with: `netstat -ano | findstr :5000`

### npm install fails
- Delete node_modules folder and package-lock.json
- Clear npm cache: `npm cache clean --force`
- Try again: `npm install`
