# 🚀 Nova AI Studio Manager v5.1
### *The Ultimate Professional Dashboard for Google AI Ecosystem Management*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build: Professional](https://img.shields.io/badge/Build-Professional-blue.svg)]()
[![Ecosystem: Google AI](https://img.shields.io/badge/Ecosystem-Google%20AI-red.svg)]()

Nova AI Studio Manager is a state-of-the-art, high-performance workspace designed for developers and AI researchers who demand precision control over their Google AI deployments. Featuring a premium Apple-inspired "glassmorphism" UI, real-time telemetry, and a secure multi-modal chat engine, it is the most comprehensive tool for managing Gemini, Gemma, Imagen, and Veo models.

---

## 🌟 Why Nova AI?

Unlike standard AI interfaces, Nova provides a **real-time telemetry layer** that tracks your API quotas (RPM, TPM, RPD) with micro-second precision. It bridges the gap between raw API calls and a production-ready dashboard.

### 💎 Key Features
- **⚡ Real-Time Telemetry**: Instant visualization of Requests Per Minute (RPM) and Tokens Per Minute (TPM).
- **🧠 45+ Canonical Models**: Exhaustive support for the latest Gemini 2.5, 3.1, Gemma 3, Veo 3, and Imagen 4 families.
- **🛡️ Secure Token Management**: Choose between **Direct Browser API** or **Local Express Proxy** mode for maximum security.
- **📊 Advanced Analytics**: Interactive Line, Doughnut, and Radar charts powered by Chart.js 4.4.
- **💬 Pro Multi-Modal Chat**: Full Markdown rendering (Marked.js), syntax highlighting, and native audio/image support.
- **🧹 Auto-Reset Engine**: Intelligent background daemons that flush rate limits automatically.

---

## 📦 Canonical Model Support
Nova supports every major frontier model in the Google AI ecosystem:

| Family          | Notable Models                    | Capabilities                               |
| :-------------- | :-------------------------------- | :----------------------------------------- |
| **Gemini Core** | 2.5 Flash, 2.5 Pro, 3.1 Pro       | Frontier reasoning, Speed, Coding          |
| **Next-Gen**    | 2.0 Flash Exp, 3.1 Flash Lite     | Cutting-edge preview features              |
| **Gemma 3**     | 1B, 4B, 12B, 27B (-it)            | Open-weights, efficient instruction tuning |
| **Creative**    | Veo 3, Imagen 4 (Ultra/Fast)      | High-fidelity Video & Image generation     |
| **Specialty**   | Nano Banana, Native Audio, ER 1.5 | On-device, Audio Dialog, Robotics          |
| **Agents**      | Deep Research Pro, Computer Use   | Task automation & deep reasoning           |

---

## 🛠️ Architecture & Setup

Nova uses a decoupled **Client-Proxy Architecture** for maximum reliability.

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **Google AI API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/google-ai-studio-manager.git

# Enter directory
cd google-ai-studio-manager

# Install dependencies
npm install
```

### 3. Configuration
Nova supports two ways to authenticate:
- **Direct UI Entry**: Paste your API key in the "Settings" modal inside the browser.
- **Proxy Mode (Recommended)**: Create a `.env` file for server-side key safety.
```env
GOOGLE_API_KEY=your_secured_api_key_here
PORT=3001
DEBUG=true
```

### 4. Launching
```bash
# Start the concurrent development environment
npm run dev
```
*Port 3000 (Frontend) and Port 3001 (Proxy Backend) will start simultaneously.*

---

## 🤝 Open for Support & Collaboration
**We are looking for contributors!** Whether you are a UI/UX expert, a backend engineer, or an AI researcher, Nova is an open canvas for your contributions.

### How to Help:
1.  **UI/UX Pass**: Help us refine the glassmorphism aesthetic or mobile responsiveness.
2.  **Model Mapping**: As Google releases new models, help update the `MODEL_LIMITS` and `MODEL_DISPLAY_NAMES` in `script.js`.
3.  **New Analytics**: Suggest new telemetry metrics (latency tracking, cost estimation, etc.).
4.  **Bug Hunting**: Report issues or submit PRs for any edge cases found.

### Contribution Rules:
- Keep the logic in **Vanilla JavaScript** to maintain zero-bundle overhead.
- Use **Tailwind CSS** for UI consistency.
- Maintain the **DATA_VERSIONing** logic when modifying storage structures.

---

## 💻 Technical Stack
- **Frontend**: HTML5, Tailwind CSS, Lucide Icons
- **Charts**: Chart.js v4.4.1
- **Markdown**: Marked.js for fluid response rendering
- **Backend**: Express.js (Node server-side proxy)
- **Deployment**: Zero-config, runs locally via `live-server`

## 📄 License
Project released under the [MIT License](LICENSE).

---
*Created with ❤️ for the AI Developer Community. Google AI Studio is a trademark of Google LLC.*
