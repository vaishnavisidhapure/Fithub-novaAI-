import os
import json
from flask import Flask, request, jsonify, send_from_directory, render_template_string
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static", static_url_path="/static")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "nova-fit-secret-key-2026")

# In-memory mock store for interactive features
MEMBER_DATA = {
    "user": {
        "name": "Alex Mercer",
        "membership": "Black Label Elite",
        "streak_days": 18,
        "calories_today": 2180,
        "calorie_goal": 2650,
        "water_liters": 2.8,
        "water_goal": 3.5,
        "workouts_completed": 142,
        "weight_history": [82.5, 82.1, 81.7, 81.4, 80.9, 80.5, 80.2]
    },
    "admin_stats": {
        "active_members": 14850,
        "monthly_revenue": 184500,
        "gym_locations": 24,
        "trainer_hours": 1280,
        "pending_bookings": 7
    }
}

GYM_LOCATIONS = [
    {
        "id": 1,
        "name": "Nova Fit Metropolis Downtown",
        "city": "New York",
        "tier": "Black Label Elite",
        "address": "450 Lexington Ave, New York, NY",
        "rating": 4.9,
        "reviews": 328,
        "amenities": ["Cryotherapy Chambers", "Olympic Lifting Platforms", "Infrared Saunas", "Hydro-Massage", "Rooftop Sprint Track"],
        "badge": "Flagship Club",
        "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80"
    },
    {
        "id": 2,
        "name": "Nova Fit Beverly Hills Sanctuary",
        "city": "Los Angeles",
        "tier": "Black Label Elite",
        "address": "9601 Wilshire Blvd, Beverly Hills, CA",
        "rating": 5.0,
        "reviews": 412,
        "amenities": ["Cold Plunge Pools", "Pilates Reformer Studio", "Private Valet", "Organic Bio-Bar", "Hyperice Recovery Lounge"],
        "badge": "Celebrity Preferred",
        "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80"
    },
    {
        "id": 3,
        "name": "Nova Fit Mayfair Performance",
        "city": "London",
        "tier": "Executive",
        "address": "14 Berkeley Square, London, UK",
        "rating": 4.8,
        "reviews": 195,
        "amenities": ["Eleiko Power Racks", "Biometric Testing Lab", "Steam Sanctuary", "Executive Coworking Suites"],
        "badge": "Historic Landmark",
        "image": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80"
    },
    {
        "id": 4,
        "name": "Nova Fit Shibuya Cyber-Club",
        "city": "Tokyo",
        "tier": "Standard Pro",
        "address": "21-1 Udagawacho, Shibuya, Tokyo",
        "rating": 4.9,
        "reviews": 274,
        "amenities": ["AI Form Analysis Cages", "Smart Keiser Racks", "Oxygen Pods", "Matcha Nutrition Bar"],
        "badge": "High-Tech",
        "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80"
    }
]

WORKOUT_PROGRAMS = [
    {
        "id": "hypertrophy-elite",
        "title": "Hypertrophy Precision Split",
        "level": "Advanced",
        "duration": "8 Weeks",
        "focus": "Muscle Building & Density",
        "days_per_week": 5,
        "description": "Scientific volume periodization targeted at maximizing myofibrillar protein synthesis with progressive tension overload.",
        "image": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
        "exercises": [
            {"name": "Barbell Incline Press", "sets": 4, "reps": "6-8", "tempo": "3-1-X-0"},
            {"name": "Weighted Neutral Pull-ups", "sets": 4, "reps": "8-10", "tempo": "2-0-1-1"},
            {"name": "Romanian Deadlift", "sets": 3, "reps": "8-10", "tempo": "3-1-1-0"},
            {"name": "Cable Lateral Raise Matrix", "sets": 3, "reps": "12-15", "tempo": "2-0-2-1"}
        ]
    },
    {
        "id": "metabolic-conditioning",
        "title": "Nova Metabolic Forge",
        "level": "Intermediate",
        "duration": "6 Weeks",
        "focus": "Fat Shred & Vo2 Max",
        "days_per_week": 4,
        "description": "High-intensity anaerobic lactate intervals combined with functional compound lifting to scorch body fat while maintaining lean muscle tissue.",
        "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
        "exercises": [
            {"name": "Kettlebell Clean & Push Press", "sets": 5, "reps": "12", "tempo": "Explosive"},
            {"name": "Assault Bike Sprint Burst", "sets": 6, "reps": "30s / 30s rest", "tempo": "Max RPM"},
            {"name": "Front Squat to Box Jump", "sets": 4, "reps": "8 + 5", "tempo": "Power"},
            {"name": "Hanging Toes to Bar", "sets": 4, "reps": "15", "tempo": "Controlled"}
        ]
    },
    {
        "id": "mobility-durability",
        "title": "Kinetic Durability & Mobility",
        "level": "All Levels",
        "duration": "Ongoing",
        "focus": "Joint Integrity & Longevity",
        "days_per_week": 3,
        "description": "Restore rotational capacity, alleviate lower-back tightness, and strengthen stabilizing rotator cuffs and hip flexors.",
        "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
        "exercises": [
            {"name": "Thoracic Spine Foam Rolling Matrix", "sets": 3, "reps": "60 sec", "tempo": "Slow"},
            {"name": "90/90 Hip Flow Transition", "sets": 3, "reps": "10 / side", "tempo": "Controlled"},
            {"name": "Loaded Jefferson Curls", "sets": 3, "reps": "8", "tempo": "5-0-5-0"},
            {"name": "Face Pulls with External Rotation", "sets": 4, "reps": "15", "tempo": "2-1-2-1"}
        ]
    }
]

TRAINERS = [
    {
        "id": 1,
        "name": "Marcus Vance",
        "role": "Master Strength & Conditioning Coach",
        "credentials": "CSCS, USAW Level 2, Ex-Olympic Prep",
        "experience": "12+ Years",
        "specialties": ["Powerlifting", "Hypertrophy", "Bio-Mechanics"],
        "rate": "$160 / hr",
        "image": "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=80",
        "quote": "Strength isn't accidental. It's engineered through disciplined execution."
    },
    {
        "id": 2,
        "name": "Elena Rostova",
        "role": "Functional Athlete & Mobility Director",
        "credentials": "M.Sc. Kinesiology, FRCms, Pilates Master",
        "experience": "9+ Years",
        "specialties": ["Kinetic Chains", "Rehabilitation", "Agility"],
        "rate": "$150 / hr",
        "image": "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80",
        "quote": "Move with purpose, recover with science, perform without limitation."
    },
    {
        "id": 3,
        "name": "Darius Stone",
        "role": "High-Performance Body Recomposition Specialist",
        "credentials": "ISSN Sports Nutritionist, NASM-CPT",
        "experience": "10+ Years",
        "specialties": ["Contest Prep", "Macro Periodization", "Vascularity"],
        "rate": "$175 / hr",
        "image": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
        "quote": "Your physique is the visual manifestation of your daily standard."
    }
]

PRODUCTS = [
    {
        "id": "p1",
        "name": "Nova Fit Ultra-Isolate Whey (Burgundy Reserve)",
        "category": "Supplements",
        "price": 64.99,
        "rating": 4.9,
        "badge": "Best Seller",
        "image": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80",
        "description": "Cold-microfiltered 100% grass-fed whey isolate with DigeZyme enzymes and zero sugar."
    },
    {
        "id": "p2",
        "name": "Nova Fit Kinetic Grip Pro Lifting Straps",
        "category": "Gear",
        "price": 34.00,
        "rating": 4.8,
        "badge": "Competition Grade",
        "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        "description": "Reinforced heavy-duty silicone weave rated for up to 900 lbs deadlifts."
    },
    {
        "id": "p3",
        "name": "Nova Fit Thermal Pre-Ignition Matrix",
        "category": "Supplements",
        "price": 49.99,
        "rating": 5.0,
        "badge": "High Stimulant",
        "image": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80",
        "description": "Laser mental focus, 6000mg L-Citrulline, 3200mg Beta-Alanine, and Alpha GPC."
    },
    {
        "id": "p4",
        "name": "Nova Fit Carbon-Fiber Weighted Jump Rope",
        "category": "Gear",
        "price": 38.50,
        "rating": 4.7,
        "badge": "Cardio Tech",
        "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        "description": "Dual high-speed ceramic ball bearings with interchangeable weighted alloy handles."
    }
]

ARTICLES = [
    {
        "id": "art-1",
        "title": "The Hypertrophy Blueprint: Mechanical Tension vs Metabolic Stress",
        "category": "Science & Anatomy",
        "read_time": "6 min read",
        "author": "Dr. Aris Cole, Ph.D.",
        "summary": "Deep dive into muscle fiber recruitment pathways and why load progression remains king for natural hypertrophy.",
        "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "art-2",
        "title": "Nutrient Timing Precision: Maximizing Muscle Protein Synthesis",
        "category": "Nutrition Strategy",
        "read_time": "5 min read",
        "author": "Darius Stone, ISSN",
        "summary": "How leucine thresholds and peri-workout carbohydrate intake accelerate recovery and glycogen replenishment.",
        "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "art-3",
        "title": "Zone 2 Cardio for Athletes: Building the Aerobic Engine",
        "category": "Longevity & Endurance",
        "read_time": "8 min read",
        "author": "Elena Rostova",
        "summary": "Why elite powerlifters and sprinters require mitochondrial density to accelerate intra-set recovery.",
        "image": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80"
    }
]

# ========================================================
# Nova Fit AI Assistant - Google Gemini API Integration
# ========================================================
GEMINI_SYSTEM_INSTRUCTION = (
    "You are Nova Fit AI Assistant, an elite AI fitness coach and sports science expert built into the NOVA FIT platform. "
    "The brand tagline is 'Train Smarter. Live Stronger.' "
    "Your core competencies include: "
    "1. Gym workouts, exercise techniques, form cues, and biomechanics (squats, deadlifts, presses, rows). "
    "2. Beginner, intermediate, and advanced workout plans (Push/Pull/Legs, Upper/Lower, Full Body, 5-day splits). "
    "3. Diet, nutrition, macronutrient splits (protein, carbohydrates, healthy fats), caloric balance, and protein intake targets. "
    "4. Muscle building (hypertrophy), progressive tension overload, rep-in-reserve (RIR), and strength periodization. "
    "5. Recovery, sleep, stretching, mobility routines, active rest, and injury prevention. "
    "6. Gym equipment usage, free weights vs machines, and gym safety etiquette. "
    "\n"
    "Tone & Personality: Authoritative yet motivating, friendly, evidence-based, concise, and structured. "
    "Format responses with clear headings, bullet points, and bold key terms so they are easy to read in a chat bubble. "
    "Language Capability: You fluently understand and respond in simple English and Hinglish (Hindi written in Latin script, "
    "e.g., 'Agar aap muscle gain karna chahte ho to daily 1.6-2.2g per kg protein aur heavy compound lifts par focus karo'). "
    "When a user asks in Hinglish or asks for Hindi/Hinglish advice, reply warmly in natural Hinglish with accurate fitness terms. "
    "Maintain context across follow-up questions in the conversation."
)

def generate_nova_fit_gemini_reply(prompt_text, conversation_history=None):
    """
    Generates dynamic AI responses using Google Gemini API.
    Supports multi-turn conversation history.
    """
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("GOOGLE_API_KEY", "").strip()
    
    if not gemini_key or gemini_key == "your_gemini_api_key_here":
        return (
            "⚠️ **Gemini API Key Required**\n\n"
            "Nova Fit AI Assistant requires a Google Gemini API key to generate live AI responses.\n\n"
            "**Quick Setup Steps:**\n"
            "1. Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).\n"
            "2. Open the `.env` file in the project folder.\n"
            "3. Add your key: `GEMINI_API_KEY=AIzaSy...`\n"
            "4. Restart the server (`python app.py`).\n\n"
            "*Once added, Nova Fit AI Assistant will deliver 100% live, real-time Gemini AI coaching.*"
        ), False

    if conversation_history is None:
        conversation_history = []

    # Attempt 1: Using google-genai official SDK
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=gemini_key)
        
        # Build contents with conversation history for multi-turn context
        contents = []
        for turn in conversation_history[-8:]: # keep recent 8 turns for context
            role = "user" if turn.get("role") == "user" else "model"
            content = turn.get("content", "").strip()
            if content:
                contents.append(types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=content)]
                ))
        
        # Append current message
        contents.append(types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt_text)]
        ))

        # Try gemini-2.5-flash, fallback to gemini-1.5-flash
        for model_name in ["gemini-2.5-flash", "gemini-1.5-flash"]:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=GEMINI_SYSTEM_INSTRUCTION,
                        temperature=0.7,
                        max_output_tokens=1000
                    )
                )
                if response and response.text:
                    return response.text.strip(), True
            except Exception as inner_e:
                continue

    except Exception as sdk_err:
        pass

    # Attempt 2: Direct REST API via requests
    try:
        import requests

        rest_contents = []
        for turn in conversation_history[-8:]:
            role = "user" if turn.get("role") == "user" else "model"
            content = turn.get("content", "").strip()
            if content:
                rest_contents.append({
                    "role": role,
                    "parts": [{"text": content}]
                })
        rest_contents.append({
            "role": "user",
            "parts": [{"text": prompt_text}]
        })

        for model_name in ["gemini-2.5-flash", "gemini-1.5-flash"]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]
                },
                "contents": rest_contents,
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1000
                }
            }
            res = requests.post(url, json=payload, timeout=20)
            if res.status_code == 200:
                data = res.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip(), True
            elif res.status_code == 400 or res.status_code == 403:
                err_msg = res.json().get("error", {}).get("message", "API Key Invalid or Quota Issue")
                return f"⚠️ **Google Gemini API Error ({res.status_code})**: {err_msg}. Please check your GEMINI_API_KEY.", False

    except Exception as rest_err:
        return f"⚠️ **Connection Error**: Unable to reach Google Gemini API ({str(rest_err)}). Please verify your internet connection and API key.", False

    return "⚠️ **Service Error**: Could not complete Gemini generation. Please verify your GEMINI_API_KEY in .env.", False

# Routes
@app.route("/")
def home():
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            return f.read()
    return "NOVA FIT Platform - Initializing..."

@app.route("/<path:path>")
def static_proxy(path):
    if os.path.exists(path):
        return send_from_directory(".", path)
    return "Not Found", 404

# API Endpoints
@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    history = data.get("history", [])
    
    if not message:
        return jsonify({
            "reply": "Please enter a fitness, workout, or nutrition question.",
            "assistant": "Nova Fit AI Assistant",
            "status": "error"
        }), 400
    
    reply, is_success = generate_nova_fit_gemini_reply(message, history)
    return jsonify({
        "reply": reply,
        "assistant": "Nova Fit AI Assistant",
        "brand": "NOVA FIT",
        "status": "success" if is_success else "notice"
    })

@app.route("/api/gyms", methods=["GET"])
def api_gyms():
    return jsonify(GYM_LOCATIONS)

@app.route("/api/workouts", methods=["GET"])
def api_workouts():
    return jsonify(WORKOUT_PROGRAMS)

@app.route("/api/trainers", methods=["GET"])
def api_trainers():
    return jsonify(TRAINERS)

@app.route("/api/products", methods=["GET"])
def api_products():
    return jsonify(PRODUCTS)

@app.route("/api/articles", methods=["GET"])
def api_articles():
    return jsonify(ARTICLES)

@app.route("/api/dashboard", methods=["GET"])
def api_dashboard():
    return jsonify(MEMBER_DATA)

@app.route("/api/book-trainer", methods=["POST"])
def api_book_trainer():
    data = request.get_json(silent=True) or {}
    trainer_name = data.get("trainer_name", "Coach")
    date = data.get("date", "Tomorrow")
    time = data.get("time", "10:00 AM")
    client_name = data.get("client_name", "Alex Mercer")
    
    return jsonify({
        "status": "success",
        "message": f"Session confirmed with {trainer_name} on {date} at {time}. Check your Nova Fit Athlete Portal for calendar sync.",
        "confirmation_id": f"NF-{os.urandom(3).hex().upper()}"
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f">> NOVA FIT Platform server running at http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
