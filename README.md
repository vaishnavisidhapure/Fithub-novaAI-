# NOVA FIT — AI-Powered Fitness Platform & Chatbot

> **Brand Tagline:** *“Train Smarter. Live Stronger.”*  
> **Chatbot Name:** **Nova Fit AI Assistant**  
> **AI Engine:** Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)

---

## 📌 Project Overview

**NOVA FIT** is a modern, high-performance web platform featuring a fully functional, real-time AI fitness coach called **Nova Fit AI Assistant**. The application combines sports science, gym club locators, workout protocol databases, interactive biometric calculators, and deep conversational AI.

---

## 🚀 Key Features

### 1. Real AI-Powered Chatbot ("Nova Fit AI Assistant")
- **Google Gemini API Integration**: Direct integration via the official `google-genai` SDK and resilient REST endpoints.
- **Dynamic, Non-Hardcoded Intelligence**: Generates contextual, scientifically sound answers tailored to the user's specific questions.
- **Multi-Turn Session Memory**: Maintains full conversation history during each session, allowing natural follow-up questions (e.g., *"What about on rest days?"*).
- **Dual Language Support**: Understands and replies in standard **English** and **Hinglish** (e.g., *"Bhai protein kitna lena chahiye?"*).
- **Comprehensive Fitness Knowledge**:
  - Gym workouts, barbell biomechanics, and form cues (Squats, Deadlifts, Bench Press).
  - Periodized training splits (Beginner Full-Body, Intermediate PPL, Advanced Hypertrophy).
  - Macronutrient partition, protein targets (1.8–2.2g/kg), caloric balance.
  - Recovery protocols, joint mobility, sleep, and rest days.
  - Gym equipment guide and safety etiquette.
- **Modern Chat Interface**:
  - Floating bottom-right widget with one-click toggle from anywhere on the site.
  - On-page embedded coach suite.
  - Separate user and assistant chat bubbles.
  - Animated typing indicator (`● ● ● Nova Fit AI Assistant is generating...`).
  - Session clear button (`🗑️`) to start a fresh chat.
  - Quick-start suggestion prompt chips.
  - Fully mobile-responsive layout.

### 2. Complete Platform Capabilities
- **Global Club Locator**: Interactive location cards, amenities, and 1-Day Pass claim modal.
- **Workout Protocols**: Hypertrophy, Metabolic Conditioning, and Mobility with an **Interactive Set Rest Timer**.
- **Elite Coaches Roster**: Certified trainer profiles and 1-on-1 Consultation Booking modal.
- **Nova Fit Pro Shop**: Supplements and gear with a slide-out **Shopping Cart Drawer**.
- **Nutrition Engine**: Macro balance bars and daily meal timing schedules.
- **Interactive Calculators**: Real-time **BMI**, **TDEE Daily Caloric Needs**, **Macro Split**, and **1-Rep Max (1RM)**.
- **Athlete Dashboard**: 18-day active streak, quick hydration/calorie logger, and weight progression trend chart.
- **Admin Command Center**: Membership metrics, status tables, and export simulation.

---

## 🛠️ Technology Stack

- **Backend:** Python 3, Flask, `python-dotenv`, `google-genai`, `requests`
- **Frontend:** HTML5, CSS3 Custom Properties (Design System), Vanilla JavaScript (ES6+)
- **Color Palette:**
  - Near-Black (`#0F1116`)
  - Deep Burgundy (`#3C252F` / `#542D3D` / `#7A354E`)
  - Crisp White (`#FFFFFF`)
  - Soft Grey (`#BCB4B7`)
- **AI Model:** Google Gemini (`gemini-2.5-flash` with automatic fallback to `gemini-1.5-flash`)

---

## 🔑 How to Configure Your Gemini API Key

1. **Get a free Google Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Sign in with your Google account and click **Create API Key**.
   - Copy your key.

2. **Add the key to your `.env` file:**
   - Open the `.env` file in the project root:
     ```env
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     PORT=5000
     SECRET_KEY=nova-fit-secret-key-2026
     ```
   *(Note: The `.env` file is protected by `.gitignore` and is never exposed to the frontend or committed to GitHub).*

3. **Restart the server:**
   ```bash
   python app.py
   ```

---

## 🏃‍♂️ How to Run the Website

In the project folder, run:

```bash
python app.py
```

Then open your browser and go to:
👉 **http://127.0.0.1:5000** (or **http://localhost:5000**)

---

## 🎓 College Demonstration Guide (For Professor Demo)

To showcase this project effectively:

1. **Show the UI Design & Brand Identity**:
   - Point out the luxury athletic color palette (`#0F1116` Near-Black and `#3C252F` Deep Burgundy).
   - Demonstrate the navbar, clubs locator, rest timer, and biometric calculators.

2. **Demonstrate Floating Chatbot Widget**:
   - Click the floating **Nova Fit AI Assistant** button in the bottom right corner.
   - Click a quick-prompt chip such as *"💪 4-Day Muscle Split"*.
   - Point out the real-time typing indicator and markdown bubble formatting.

3. **Demonstrate Multi-Turn Follow-up Questions**:
   - **Question 1:** *"I am a beginner. Can you design a 3-day workout routine?"*
   - **Follow-up:** *"What should I eat before and after these workouts?"*
   - Notice that the chatbot remembers the context that you are a beginner on a 3-day routine!

4. **Demonstrate Hinglish Capability**:
   - Ask: *"Bhai muscle building ke liye roz kitna protein khana chahiye?"*
   - The assistant will reply in natural, supportive Hinglish with scientific gram targets (e.g. 1.6–2.2g/kg).

5. **Show Backend Architecture**:
   - Show `app.py`:
     - Secure environment variable handling with `dotenv`.
     - System prompt engineering specializing in sports biomechanics and recovery.
     - Multi-turn conversation history management.
     - REST API endpoint (`/api/chat`).
