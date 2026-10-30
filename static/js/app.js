/**
 * NOVA FIT - Main Application Logic
 * Brand: NOVA FIT | "Train Smarter. Live Stronger."
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

// App State
const state = {
  cart: [],
  user: {
    calories: 2180,
    calorieGoal: 2650,
    waterLiters: 2.8,
    waterGoal: 3.5,
    streak: 18
  },
  timerInterval: null,
  timerSeconds: 90
};

// Data Store Fallbacks (instant offline-first speed, synced with API)
const fallbackGyms = [
  {
    id: 1,
    name: "Nova Fit Metropolis Downtown",
    city: "New York",
    tier: "Black Label Elite",
    address: "450 Lexington Ave, New York, NY",
    rating: 4.9,
    amenities: ["Cryotherapy Chambers", "Olympic Lifting Platforms", "Infrared Saunas", "Hydro-Massage"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Nova Fit Beverly Hills Sanctuary",
    city: "Los Angeles",
    tier: "Black Label Elite",
    address: "9601 Wilshire Blvd, Beverly Hills, CA",
    rating: 5.0,
    amenities: ["Cold Plunge Pools", "Pilates Reformer Studio", "Private Valet", "Hyperice Lounge"],
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Nova Fit Mayfair Performance",
    city: "London",
    tier: "Executive",
    address: "14 Berkeley Square, London, UK",
    rating: 4.8,
    amenities: ["Eleiko Power Racks", "Biometric Testing Lab", "Steam Sanctuary", "Coworking Lounge"],
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Nova Fit Shibuya Cyber-Club",
    city: "Tokyo",
    tier: "Standard Pro",
    address: "21-1 Udagawacho, Shibuya, Tokyo",
    rating: 4.9,
    amenities: ["AI Form Analysis Cages", "Smart Keiser Racks", "Oxygen Pods", "Bio-Bar"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80"
  }
];

const fallbackTrainers = [
  {
    id: 1,
    name: "Marcus Vance",
    role: "Master Strength & Conditioning Coach",
    credentials: "CSCS, USAW Level 2, Ex-Olympic Prep",
    rate: "$160 / hr",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=900&q=80",
    quote: "Strength isn't accidental. It's engineered through disciplined execution."
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Functional Athlete & Mobility Director",
    credentials: "M.Sc. Kinesiology, FRCms, Pilates Master",
    rate: "$150 / hr",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=80",
    quote: "Move with purpose, recover with science, perform without limitation."
  },
  {
    id: 3,
    name: "Darius Stone",
    role: "High-Performance Body Recomposition Specialist",
    credentials: "ISSN Sports Nutritionist, NASM-CPT",
    rate: "$175 / hr",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    quote: "Your physique is the visual manifestation of your daily standard."
  }
];

const fallbackProducts = [
  {
    id: "p1",
    name: "Nova Fit Ultra-Isolate Whey (Burgundy Reserve)",
    category: "Supplements",
    price: 64.99,
    rating: 4.9,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80",
    description: "Cold-microfiltered 100% grass-fed whey isolate with DigeZyme enzymes and zero sugar."
  },
  {
    id: "p2",
    name: "Nova Fit Kinetic Grip Pro Lifting Straps",
    category: "Gear",
    price: 34.00,
    rating: 4.8,
    badge: "Competition Grade",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    description: "Reinforced heavy-duty silicone weave rated for up to 900 lbs deadlifts."
  },
  {
    id: "p3",
    name: "Nova Fit Thermal Pre-Ignition Matrix",
    category: "Supplements",
    price: 49.99,
    rating: 5.0,
    badge: "High Stimulant",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80",
    description: "Laser mental focus, 6000mg L-Citrulline, 3200mg Beta-Alanine, and Alpha GPC."
  },
  {
    id: "p4",
    name: "Nova Fit Carbon-Fiber Weighted Jump Rope",
    category: "Gear",
    price: 38.50,
    rating: 4.7,
    badge: "Cardio Tech",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    description: "Dual high-speed ceramic ball bearings with interchangeable weighted alloy handles."
  }
];

function initApp() {
  setupNavigation();
  loadGyms();
  loadTrainers();
  loadProducts();
  setupCalculators();
  setupRestTimer();
  setupAssistantChat();
  setupCart();
  setupAthleteDashboard();
}

// ----------------------------------------------------
// Navigation & Mobile Drawer
// ----------------------------------------------------
function setupNavigation() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    // Close mobile menu on link click
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add("active");
        } else {
          navItem.classList.remove("active");
        }
      }
    });
  });
}

// ----------------------------------------------------
// Gyms Loader & Filter
// ----------------------------------------------------
function loadGyms() {
  const container = document.getElementById("gymsGrid");
  if (!container) return;

  fetch("/api/gyms")
    .then(res => res.json())
    .catch(() => fallbackGyms)
    .then(data => {
      const gyms = data || fallbackGyms;
      renderGymCards(gyms, container);
    });

  // Filter tabs
  const filterBtns = document.querySelectorAll(".gym-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const city = btn.dataset.city;
      const allGyms = fallbackGyms;
      if (city === "all") {
        renderGymCards(allGyms, container);
      } else {
        const filtered = allGyms.filter(g => g.city.toLowerCase() === city.toLowerCase());
        renderGymCards(filtered, container);
      }
    });
  });
}

function renderGymCards(gyms, container) {
  container.innerHTML = gyms.map(gym => `
    <div class="gym-card">
      <div class="gym-media">
        <img src="${gym.image}" alt="${gym.name}" loading="lazy">
        <span class="gym-tier-badge">${gym.tier}</span>
        <div class="gym-rating">★ ${gym.rating}</div>
      </div>
      <div class="gym-body">
        <h3 class="gym-title">${gym.name}</h3>
        <p class="gym-address">📍 ${gym.address}</p>
        <div class="amenities-list">
          ${gym.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join("")}
        </div>
        <div class="gym-action">
          <button class="btn-card-primary" onclick="openGymPassModal('${gym.name}')">Claim 1-Day Pass</button>
        </div>
      </div>
    </div>
  `).join("");
}

window.openGymPassModal = function(gymName) {
  const modal = document.getElementById("bookingModal");
  const modalTitle = document.getElementById("bookingModalTitle");
  const modalTarget = document.getElementById("bookingTargetInput");
  if (modal && modalTitle && modalTarget) {
    modalTitle.innerText = `Claim Day Pass: ${gymName}`;
    modalTarget.value = gymName;
    modal.classList.add("active");
  }
};

// ----------------------------------------------------
// Trainers Loader
// ----------------------------------------------------
function loadTrainers() {
  const container = document.getElementById("trainersGrid");
  if (!container) return;

  fetch("/api/trainers")
    .then(res => res.json())
    .catch(() => fallbackTrainers)
    .then(trainers => {
      const list = trainers || fallbackTrainers;
      container.innerHTML = list.map(trainer => `
        <div class="trainer-card">
          <div class="trainer-photo-wrap">
            <img src="${trainer.image}" alt="${trainer.name}" loading="lazy">
            <div class="trainer-rate-badge">${trainer.rate}</div>
          </div>
          <div class="trainer-info">
            <h3 class="trainer-name">${trainer.name}</h3>
            <div class="trainer-role">${trainer.role}</div>
            <div class="trainer-credentials">${trainer.credentials}</div>
            <p class="trainer-quote">"${trainer.quote}"</p>
            <button class="btn-primary" onclick="openTrainerModal('${trainer.name}')" style="width: 100%; justify-content: center; padding: 12px;">
              Book 1-on-1 Consultation
            </button>
          </div>
        </div>
      `).join("");
    });
}

window.openTrainerModal = function(trainerName) {
  const modal = document.getElementById("bookingModal");
  const modalTitle = document.getElementById("bookingModalTitle");
  const modalTarget = document.getElementById("bookingTargetInput");
  if (modal && modalTitle && modalTarget) {
    modalTitle.innerText = `Book Session: ${trainerName}`;
    modalTarget.value = trainerName;
    modal.classList.add("active");
  }
};

// ----------------------------------------------------
// Fitness Shop Loader & Cart
// ----------------------------------------------------
function loadProducts() {
  const container = document.getElementById("shopGrid");
  if (!container) return;

  fetch("/api/products")
    .then(res => res.json())
    .catch(() => fallbackProducts)
    .then(products => {
      const list = products || fallbackProducts;
      container.innerHTML = list.map(p => `
        <div class="product-card">
          <div class="product-image-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <span class="product-badge">${p.badge}</span>
          </div>
          <div class="product-details">
            <span class="product-category">${p.category}</span>
            <h4 class="product-name">${p.name}</h4>
            <p class="product-desc">${p.description}</p>
            <div class="product-price-row">
              <span class="product-price">$${p.price.toFixed(2)}</span>
              <button class="btn-add-cart" onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      `).join("");
    });
}

function setupCart() {
  const cartBtn = document.getElementById("cartToggleBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartDrawerOverlay");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (cartBtn && cartDrawer && cartOverlay) {
    cartBtn.addEventListener("click", () => {
      cartDrawer.classList.add("active");
      cartOverlay.classList.add("active");
    });

    const closeCart = () => {
      cartDrawer.classList.remove("active");
      cartOverlay.classList.remove("active");
    };

    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (state.cart.length === 0) {
        showToast("Your cart is empty. Add elite Nova Fit gear first!");
        return;
      }
      showToast("Order placed successfully with NOVA FIT! Confirmation email sent.");
      state.cart = [];
      updateCartDisplay();
      if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
      }
    });
  }
}

window.addToCart = function(id, name, price, image) {
  const existing = state.cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id, name, price, image, qty: 1 });
  }
  updateCartDisplay();
  showToast(`Added "${name}" to your Nova Fit Cart.`);
};

function updateCartDisplay() {
  const countBadge = document.getElementById("cartCountBadge");
  const itemsContainer = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");

  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (countBadge) countBadge.innerText = totalItems;
  if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;

  if (itemsContainer) {
    if (state.cart.length === 0) {
      itemsContainer.innerHTML = `<p style="text-align: center; color: var(--color-soft-grey); margin-top: 40px;">Your Nova Fit cart is empty.</p>`;
    } else {
      itemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <p>$${item.price.toFixed(2)} × ${item.qty}</p>
          </div>
          <button style="background:none; border:none; color:#FF5C5C; cursor:pointer;" onclick="removeFromCart('${item.id}')">✕</button>
        </div>
      `).join("");
    }
  }
}

window.removeFromCart = function(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  updateCartDisplay();
};

// ----------------------------------------------------
// Interactive Rest Timer
// ----------------------------------------------------
function setupRestTimer() {
  const display = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("timerStartBtn");
  const resetBtn = document.getElementById("timerResetBtn");

  if (!display || !startBtn || !resetBtn) return;

  function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  startBtn.addEventListener("click", () => {
    if (state.timerInterval) {
      // Pause
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      startBtn.innerText = "Resume";
    } else {
      // Start
      startBtn.innerText = "Pause";
      state.timerInterval = setInterval(() => {
        if (state.timerSeconds > 0) {
          state.timerSeconds--;
          display.innerText = formatTime(state.timerSeconds);
        } else {
          clearInterval(state.timerInterval);
          state.timerInterval = null;
          startBtn.innerText = "Start";
          showToast("🔥 Rest period complete! Get ready for your next set.");
        }
      }, 1000);
    }
  });

  resetBtn.addEventListener("click", () => {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.timerSeconds = 90;
    display.innerText = formatTime(state.timerSeconds);
    startBtn.innerText = "Start Rest";
  });
}

// ----------------------------------------------------
// Interactive Calculators
// ----------------------------------------------------
function setupCalculators() {
  const tabs = document.querySelectorAll(".calc-tab-btn");
  const sections = {
    bmi: document.getElementById("calcViewBmi"),
    tdee: document.getElementById("calcViewTdee"),
    macro: document.getElementById("calcViewMacro"),
    onerm: document.getElementById("calcViewOnerm")
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.calc;

      Object.keys(sections).forEach(key => {
        if (sections[key]) {
          sections[key].style.display = key === target ? "grid" : "none";
        }
      });
    });
  });

  // 1. BMI Calculation
  const bmiWeight = document.getElementById("bmiWeight");
  const bmiHeight = document.getElementById("bmiHeight");
  const bmiScore = document.getElementById("bmiScore");
  const bmiStatus = document.getElementById("bmiStatus");

  function calcBmi() {
    const w = parseFloat(bmiWeight.value);
    const h = parseFloat(bmiHeight.value) / 100;
    if (w > 0 && h > 0) {
      const val = (w / (h * h)).toFixed(1);
      bmiScore.innerText = val;
      if (val < 18.5) bmiStatus.innerText = "Underweight";
      else if (val < 25) bmiStatus.innerText = "Normal Athletic Weight";
      else if (val < 30) bmiStatus.innerText = "Overweight / Hypertrophic";
      else bmiStatus.innerText = "Obese Category";
    }
  }

  if (bmiWeight && bmiHeight) {
    bmiWeight.addEventListener("input", calcBmi);
    bmiHeight.addEventListener("input", calcBmi);
  }

  // 2. TDEE Calculation
  const tdeeWeight = document.getElementById("tdeeWeight");
  const tdeeHeight = document.getElementById("tdeeHeight");
  const tdeeAge = document.getElementById("tdeeAge");
  const tdeeActivity = document.getElementById("tdeeActivity");
  const tdeeScore = document.getElementById("tdeeScore");

  function calcTdee() {
    const w = parseFloat(tdeeWeight.value);
    const h = parseFloat(tdeeHeight.value);
    const a = parseFloat(tdeeAge.value);
    const mult = parseFloat(tdeeActivity.value);

    if (w > 0 && h > 0 && a > 0) {
      // Mifflin-St Jeor formula
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      const tdee = Math.round(bmr * mult);
      tdeeScore.innerText = `${tdee} kcal`;
    }
  }

  [tdeeWeight, tdeeHeight, tdeeAge, tdeeActivity].forEach(el => {
    if (el) el.addEventListener("input", calcTdee);
  });

  // 3. Macro Split
  const macroCalories = document.getElementById("macroCalories");
  const macroGoal = document.getElementById("macroGoal");
  const macroProtein = document.getElementById("macroProtein");
  const macroCarbs = document.getElementById("macroCarbs");
  const macroFat = document.getElementById("macroFat");

  function calcMacros() {
    const cal = parseFloat(macroCalories.value) || 2500;
    const goal = macroGoal.value;
    let pPct = 0.3, cPct = 0.45, fPct = 0.25;

    if (goal === "hypertrophy") {
      pPct = 0.35; cPct = 0.45; fPct = 0.20;
    } else if (goal === "cutting") {
      pPct = 0.40; cPct = 0.35; fPct = 0.25;
    } else if (goal === "keto") {
      pPct = 0.25; cPct = 0.05; fPct = 0.70;
    }

    const pGrams = Math.round((cal * pPct) / 4);
    const cGrams = Math.round((cal * cPct) / 4);
    const fGrams = Math.round((cal * fPct) / 9);

    if (macroProtein) macroProtein.innerText = `${pGrams}g (${Math.round(pPct * 100)}%)`;
    if (macroCarbs) macroCarbs.innerText = `${cGrams}g (${Math.round(cPct * 100)}%)`;
    if (macroFat) macroFat.innerText = `${fGrams}g (${Math.round(fPct * 100)}%)`;
  }

  if (macroCalories && macroGoal) {
    macroCalories.addEventListener("input", calcMacros);
    macroGoal.addEventListener("change", calcMacros);
  }

  // 4. One-Rep Max (1RM)
  const onermWeight = document.getElementById("onermWeight");
  const onermReps = document.getElementById("onermReps");
  const onermScore = document.getElementById("onermScore");

  function calc1RM() {
    const w = parseFloat(onermWeight.value);
    const r = parseFloat(onermReps.value);
    if (w > 0 && r > 0) {
      // Epley Formula: 1RM = w * (1 + r / 30)
      const max = Math.round(w * (1 + r / 30));
      onermScore.innerText = `${max} kg`;
    }
  }

  if (onermWeight && onermReps) {
    onermWeight.addEventListener("input", calc1RM);
    onermReps.addEventListener("input", calc1RM);
  }
}

// ----------------------------------------------------
// AI Fitness Assistant: "Nova Fit AI Assistant" (Google Gemini)
// ----------------------------------------------------
let chatHistory = []; // Session multi-turn conversation history

function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Inline code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Lists and line breaks
  const lines = html.split("\n");
  let inList = false;
  let formattedLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        formattedLines.push("<ul style='margin: 8px 0 8px 18px; padding-left: 0;'>");
        inList = true;
      }
      formattedLines.push(`<li style='margin-bottom: 4px;'>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        formattedLines.push("</ul>");
        inList = false;
      }
      formattedLines.push(line);
    }
  }
  if (inList) formattedLines.push("</ul>");

  return formattedLines.join("<br>").replace(/<br><ul/g, "<ul").replace(/<\/ul><br>/g, "</ul>");
}

window.toggleFloatingChat = function(forceOpen) {
  const widget = document.getElementById("floatingChatWidget");
  const input = document.getElementById("floatingChatInput");
  if (!widget) return;

  if (forceOpen === true) {
    widget.classList.add("active");
  } else if (forceOpen === false) {
    widget.classList.remove("active");
  } else {
    widget.classList.toggle("active");
  }

  if (widget.classList.contains("active") && input) {
    setTimeout(() => input.focus(), 150);
    const msgBox = document.getElementById("floatingChatMessages");
    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
  }
};

window.sendQuickPrompt = function(promptText) {
  window.toggleFloatingChat(true);
  executeChatMessage(promptText, "floating");
};

window.clearConversationHistory = function() {
  chatHistory = [];
  const initialGreeting = `
    Hello Athlete! I am your <strong>Nova Fit AI Assistant</strong>, powered by Google Gemini.<br><br>
    Conversation history has been refreshed. What fitness, workout, or nutrition goal are we tackling next?
  `;
  
  const floatingBox = document.getElementById("floatingChatMessages");
  if (floatingBox) {
    floatingBox.innerHTML = `<div class="chat-bubble bot">${initialGreeting}</div>`;
  }
  
  const onPageBox = document.getElementById("aiChatBody");
  if (onPageBox) {
    onPageBox.innerHTML = `<div class="chat-bubble bot">${initialGreeting}</div>`;
  }

  showToast("Nova Fit AI Assistant conversation session cleared.");
};

function executeChatMessage(userText, source) {
  const text = (userText || "").trim();
  if (!text) return;

  const floatingMessages = document.getElementById("floatingChatMessages");
  const onPageMessages = document.getElementById("aiChatBody");
  const floatingInput = document.getElementById("floatingChatInput");
  const onPageInput = document.getElementById("aiChatInput");

  // Clear inputs
  if (floatingInput) floatingInput.value = "";
  if (onPageInput) onPageInput.value = "";

  // Append user bubble to UI
  const appendUserBubble = (container) => {
    if (!container) return;
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";
    bubble.innerHTML = formatMarkdown(text);
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  };

  appendUserBubble(floatingMessages);
  appendUserBubble(onPageMessages);

  // Append typing indicator
  const typingId = "typingIndicator_" + Date.now();
  const appendTyping = (container) => {
    if (!container) return;
    const ind = document.createElement("div");
    ind.className = "chat-bubble bot";
    ind.id = typingId;
    ind.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:0.8rem; color:var(--color-soft-grey);">Nova Fit AI Assistant is generating...</span>
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    container.appendChild(ind);
    container.scrollTop = container.scrollHeight;
  };

  appendTyping(floatingMessages);
  appendTyping(onPageMessages);

  // Post to backend with multi-turn history
  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      history: chatHistory
    })
  })
    .then(res => res.json())
    .then(data => {
      // Remove typing indicators
      document.querySelectorAll(`[id^="typingIndicator_"]`).forEach(el => el.remove());

      const botReply = data.reply || "Ready to guide your next fitness milestone!";
      
      // Update session history
      chatHistory.push({ role: "user", content: text });
      chatHistory.push({ role: "model", content: botReply });

      // Append bot bubble
      const appendBotBubble = (container) => {
        if (!container) return;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble bot";
        bubble.innerHTML = formatMarkdown(botReply);
        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
      };

      appendBotBubble(floatingMessages);
      appendBotBubble(onPageMessages);
    })
    .catch(err => {
      document.querySelectorAll(`[id^="typingIndicator_"]`).forEach(el => el.remove());

      const errReply = "⚠️ **Connection Notice**: Unable to contact the Nova Fit AI service. Please ensure the server is running and check your network connection.";
      
      const appendErrBubble = (container) => {
        if (!container) return;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble bot";
        bubble.innerHTML = formatMarkdown(errReply);
        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
      };

      appendErrBubble(floatingMessages);
      appendErrBubble(onPageMessages);
    });
}

function setupAssistantChat() {
  // On-page chat bindings
  const onPageInput = document.getElementById("aiChatInput");
  const onPageSend = document.getElementById("aiSendBtn");
  const onPageChips = document.querySelectorAll("#assistantSection .chip-btn");

  if (onPageSend && onPageInput) {
    onPageSend.addEventListener("click", () => {
      executeChatMessage(onPageInput.value, "onpage");
    });
    onPageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") executeChatMessage(onPageInput.value, "onpage");
    });
  }

  if (onPageChips) {
    onPageChips.forEach(chip => {
      chip.addEventListener("click", () => {
        executeChatMessage(chip.innerText, "onpage");
      });
    });
  }

  // Floating widget bindings
  const floatingBtn = document.getElementById("floatingAssistantBtn");
  const floatingWidget = document.getElementById("floatingChatWidget");
  const floatingClose = document.getElementById("floatingCloseBtn");
  const floatingClear = document.getElementById("floatingClearBtn");
  const floatingInput = document.getElementById("floatingChatInput");
  const floatingSend = document.getElementById("floatingChatSend");

  if (floatingBtn) {
    floatingBtn.addEventListener("click", () => {
      window.toggleFloatingChat();
    });
  }

  if (floatingClose) {
    floatingClose.addEventListener("click", () => {
      window.toggleFloatingChat(false);
    });
  }

  if (floatingClear) {
    floatingClear.addEventListener("click", () => {
      window.clearConversationHistory();
    });
  }

  if (floatingSend && floatingInput) {
    floatingSend.addEventListener("click", () => {
      executeChatMessage(floatingInput.value, "floating");
    });
    floatingInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") executeChatMessage(floatingInput.value, "floating");
    });
  }
}

// ----------------------------------------------------
// Athlete Dashboard Interactive Loggers
// ----------------------------------------------------
function setupAthleteDashboard() {
  const calVal = document.getElementById("dashCaloriesVal");
  const waterVal = document.getElementById("dashWaterVal");

  window.logCalories = function(amount) {
    state.user.calories += amount;
    if (calVal) calVal.innerText = `${state.user.calories} / ${state.user.calorieGoal} kcal`;
    showToast(`Logged ${amount > 0 ? "+" : ""}${amount} kcal to your Nova Fit daily record.`);
  };

  window.logWater = function(amount) {
    state.user.waterLiters = +(state.user.waterLiters + amount).toFixed(1);
    if (waterVal) waterVal.innerText = `${state.user.waterLiters} / ${state.user.waterGoal} L`;
    showToast(`Hydration updated: +${amount * 1000} ml.`);
  };
}

// ----------------------------------------------------
// Booking Modal & Generic Handlers
// ----------------------------------------------------
window.closeModal = function() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.remove("active");
};

window.confirmBooking = function(event) {
  event.preventDefault();
  const target = document.getElementById("bookingTargetInput").value;
  const date = document.getElementById("bookingDateInput").value;
  const time = document.getElementById("bookingTimeInput").value;

  fetch("/api/book-trainer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trainer_name: target, date, time })
  })
    .then(res => res.json())
    .catch(() => ({ status: "success", message: `Booking confirmed with ${target}!` }))
    .then(data => {
      closeModal();
      showToast(data.message || `Session booked with ${target}!`);
    });
};

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}
