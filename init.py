import os
import json
from pathlib import Path

# Define directory structure
dirs = [
    "server/src/models",
    "server/src/routes",
    "server/src/controllers",
    "server/src/middleware",
    "server/src/config",
    "server/src/utils",
    "server/src/scripts",
    "client/src/components",
    "client/src/pages",
    "client/src/context",
    "client/src/hooks",
    "client/src/services",
    "client/src/styles",
    "client/src/assets",
]

# Create base directory
base_dir = r"C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
os.chdir(base_dir)

# Create directories
for dir_path in dirs:
    Path(dir_path).mkdir(parents=True, exist_ok=True)
    print(f"✓ Created: {dir_path}")

# Create server package.json
server_package = {
    "name": "fincore-crm-server",
    "version": "1.0.0",
    "description": "Express backend for FinCore CRM",
    "main": "src/server.js",
    "type": "module",
    "scripts": {
        "dev": "nodemon src/server.js",
        "start": "node src/server.js",
        "build": "echo 'Server does not require build step'",
        "test": "jest --coverage",
        "lint": "eslint src/"
    },
    "dependencies": {
        "express": "^4.18.2",
        "mongoose": "^7.5.0",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2",
        "dotenv": "^16.3.1",
        "cors": "^2.8.5",
        "express-validator": "^7.0.0",
        "multer": "^1.4.5-lts.1"
    },
    "devDependencies": {
        "nodemon": "^3.0.1",
        "eslint": "^8.49.0"
    }
}

with open("server/package.json", "w") as f:
    json.dump(server_package, f, indent=2)
    print("✓ Created: server/package.json")

# Create client package.json
client_package = {
    "name": "fincore-crm-client",
    "version": "1.0.0",
    "description": "React frontend for FinCore CRM",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "lint": "eslint src/"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.15.0",
        "axios": "^1.5.0",
        "date-fns": "^2.30.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.3",
        "vite": "^4.4.9",
        "tailwindcss": "^3.3.3",
        "postcss": "^8.4.29",
        "autoprefixer": "^10.4.15",
        "eslint": "^8.49.0",
        "eslint-plugin-react": "^7.32.2"
    }
}

with open("client/package.json", "w") as f:
    json.dump(client_package, f, indent=2)
    print("✓ Created: client/package.json")

# Create .env files
env_server = """PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fincore
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760"""

with open("server/.env.example", "w") as f:
    f.write(env_server)
    print("✓ Created: server/.env.example")

env_client = """VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FinCore CRM"""

with open("client/.env.example", "w") as f:
    f.write(env_client)
    print("✓ Created: client/.env.example")

print("\n✅ Project structure initialized successfully!")
print("\nNext steps:")
print("1. cd server && npm install")
print("2. cd ../client && npm install")
print("3. Configure MongoDB Atlas and update .env files")
print("4. npm run dev (from root directory)")
