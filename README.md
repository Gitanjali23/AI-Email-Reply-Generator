# AI Email Reply Generator ✉️🤖

An AI-powered email writing assistant that helps you generate smart, contextual replies to emails with customizable tones. The project is structured as a monorepo consisting of a Spring Boot backend, a React frontend, and a Chrome Extension integrated directly with Gmail.

🔗 **Live Demo:** [https://your-vercel-deployment-link.vercel.app](https://your-vercel-deployment-link.vercel.app)

---

## 🚀 Features
- **Context-Aware Replies:** Uses Google Gemini AI to analyze incoming emails and draft replies.
- **Customizable Tones:** Select from professional, casual, friendly, or custom tones.
- **Chrome Extension integration:** Draft replies directly inside Gmail without leaving your browser tab.
- **Independent Web Client:** A standalone React dashboard to generate email replies manually.
- **Secure Configuration:** Zero hardcoded API keys—handles authentication securely via system environment variables.

---

## 📁 Project Structure

```text
AI-Email-Reply-Generator/
├── email-writer-backend/       # Spring Boot REST API
├── email-writer-frontend/      # React (Vite) Web Application
├── email-writer-ext/           # Google Chrome Extension (Gmail Integrated)
└── README.md                   # Project Documentation
```

---

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x / 4.x** (Spring Web, Spring WebFlux/WebClient)
- **Jackson** (JSON handling)
- **Lombok**

### Frontend
- **React.js** (Vite wrapper)
- **Material UI (MUI)** (Component Library)
- **Axios** (API communication)

### Chrome Extension
- **Manifest V3**
- **Vanilla JavaScript & CSS** (Content Script Injection)

---

## ⚙️ Setup and Installation

### 1. Prerequisites
- **JDK 17** or higher installed.
- **Node.js (v18+)** and npm installed.
- Google Chrome (or Chromium-based browser) to run the extension.
- A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/)).

---

### 2. Backend Setup (`email-writer-backend`)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd email-writer-backend
   ```
2. **Set your Gemini API Key as an environment variable:**
   - **Linux/macOS:**
     ```bash
     export GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
   - **Windows (Command Prompt):**
     ```cmd
     set GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend server will start on `http://localhost:8080`.

---

### 3. Frontend Setup (`email-writer-frontend`)

1. Navigate to the frontend directory:
   ```bash
   cd ../email-writer-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The app will run locally (typically at `http://localhost:5173`).

---

### 4. Chrome Extension Setup (`email-writer-ext`)

1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle switch in the top-right corner).
3. Click on **Load unpacked** in the top-left corner.
4. Select the `email-writer-ext` folder from this project directory.
5. Open Gmail (`https://mail.google.com/`), open any email, click **Reply**, and you will see the **AI Reply** button integrated directly into your Gmail composer interface!

---

## 🔒 Security Best Practices
- **Never commit your API Keys:** The Gemini API key is fetched dynamically using `${GEMINI_API_KEY}` in the `application.properties` configuration.
- **Ignored Files:** System files (`.idea/`, `.vscode/`), dependencies (`node_modules/`, `target/`), and local configuration files are safely excluded using `.gitignore`.
