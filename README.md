# AI Email Reply Generator ✉️🤖

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Backend-Railway-purple?style=for-the-badge&logo=railway)](https://railway.app/)
[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x%20%2F%204.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

An AI-powered email writing assistant that generates smart, contextual, and tone-specific replies to emails. The project is a monorepo containing a Spring Boot backend, a React web client, and a Chrome Extension that integrates directly with Gmail.

🔗 **Live Demo:** [https://ai-email-reply-generator-ngfe.vercel.app/]

---

## 🚀 Key Features
- **Context-Aware AI Replies:** Uses Google Gemini AI to analyze incoming email threads and draft contextually appropriate replies.
- **Custom Tones:** Instantly choose from Professional, Casual, Friendly, Urgent, or Apologetic tones.
- **Chrome Extension Integration:** Inserts an "AI Reply" button directly into the Gmail composer footer to draft replies in one click.
- **Standalone Web Dashboard:** A beautiful React web interface built with Material UI (MUI) to manually draft and copy email responses.
- **Production-Ready & Secure:** Dynamic port binding, CORS config, and absolute credential security with zero hardcoded API keys.

---

## 📁 Project Structure

```text
AI-Email-Reply-Generator/
├── email-writer-backend/       # Spring Boot API (Interacts with Google Gemini)
├── email-writer-frontend/      # React + Vite client dashboard
├── email-writer-ext/           # Chrome Extension (Gmail injected scripts)
└── README.md                   # Setup and deployment guide
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Java 17, Spring Boot 4.0, Spring Web, WebClient | Handles AI prompt construction, API requests to Google Gemini, CORS configurations, and JSON processing. |
| **Frontend** | React 19, Vite, Material UI (MUI) v9, Axios | Interactive and sleek dark-themed dashboard to draft replies manually. |
| **Extension** | Manifest V3, Vanilla JavaScript, CSS | Injects DOM scripts into Gmail web client (`mail.google.com`) and queries the backend API. |

---

## ⚙️ Local Setup and Installation

### 1. Prerequisites
- **JDK 17** or higher.
- **Node.js (v18+)** & npm.
- Google Chrome browser.
- A **Google Gemini API Key** (Get one free from [Google AI Studio](https://aistudio.google.com/)).

---

### 2. Run Backend Locally (`email-writer-backend`)

1. Navigate to the backend directory:
   ```bash
   cd email-writer-backend
   ```
2. **Set your Gemini API Key in your environment:**
   - **Linux/macOS:**
     ```bash
     export GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
   - **Windows (CMD):**
     ```cmd
     set GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
3. Launch the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend server will run on `http://localhost:8080`. You can test health via: `curl http://localhost:8080/api/test` (Should return `Working`).

---

### 3. Run Frontend Locally (`email-writer-frontend`)

1. Navigate to the frontend directory:
   ```bash
   cd ../email-writer-frontend
   ```
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The web client will start, usually at `http://localhost:5173`.

---

### 4. Install Chrome Extension (`email-writer-ext`)

1. Open Chrome and head to `chrome://extensions/`.
2. Turn on **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left corner).
4. Select the `email-writer-ext` folder from this project.
5. Open Gmail, hit **Reply** on any message, and look for the new **AI Reply** button in your compose toolbar!

---

## ☁️ Production Deployment

### 1. Backend Deployment on Railway.app
Railway handles multi-stage Docker builds natively. We have configured a `Dockerfile` for easy setups:
1. Log in to [Railway](https://railway.app/) and create a **New Project**.
2. Select **Deploy from GitHub repository** and link your repo.
3. In the service **Settings**:
   - Set **Root Directory** to `/email-writer-backend`.
   - Railway will automatically detect the `Dockerfile` and build it.
4. Go to the **Variables** tab and add:
   - `GEMINI_API_KEY` = `your_actual_gemini_api_key`
   - `PORT` = `8080` (Spring Boot automatically binds to this dynamic port).
5. In **Settings** under **Domains**, click **Generate Domain** to get your public API URL (e.g., `https://your-backend.up.railway.app`). Copy this link.

---

### 2. Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure the Project:
   - Select **Vite** as the Framework Preset.
   - Set **Root Directory** to `email-writer-frontend` (highly important!).
4. Add the following **Environment Variable**:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.up.railway.app` (the public API URL from Railway).
5. Click **Deploy**. Vercel will build and serve your web application and generate a public live domain.

---

## 🔒 Security Best Practices
- **Dynamic Port Mapping:** The Spring Boot backend uses `server.port=${PORT:8080}` to bind to whatever port the production server allocates.
- **Zero Exposed Keys:** The API key is injected at runtime using environment variables. It is never stored or visible in source control.
- **Root Gitignore:** Root-level `.gitignore` handles IDE configurations (`.idea/`, `.vscode/`), compiled dependencies (`node_modules/`, `target/`), and temporary files safely.
