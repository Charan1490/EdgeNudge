# EdgeNudge 🌱⚡

**Edge-first Energy Nudging for Campus Spaces**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Hackathon](https://img.shields.io/badge/Built%20for-AMD%20Hackathon-red)](https://amd.com)

---

## 🎯 Elevator Pitch

**EdgeNudge** is a lightweight, on-device system that predicts room occupancy and suggests precise, timely energy actions (lights, fans, AC) with **ultra-low inference cost**. 

✅ Runs inference **in the browser** or on tiny edge devices using **WebGPU / ONNX Runtime Web**  
✅ Requires only **cheap sensors** (PIR, light) or phone signals  
✅ **Preserves privacy** (100% on-device, no cloud)  
✅ Outputs **actionable nudges** with real-time energy savings estimates  

**Impact:** Reduce campus energy waste by 20-40% without intrusive hardware changes.

---

## 🏆 Why This Wins

| Feature | Why Judges Care |
|---------|----------------|
| **🚀 AMD-Friendly** | Leverages WebGPU acceleration (ready for AMD GPUs via browser) |
| **🌍 Sustainability** | Quantifiable kWh/CO₂ reduction — core to Green Tech challenge |
| **🔒 Privacy-First** | On-device inference, no raw audio/video leaves device |
| **💰 Low Cost** | Zero cloud costs, works with $5 sensors or existing infrastructure |
| **📏 Measurable** | Live latency (ms), energy saved (kWh), model size (KB) |

---

## 🛠️ Tech Stack

### **Training (Python)**
- **scikit-learn** — Tiny decision tree classifier
- **ONNX** — Export model for browser inference
- **Pandas/NumPy** — Data generation & processing

### **Inference (Browser)**
- **ONNX Runtime Web** — WebGPU/WebGL accelerated inference
- **Vanilla JavaScript** — No heavy frameworks, fast load
- **Chart.js** — Real-time visualization

### **Deployment**
- **Local-first** — Runs entirely in browser (GitHub Pages ready)
- **Zero backend** — No servers, no API calls, no cloud costs

---

## 📂 Project Structure

```
edge-nudge/
├── train/                      # Model training pipeline
│   ├── generate_data.py        # ✅ Step 1: Synthetic data generator
│   ├── occupancy_data.csv      # ✅ Step 1: Training dataset (30 days)
│   ├── train_model.py          # Step 2: Train DecisionTree model
│   ├── model.pkl               # Step 2: Trained scikit-learn model
│   ├── convert_to_onnx.py      # Step 3: Convert to ONNX format
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # Browser-based inference app
│   ├── index.html              # Step 4: Main UI
│   ├── app.js                  # Steps 4-6: Inference engine
│   ├── style.css               # Step 4: Styling
│   └── model.onnx              # Step 3: ONNX model for browser
│
├── README.md                   # This file
├── DEMO.md                     # Step 6: Pitch script
└── .gitignore                  # Keep repo clean
```

---

## 🚀 Quick Start

### **Step 1: Generate Training Data** ✅ COMPLETE

```bash
cd train
pip install -r requirements.txt
python generate_data.py
```

**Output:** `occupancy_data.csv` with 2,880 samples (30 days × 4 readings/hour)

**Features:**
- `hour` (0-23), `day_of_week` (0-6)
- `ambient_light` (lux), `pir_motion` (0/1), `phone_presence` (0/1)
- `temperature` (°C)

**Target:** `occupied` (0/1)

---

### **Step 2: Train Model** (Coming Next)

```bash
python train_model.py
```

Expected output:
- Model accuracy: **>85%**
- File: `model.pkl` (~20-50 KB)

---

### **Step 3: Convert to ONNX** (Coming Next)

```bash
python convert_to_onnx.py
```

Output: `../frontend/model.onnx` (browser-ready)

---

### **Step 4-6: Build & Demo Frontend** (Coming Next)

```bash
cd ../frontend
# Open index.html in browser (Chrome/Edge recommended for WebGPU)
```

Features:
- ⚡ Real-time occupancy prediction
- 💡 Energy nudge suggestions ("Turn off lights in 5 min → Save 0.2 kWh")
- 📊 Live performance metrics (latency, model size)
- 🎨 Interactive sensor simulator

---

## 📊 Demo Metrics (Target Goals)

| Metric | Target | How We Show It |
|--------|--------|----------------|
| **Inference Latency** | <50ms (WebGPU) | Live timer in UI |
| **Model Size** | <50 KB | Display file size |
| **Accuracy** | >85% | Training output |
| **Energy Saved** | 15-30 kWh/month per room | Dashboard calculation |
| **CO₂ Avoided** | ~10 kg/month per room | Derived from kWh |
| **Privacy** | 100% on-device | Zero network calls in DevTools |

---

## 🎬 3-Minute Demo Script

**[30s] Intro**
> "EdgeNudge uses on-device AI to predict room occupancy and suggest energy actions — saving 20-40% energy with zero cloud costs and full privacy."

**[90s] Live Demo**
1. Simulate empty room → Model predicts "unoccupied"
2. Click "Nudge" → Shows "Turn off lights in 5 min → Save 0.25 kWh"
3. Simulate study session → Model adapts in real-time
4. Show cumulative savings dashboard

**[30s] Performance**
- Open DevTools → Show <50ms inference (WebGPU)
- Show model.onnx file (tiny size)
- Confirm zero network requests (privacy proof)

**[30s] Impact**
> "Deployed across 100 campus rooms = 2,000 kWh/month saved = $300/month + 1.5 tons CO₂ avoided."

---

## 🌟 Unique Differentiators

1. **Hybrid Input Strategy**  
   Combines ultra-cheap sensors (PIR, light) + smartphone presence (BLE/WiFi beacons) — robust without expensive hardware.

2. **Energy-Aware Model Design**  
   Tiny decision tree optimized for <1000 FLOPs — measurably faster and lower power than cloud inference.

3. **Actionable Nudges, Not Just Predictions**  
   Outputs single-tap actions for dorm leaders: *"Turn off AC in Room 204 → Save 2.5 kWh today"*

4. **Privacy by Design**  
   No audio, no video, no raw data ever leaves the device. Compliant with campus privacy policies.

---

## 🔮 Future Extensions (Post-Hackathon)

- **AMD ROCm Integration** — Native GPU inference on AMD hardware
- **Multi-Room Optimization** — Building-wide scheduling
- **Mobile App (PWA)** — Install on dorm leader's phone
- **Real Hardware Pilot** — Deploy with ESP32 + sensors ($10/room)

---

## 📝 License

MIT License - Built for AMD Hackathon 2024

---

## 👥 Team

*[Add your team info here]*

---

## 🙏 Acknowledgments

- **ONNX Runtime** — Microsoft's open-source inference engine
- **UCI Machine Learning Repository** — Inspiration for occupancy datasets
- **AMD** — For championing sustainable, efficient computing

---

**Built with ❤️ for a greener campus**
