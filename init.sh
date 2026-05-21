#!/bin/bash

# Create directory structure
mkdir -p server/src/{models,routes,controllers,middleware,config,utils}
mkdir -p client/src/{components,pages,context,hooks,services,styles,assets}

# Create .env file for server
cat > server/.env.example << 'EOF'
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fincore
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
EOF

# Create .env file for client
cat > client/.env.example << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FinCore CRM
EOF

echo "Project structure created successfully!"
