#!/usr/bin/env python3
"""
FinCore CRM - Complete Setup and Code Generation
Run this script once to set up the entire project
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def safe_write(filepath, content):
    """Write content to file, creating parent directories"""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def run_command(cmd, cwd=None):
    """Run shell command"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ {cmd}")
            return True
        else:
            print(f"✗ {cmd}")
            print(f"  Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"✗ Failed to run {cmd}: {e}")
        return False

def main():
    base_dir = r"C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
    os.chdir(base_dir)
    
    print("=" * 60)
    print("  🚀 FinCore CRM - Complete Project Setup")
    print("=" * 60 + "\n")
    
    # Step 1: Create directories
    print("📁 Creating project structure...\n")
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
        "client/public",
        "client/src/assets"
    ]
    
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
        print(f"  ✓ {d}")
    
    # Step 2: Create package.json files
    print("\n📦 Creating configuration files...\n")
    
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
    
    safe_write("server/package.json", json.dumps(server_pkg, indent=2))
    print("  ✓ server/package.json")
    
    client_pkg = {
        "name": "fincore-crm-client",
        "version": "1.0.0",
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
    
    safe_write("client/package.json", json.dumps(client_pkg, indent=2))
    print("  ✓ client/package.json")
    
    # Step 3: Create environment files
    print("\n🔧 Creating environment files...\n")
    
    server_env = """PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fincore
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
"""
    
    safe_write("server/.env.example", server_env)
    print("  ✓ server/.env.example")
    
    client_env = """VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=FinCore CRM
"""
    
    safe_write("client/.env.example", client_env)
    print("  ✓ client/.env.example")
    
    # Step 4: Create root package.json if doesn't exist
    if not os.path.exists("package.json"):
        root_pkg = {
            "name": "fincore-crm",
            "version": "1.0.0",
            "private": True,
            "scripts": {
                "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
                "dev:server": "cd server && npm run dev",
                "dev:client": "cd client && npm run dev",
                "install-all": "npm install && cd server && npm install && cd ../client && npm install"
            }
        }
        safe_write("package.json", json.dumps(root_pkg, indent=2))
        print("  ✓ package.json (root)")
    
    print("\n" + "=" * 60)
    print("  ✅ Project structure created successfully!")
    print("=" * 60 + "\n")
    
    print("📋 Next Steps:\n")
    print("  1. CREATE .env FILES")
    print("     - Copy server/.env.example to server/.env")
    print("     - Update MongoDB Atlas connection string\n")
    
    print("  2. INSTALL DEPENDENCIES")
    print("     cd server && npm install")
    print("     cd ../client && npm install\n")
    
    print("  3. START DEVELOPMENT")
    print("     npm run dev\n")
    
    print("📖 Documentation:")
    print("   - README.md - Project overview")
    print("   - SETUP-GUIDE.md - Detailed setup instructions")
    print("   - SERVER-SETUP.md - Backend configuration\n")
    
    print("🔗 Key URLs (when running):")
    print("   - Frontend: http://localhost:5173")
    print("   - Backend API: http://localhost:5000/api")
    print("   - MongoDB: Your Atlas connection string\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
