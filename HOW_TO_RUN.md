# 🚀 How to Run EdgeNudge

## ⚠️ IMPORTANT: CORS Fix Required

**You CANNOT open `index.html` directly** (double-click) because browsers block local file access (CORS policy).

**You MUST use a local web server.**

---

## ✅ Method 1: One-Click Start (Easiest)

### **Windows:**

**Option A: Batch File**
```bash
# Double-click this file:
START_SERVER.bat
```

**Option B: PowerShell**
```powershell
# Right-click → Run with PowerShell:
.\start-server.ps1
```

Both will:
1. Start HTTP server on `http://localhost:8000`
2. Automatically open your browser
3. EdgeNudge loads and works!

---

## ✅ Method 2: Manual Python Server

### **Step-by-Step:**

1. **Open Terminal** (PowerShell or CMD)

2. **Navigate to frontend folder:**
   ```bash
   cd F:\AMD\frontend
   ```

3. **Start Python HTTP server:**
   ```bash
   python -m http.server 8000
   ```

4. **Open browser** and go to:
   ```
   http://localhost:8000
   ```

5. **Stop server** when done:
   - Press `Ctrl+C` in terminal

---

## ✅ Method 3: VS Code Live Server (If you have it)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Page opens automatically

---

## ✅ Method 4: Node.js http-server (If you have Node.js)

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Navigate to frontend folder
cd F:\AMD\frontend

# Start server
http-server -p 8000

# Open browser to http://localhost:8000
```

---

## 🐛 Troubleshooting

### **Issue: "python: command not found"**
**Solution:**
- Ensure Python is installed
- Try `python3` instead of `python`
- Or use Node.js method instead

### **Issue: "Port 8000 already in use"**
**Solution:**
- Use a different port:
  ```bash
  python -m http.server 8080
  ```
- Then open `http://localhost:8080`

### **Issue: Browser shows blank page**
**Solution:**
- Check console (F12) for errors
- Ensure you're at `http://localhost:8000` (not `file://`)
- Try refreshing page (Ctrl+R)

### **Issue: Model doesn't load**
**Solution:**
- Verify files exist:
  - `frontend/model.onnx` (1.4 KB)
  - `frontend/model_info.json` (1.3 KB)
- Check browser console for errors
- Try Chrome or Edge (best WebGPU support)

---

## 📊 What You Should See

After starting the server and opening the browser:

1. **Initial Load (3 seconds):**
   - Purple gradient background
   - "Loading model..." badge
   - Then: "Model Ready ✓" (green)

2. **Main Interface:**
   - Left panel: Sensor controls (sliders, toggles)
   - Right panel: Prediction results
   - 4 preset buttons
   - "🎬 Auto Demo" button in header

3. **Console (F12):**
   ```
   🚀 EdgeNudge initializing...
   📊 Model info loaded: ...
   ✅ ONNX session created successfully!
   ✅ EdgeNudge ready!
   ```

4. **No Errors:**
   - No "CORS" errors
   - No "Failed to fetch" errors
   - No red error messages

---

## 🎯 Quick Test (1 minute)

1. Wait for "Model Ready ✓" badge (green)
2. Click "🎬 Auto Demo" button
3. Watch as it cycles through 4 scenarios
4. Verify predictions work

**Expected:** 
- Empty rooms show energy savings
- Occupied rooms show "Room In Use"
- Inference time < 50ms

---

## 🚀 You're Ready!

Once the server is running and page loads:
- ✅ Model loads successfully
- ✅ All features work
- ✅ No CORS errors
- ✅ Ready for demo!

---

## 📝 Pro Tips

**Keep Server Running:**
- Don't close the terminal window
- Server stays active as long as terminal is open
- Refresh browser (Ctrl+R) to reload changes

**Stopping Server:**
- Press `Ctrl+C` in the terminal
- Or close the terminal window

**Multiple Tests:**
- Server keeps running
- Just refresh browser to test changes
- No need to restart server each time

---

**Need Help?**
- Check `TESTING_GUIDE.md` for complete testing instructions
- Check `docs/DEMO.md` for presentation script
- Check browser console (F12) for error messages
