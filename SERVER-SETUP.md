# Server Setup Instructions

## Environment Variables

Create a `.env` file in the server directory with:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fincore
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create database user with credentials
4. Whitelist your IP address
5. Get connection string from "Connect" button
6. Add credentials to MONGODB_URI in .env

## Installation

```bash
cd server
npm install
```

## Running

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Build
npm run build
```

## Database Indexes

The API will automatically create indexes on:
- User.email (unique)
- Customer.phone, email (for quick lookup)
- LoanApplication.customerId, status
- Task.assignedTo, dueDate
