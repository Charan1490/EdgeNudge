# 🎬 EdgeNudge Demo Guide

## Quick Start (30 seconds)

1. **Open** `frontend/index.html` in **Chrome** or **Edge** (WebGPU support)
2. Wait for "**Model Ready ✓**" in header
3. Click "**🎬 Auto Demo**" button
4. Watch as it cycles through 4 scenarios automatically

---

## 3-Minute Hackathon Presentation

### **[00:00 - 00:30] Introduction** (30 seconds)

**Script:**
> "Hi! I'm presenting **EdgeNudge** — an edge-first, privacy-preserving AI system that saves campus energy.
>
> EdgeNudge runs **entirely in your browser** using WebGPU acceleration. It predicts room occupancy with **99.5% accuracy** and suggests **precise energy actions** — like turning off lights when a room is empty.
>
> Key benefits: **Zero cloud costs**, **full privacy** (no data leaves device), and **measurable savings** from day one."

**Visual:** Point to header showing "Model Ready" and "1.36 KB" model size

---

### **[00:30 - 02:00] Live Demo** (90 seconds)

**Action:** Click "🎬 Auto Demo" button

**Script:**
> "Let me show you a live demo. I'm running 4 real-world scenarios:
>
> **1. Late Night (Empty Room)**
> - Notice the prediction is 'Empty' with high confidence
> - EdgeNudge immediately shows an energy-saving nudge
> - It calculates: Turn off lights, fan, AC → Save 1.17 kWh ($0.14)
>
> **2. Morning Class (Occupied)**
> - Sensors show high light, motion, phone presence
> - Prediction: 'Occupied' — Green checkmark
> - No action needed, room is in use
>
> **3. Evening Study (Occupied)**
> - Another occupied scenario, system correctly identifies it
>
> **4. Weekend Morning (Empty)**
> - Low activity detected
> - Energy nudge appears again with savings estimate
>
> Notice how **fast** these predictions are — under 50 milliseconds each!"

**Visual:** Let auto-demo cycle through scenarios, point to:
- Prediction cards (red/green)
- Energy nudge cards (orange alerts)
- Savings breakdown (lights, fan, AC)

---

### **[02:00 - 02:30] Performance Proof** (30 seconds)

**Action:** Scroll to "Performance Analysis" section

**Script:**
> "Here's what makes EdgeNudge special for AMD:
>
> **✅ Hardware Acceleration:** WebGPU provides 3x faster inference than CPU
> 
> **✅ Ultra-lightweight:** Only 1.36 KB model (smaller than most images!)
>
> **✅ Privacy:** Open DevTools → Network tab shows **zero requests** after initial load
>
> **✅ Accuracy:** 99.48% on test data — only 3 errors in 576 predictions"

**Visual:** Point to performance comparison chart showing WebGPU vs WebGL vs WASM

---

### **[02:30 - 03:00] Impact & ROI** (30 seconds)

**Action:** Scroll back to energy dashboard

**Script:**
> "Now, the impact. For a **100-room campus deployment**:
>
> - **Monthly:** 14,000 kWh saved = **$1,680**
> - **Annual:** 170,000 kWh = **$20,400** + **72 tons CO₂** avoided
>
> That's equivalent to **3,400 trees planted** or powering **16 homes** for a year.
>
> EdgeNudge is **pilot-ready** — install in one day, measure savings in one week. 
>
> And because it runs on-device with AMD-accelerated inference, there are **zero ongoing cloud costs**."

**Visual:** Point to campus-wide projections card

**Closing:**
> "Thank you! EdgeNudge demonstrates how **sustainable AI** can deliver **measurable ROI** while respecting privacy. Questions?"

---

## Manual Testing Scenarios

### **Scenario 1: Empty Room Detection**
1. Click preset: **"🌙 Late Night (Empty)"**
2. Click **"Predict Occupancy"**
3. **Expected:**
   - Status: ✅ EMPTY (green)
   - Energy Nudge: 💡 "Energy Saving Opportunity"
   - Savings: ~1.17 kWh
   - CO₂: ~0.5 kg avoided

### **Scenario 2: Occupied Room**
1. Click preset: **"☀️ Morning Class"**
2. Click **"Predict Occupancy"**
3. **Expected:**
   - Status: 🔴 OCCUPIED (red)
   - Nudge: ✅ "Room In Use"
   - No savings dashboard

### **Scenario 3: Custom Sensors**
1. **Adjust sliders:**
   - Hour: 14 (2 PM)
   - Light: 700 lux
   - Temp: 26°C
   - PIR: ON
   - Phone: ON
2. Click **"Predict Occupancy"**
3. **Expected:** Occupied (high confidence)

### **Scenario 4: Edge Case**
1. **Adjust sliders:**
   - Hour: 3 (3 AM)
   - Light: 10 lux
   - All sensors: OFF
2. Click **"Predict Occupancy"**
3. **Expected:** Empty (very high confidence)

---

## Performance Benchmarks

### **Inference Speed**
| Provider | Average Latency | Use Case |
|----------|----------------|----------|
| **WebGPU** | 5-15ms | Modern browsers (Chrome, Edge) with GPU |
| **WebGL** | 10-25ms | GPU fallback for older browsers |
| **WASM** | 20-50ms | CPU-only fallback (works everywhere) |

### **Model Metrics**
- **Size:** 1.36 KB (ONNX)
- **Accuracy:** 99.48%
- **Features:** 6 inputs
- **Outputs:** Binary classification (0=Empty, 1=Occupied)

### **Page Load**
- **Total size:** ~40 KB (HTML + CSS + JS + Model)
- **Load time (WiFi):** <1 second
- **Load time (3G):** <3 seconds

---

## Troubleshooting

### **Model Not Loading**
- **Check:** Browser console for errors
- **Solution:** Use Chrome or Edge for WebGPU support
- **Fallback:** Will auto-switch to WebGL or WASM

### **Predictions Not Working**
- **Check:** "Model Ready ✓" badge in header
- **Solution:** Wait 2-3 seconds after page load
- **Debug:** Open console (F12) and look for initialization logs

### **Auto Demo Not Starting**
- **Check:** Button should appear after model loads
- **Solution:** Refresh page and wait for "Model Ready"

---

## Key Talking Points

### **For Judges**

**Technical Excellence:**
- ✅ On-device inference (WebGPU/ONNX Runtime Web)
- ✅ 99.48% accuracy (exceeds 85% target by 14%)
- ✅ 1.36 KB model (97% smaller than 50 KB target)
- ✅ <50ms latency (real-time)

**Sustainability Impact:**
- ✅ Measurable savings (kWh, $, CO₂)
- ✅ Campus-wide scale (100 rooms = $20K/year)
- ✅ Zero cloud infrastructure (no ongoing costs)
- ✅ Privacy-first (no data transmitted)

**AMD Relevance:**
- ✅ WebGPU acceleration (AMD GPU-friendly)
- ✅ Open standards (ONNX, WebGPU)
- ✅ Efficient computing (edge > cloud)
- ✅ Can extend to ROCm for native inference

**Demo Quality:**
- ✅ Working prototype (not mockup)
- ✅ Auto-demo mode (repeatable)
- ✅ Real calculations (not fake data)
- ✅ Professional UI (responsive, polished)

---

## Questions & Answers

**Q: How accurate is the model?**
> A: 99.48% on test data (30 days, 576 test samples). Only 3 errors.

**Q: What hardware does it need?**
> A: Any modern browser. WebGPU for best performance, but works on CPU too.

**Q: How much does deployment cost?**
> A: Hardware: $5-10 per room (light sensor + ESP32). Software: Zero (runs in browser). No cloud costs.

**Q: Does it work offline?**
> A: Yes! After first load, works completely offline.

**Q: How do you ensure privacy?**
> A: Everything runs on-device. No audio, video, or raw sensor data ever leaves the device. Open DevTools → Network tab shows zero requests after model load.

**Q: What's the ROI timeline?**
> A: Pilot deployment: 1 day. Measurable savings: 1 week. Payback: <6 months for 100 rooms.

**Q: Can it integrate with building automation?**
> A: Yes! The "Schedule Auto-Off" button can trigger HVAC/lighting systems via standard protocols (BACnet, MQTT).

---

## Next Steps (Post-Hackathon)

1. **Real Hardware Pilot**
   - Deploy ESP32 + sensors ($10/room)
   - Test in 10 dorm rooms for 30 days
   
2. **AMD ROCm Integration**
   - Port to native AMD GPU inference
   - Benchmark vs browser WebGPU
   
3. **Multi-Room Optimization**
   - Building-wide scheduling
   - Predictive HVAC control
   
4. **Mobile PWA**
   - Install on facility manager phones
   - Push notifications for energy alerts

---

## File Checklist

Before demo, ensure these files exist:
- ✅ `frontend/index.html`
- ✅ `frontend/style.css`
- ✅ `frontend/app.js`
- ✅ `frontend/model.onnx`
- ✅ `frontend/model_info.json`

**Total:** ~40 KB (entire app!)

---

**Built with ❤️ for AMD Hackathon 2024**

**Theme:** Sustainable AI & Green Tech

**Impact:** Real energy savings, measurable ROI, privacy-first
