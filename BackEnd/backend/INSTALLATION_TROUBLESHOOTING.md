# 🚀 Installation Guide for Python 3.13

## ⚠️ Issues You Encountered & Solutions

### Problem 1: PyTorch Version Incompatibility
**Error**: `No matching distribution found for torch==2.1.0`

**Reason**: PyTorch 2.1.0 doesn't support Python 3.13 (requires Python 3.8-3.11)

**Solutions**:

#### ✅ **Option A: Use Minimal Requirements (Recommended for Now)**
```powershell
# Install only what you need to get started
pip install -r requirements-minimal.txt
```

This installs:
- FastAPI & Uvicorn (web framework)
- MongoDB drivers (Motor, Beanie)
- Authentication (JWT, password hashing)
- **Excludes**: ML libraries (install later when needed)

#### Option B: Downgrade to Python 3.11
```powershell
# Uninstall Python 3.13
# Install Python 3.11 from: https://www.python.org/downloads/
# Then use the full requirements.txt
pip install -r requirements.txt
```

#### Option C: Use Updated Requirements
The `requirements.txt` has been updated with Python 3.13 compatible versions:
```powershell
pip install -r requirements.txt
```

### Problem 2: Virtual Environment Creation
**Issue**: `KeyboardInterrupt` during venv creation

**Solution**: Use the `--without-pip` flag first:
```powershell
python -m venv venv --without-pip
cd venv\Scripts
python -m ensurepip --default-pip
cd ..\..
```

---

## ✅ **Step-by-Step Installation (Updated)**

### 1. Create Virtual Environment
```powershell
cd C:\Users\jayas\Desktop\project\A3\BackEnd\backend

# Create venv
python -m venv venv --without-pip

# Install pip
cd venv\Scripts
python -m ensurepip --default-pip
cd ..\..
```

### 2. Activate Virtual Environment

#### PowerShell (Execution Policy Issue):
```powershell
# Option 1: Bypass for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\venv\Scripts\Activate.ps1

# Option 2: Use CMD activation
venv\Scripts\activate.bat

# Option 3: Just use python with full path
# You don't NEED to activate, just use:
venv\Scripts\python.exe -m pip install ...
```

### 3. Install Dependencies

#### **Recommended: Minimal Installation**
```powershell
# Install minimal requirements (no ML libraries)
pip install -r requirements-minimal.txt
```

#### **Full Installation** (if you want ML now):
```powershell
# This might take 5-10 minutes
pip install -r requirements.txt
```

### 4. Verify Installation
```powershell
# Check installed packages
pip list

# Should see:
# fastapi, uvicorn, motor, pymongo, beanie, pydantic, etc.
```

---

## 🗄️ **MongoDB Atlas Setup**

Your MongoDB URL is already configured in `.env`:
```
MONGODB_URL=mongodb+srv://harishganesan1205:harishg0123@cluster0.gbw97al.mongodb.net/
MONGODB_DATABASE=speech_therapy_db
```

### **Important MongoDB Atlas Steps:**

1. **Whitelist Your IP Address**
   - Go to: https://cloud.mongodb.com/
   - Click your cluster → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

2. **Create Database User** (Already done - your credentials are in URL)
   - Username: `harishganesan1205`
   - Password: `harishg0123`

3. **Test Connection**
   ```powershell
   # Quick test
   python -c "from pymongo import MongoClient; client = MongoClient('mongodb+srv://harishganesan1205:harishg0123@cluster0.gbw97al.mongodb.net/'); print('Connected!'); print(client.list_database_names())"
   ```

---

## 🚀 **Start the Server**

### Without Activating venv:
```powershell
cd C:\Users\jayas\Desktop\project\A3\BackEnd\backend
venv\Scripts\python.exe -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### With Activated venv:
```powershell
# If you successfully activated venv
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Expected Output:
```
🚀 Speech Therapy Assistant API v1.0.0 started
✅ Connected to MongoDB: speech_therapy_db
📑 Database indexes created successfully
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Access:
- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health
- **API Info**: http://localhost:8000/api/v1/info

---

## 🧪 **Seed Database**

```powershell
# Without venv activation
venv\Scripts\python.exe seed_database.py

# With venv activation
python seed_database.py
```

---

## 🐛 **Troubleshooting**

### Error: "ModuleNotFoundError: No module named 'motor'"
```powershell
# Make sure you installed requirements
pip install -r requirements-minimal.txt
```

### Error: "Connection refused" or "Authentication failed"
```powershell
# Check MongoDB Atlas:
# 1. Is your IP whitelisted?
# 2. Are credentials correct in .env?
# 3. Is cluster running?
```

### Error: "Cannot activate venv"
```powershell
# You don't need to activate! Just use:
venv\Scripts\python.exe your_script.py
venv\Scripts\pip.exe install package
```

### PowerShell Execution Policy Error
```powershell
# Run as Administrator and execute:
Set-ExecutionPolicy RemoteSigned

# Or use CMD instead:
cmd
venv\Scripts\activate.bat
```

---

## 📦 **What's Installed**

### With `requirements-minimal.txt`:
✅ **Core** (5 MB):
- FastAPI, Uvicorn
- Pydantic

✅ **Database** (10 MB):
- Motor, PyMongo, Beanie

✅ **Auth** (15 MB):
- python-jose, passlib, bcrypt

**Total Size**: ~30 MB
**Install Time**: ~2 minutes

### With `requirements.txt` (Full):
Everything above PLUS:

🤖 **ML/AI** (3+ GB):
- PyTorch (~2 GB)
- Transformers (~500 MB)
- Librosa, SciPy, NumPy

**Total Size**: ~3.5 GB
**Install Time**: ~10-15 minutes

---

## ✅ **Success Checklist**

- [ ] Virtual environment created (`venv` folder exists)
- [ ] Dependencies installed (run `pip list`)
- [ ] `.env` file created with MongoDB URL
- [ ] MongoDB Atlas IP whitelisted
- [ ] Server starts without errors
- [ ] Can access http://localhost:8000/api/docs
- [ ] Health check returns "healthy"
- [ ] Database seeded (optional)

---

## 🎯 **Next Steps After Installation**

1. **Start the server** (see commands above)
2. **Open API Docs**: http://localhost:8000/api/docs
3. **Test registration**: Create a user account
4. **Test login**: Get JWT token
5. **Browse exercises**: View sample data
6. **Install ML packages later** when you need speech analysis:
   ```powershell
   pip install torch transformers librosa scipy numpy
   ```

---

## 💡 **Pro Tips**

1. **Don't activate venv** if you have issues - just use full paths:
   ```powershell
   venv\Scripts\python.exe
   venv\Scripts\pip.exe
   ```

2. **Use CMD instead of PowerShell** if activation fails:
   ```cmd
   venv\Scripts\activate.bat
   ```

3. **Install ML packages separately** - they're huge and take time:
   ```powershell
   # Only when you need them
   pip install torch --index-url https://download.pytorch.org/whl/cpu
   pip install transformers librosa
   ```

4. **Check MongoDB connection** before starting server:
   ```powershell
   python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('your-url').admin.command('ping')); print('OK')"
   ```

---

**🎉 You're almost there! Follow the steps above and you'll have your backend running!**
