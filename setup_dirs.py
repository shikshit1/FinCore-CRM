import os
import json
from pathlib import Path

base_dir = r"C:\Users\SHIKSHIT\Desktop\FinCore  CRM"
os.chdir(base_dir)

# Create all directories
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

print("✅ Directories created!")
