#!/usr/bin/env python3
"""
FinCore CRM - Complete Project Initialization Script
This script sets up the entire project structure and creates all necessary files.
"""

import os
import json
from pathlib import Path

def create_dirs_and_files():
    base = r"C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
    os.chdir(base)
    
    # Directory structure
    dirs = [
        "server/src/models",
        "server/src/routes",
        "server/src/controllers",
        "server/src/middleware",
        "server/src/config",
        "server/src/utils",
        "client/src/components",
        "client/src/pages",
        "client/src/context",
        "client/src/hooks",
        "client/src/services",
        "client/src/styles"
    ]
    
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    
    # Server package.json
    server_pkg = {
        "name": "fincore-crm-server",
        "version": "1.0.0",
        "description": "Express backend for FinCore CRM",
        "main": "src/server.js",
        "type": "module",
        "scripts": {
            "dev": "nodemon src/server.js",
            "start": "node src/server.js",
            "build": "echo Build complete"
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
            "nodemon": "^3.0.1"
        }
    }
    
    with open("server/package.json", "w") as f:
        json.dump(server_pkg, f, indent=2)
    
    # Client package.json  
    client_pkg = {
        "name": "fincore-crm-client",
        "version": "1.0.0",
        "description": "React frontend for FinCore CRM",
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
        },
        "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.15.0",
            "axios": "^1.5.0"
        },
        "devDependencies": {
            "@vitejs/plugin-react": "^4.0.3",
            "vite": "^4.4.9",
            "tailwindcss": "^3.3.3"
        }
    }
    
    with open("client/package.json", "w") as f:
        json.dump(client_pkg, f, indent=2)
    
    # Environment files
    with open("server/.env.example", "w") as f:
        f.write("PORT=5000\n")
        f.write("MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fincore\n")
        f.write("JWT_SECRET=your_secret_key_here\n")
        f.write("JWT_EXPIRE=7d\n")
        f.write("NODE_ENV=development\n")
        f.write("FRONTEND_URL=http://localhost:5173\n")
    
    with open("client/.env.example", "w") as f:
        f.write("VITE_API_URL=http://localhost:5000/api\n")
        f.write("VITE_APP_NAME=FinCore CRM\n")
    
    print("✅ Project structure created successfully!")
    print(f"Base directory: {base}\n")
    
    # List created structure
    for root, dirs_list, files_list in os.walk("."):
        level = root.replace(".", "").count(os.sep)
        indent = " " * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = " " * 2 * (level + 1)
        for file in files_list[:5]:  # Limit output
            print(f"{subindent}{file}")

if __name__ == "__main__":
    try:
        create_dirs_and_files()
        print("\n🎉 Ready to install dependencies!")
        print("\nRun:")
        print("  cd server && npm install")
        print("  cd ../client && npm install")
    except Exception as e:
        print(f"❌ Error: {e}")
