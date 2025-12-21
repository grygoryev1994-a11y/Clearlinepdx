/* ==============================
   ClearlinePDX — app.js
   - Calculator + quote modal (mailto)
   - Reviews (localStorage)
================================ */

const CONFIG = {
  businessName: "ClearlinePDX",
  // TODO: поменяй на свой email
  quoteEmail: "santa.on@gmail.com",
  // TODO: поменяй на свой телефон (формат tel:+1XXXXXXXXXX)
  phoneTel: "+15035550123",
  phonePretty: "(503) 555-0123",
};

/* ---------- Helpers ---------- */
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function money(n){
  const v = Math.round(n);
  return `$${v.toLocaleString("en-US")}`;
}

function todayStr(){
  const d = new Date();
  return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

/* ==============================
   INDEX PAGE: Calculator
================================ */
function initIndex(){
  const calc = $("#calculator");
  if(!calc) return;

  // Wire call buttons
  $all('[data-call-btn]').forEach(btn => {
    btn.setAttribute("href", `tel:${CONFIG.phoneTel}`);
    btn.textContent = btn.textContent.replace("{{PHONE}}", CONFIG.phonePretty);
  });

  const el = {
    cleaningType: $("#cleaningType"),
    frequency: $("#frequency"),
    bedrooms: $("#bedrooms"),
    bathrooms: $("#bathrooms"),
    sqft: $("#sqft"),
    sqftLabel: $("#sqftLabel"),
    condition: $("#condition"),
    pets: $("#pets"),
    addonFridge: $("#addonFridge"),
    addonOven: $("#addonOven"),
    addonWindows: $("#addonWindows"),
    addonLaundry: $("#addonLaundry"),
    estPrice: $("#estPrice"),
    estTime: $("#estTime"),
    estNotes: $("#estNotes"),
    openQuote: $all('[data-open-quote]'),
  };

  // Base ranges (Portland-ish, tweak anytime)
  // We'll compute price as:
  // baseByBeds + bathAdj + sqftAdj + typeAdj + conditionAdj + petsAdj + frequencyDiscount + addons
  const baseByBeds = {
    studio: 105,
    1: 130,
    2: 160,
    3: 215,
    4: 275
  };

  const bathAdj = {
    1: 0,
    2: 18,
    3: 35
  };

  const typeAdj = {
    standard: 0,
    deep: 40,
    move: 55,
    office: 65
  };

  const conditionAdj = {
    normal: 0,
    messy: 35,
    heavy: 70
  };

  const petsAdj = {
    none: 0,
    cat: 10,
    dog: 18,
    multiple: 28
  };

  const frequencyMult = {
    onetime: 1.0,
    monthly: 0.93,
    biweekly: 0.88,
    weekly: 0.82
  };

  function estimateTimeHours(type, beds, baths, sqft, condition){
    // rough time model: start with 2h, add per bed/bath/sqft/type/condition
    let h = 2.0;
    const b = beds === "studio" ? 0 : parseInt(beds, 10);

    h += b * 0.9;
    h += (parseInt(baths,10) - 1) * 0.6;
    h += Math.max(0, (sqft - 900)) / 900 * 0.8;

    if(type === "deep") h += 1.2;
    if(type === "move") h += 1.5;
    if(type === "office") h += 1.4;

    if(condition === "messy") h += 0.7;
    if(condition === "heavy") h += 1.4;

    return clamp(h, 2.0, 10.5);
  }

  function compute(){
    const type = el.cleaningType.value;
    const freq = el.frequency.value;
    const beds = el.bedrooms.value; // "studio" | "1" | ...
    const baths = el.bathrooms.value; // "1" | "2" | "3"
    const sqft = parseInt(el.sqft.value, 10);
    const condition = el.condition.value;
    const pets = el.pets.value;

    el.sqftLabel.textContent = `${sqft} sq ft`;

    const base = baseByBeds[beds];
    const bAdj = bathAdj[baths] ?? 0;
    const sAdj = Math.max(0, sqft - 1200) / 600 * 18; // gentle ramp
    const tAdj = typeAdj[type] ?? 0;
    const cAdj = conditionAdj[condition] ?? 0;
    const pAdj = petsAdj[pets] ?? 0;

    const addons =
      (el.addonFridge.checked ? 25 : 0) +
      (el.addonOven.checked ? 25 : 0) +
      (el.addonWindows.checked ? 45 : 0) +
      (el.addonLaundry.checked ? 20 : 0);

    let subtotal = base + bAdj + sAdj + tAdj + cAdj + pAdj + addons;

    // Frequency discount
    subtotal *= (frequencyMult[freq] ?? 1);

    // Round to nice numbers
    subtotal = Math.round(subtotal / 5) * 5;

    // time estimate
    const hours = estimateTimeHours(type, beds, baths, sqft, condition);

    el.estPrice.textContent = money(subtotal);
    el.estTime.textContent = `${hours.toFixed(1)}–${(hours+0.7).toFixed(1)} hours`;
    el.estNotes.textContent =
      freq === "onetime"
        ? "Ballpark estimate. Final quote after details."
        : "Maintenance pricing estimate. Final quote after details.";

    return {
      type, freq, beds, baths, sqft, condition, pets, addons, subtotal, hours
    };
  }

  // Bind inputs
  $all("select, input", calc).forEach(x => x.addEventListener("change", compute));
  el.sqft.addEventListener("input", compute);

  // Quote modal
  const modal = $("#quoteModal");
  const backdrop = $("#quoteBackdrop");
  const closeBtns = $all("[data-close-modal]");

  function openModal(){
    const data = compute();

    // Pre-fill quote form with estimate
    $("#q_estimate").value = money(data.subtotal);
    $("#q_details").value =
      `Type: ${data.type}\nFrequency: ${data.freq}\nBeds: ${data.beds}\nBaths: ${data.baths}\nSqft: ${data.sqft}\nCondition: ${data.condition}\nPets: ${data.pets}\nAdd-ons: ${data.addons}\nEstimated time: ${data.hours.toFixed(1)}–${(data.hours+0.7).toFixed(1)} hours`;

    backdrop.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(){
    backdrop.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  el.openQuote.forEach(btn => btn.addEventListener("click", openModal));
  closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
  backdrop.addEventListener("click", (e) => {
    if(e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && backdrop.style.display === "flex") closeModal();
  });

  // Send quote via mailto
  $("#quoteForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#q_name").value.trim();
    const phone = $("#q_phone").value.trim();
    const email = $("#q_email").value.trim();
    const address = $("#q_address").value.trim();
    const notes = $("#q_notes").value.trim();
    const estimate = $("#q_estimate").value.trim();
    const details = $("#q_details").value.trim();

    const subject = encodeURIComponent(`[${CONFIG.businessName}] Quote Request — ${name || "New lead"}`);
    const body = encodeURIComponent(
`New quote request

Name: ${name}
Phone: ${phone}
Email: ${email}
Address: ${address}

Estimate shown: ${estimate}

Details:
${details}

Customer notes:
${notes}

Sent: ${new Date().toString()}
`
    );

    // Opens user's email client
    window.location.href = `mailto:${CONFIG.quoteEmail}?subject=${subject}&body=${body}`;
    closeModal();
  });

  // Init
  compute();
}

/* ==============================
   REVIEWS PAGE
================================ */
const REV_KEY = "clearline_reviews_v1";

function loadReviews(){
  try{
    const raw = localStorage.getItem(REV_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch{
    return null;
  }
}

function saveReviews(list){
  localStorage.setItem(REV_KEY, JSON.stringify(list));
}

function seedReviewsIfEmpty(){
  const existing = loadReviews();
  if(existing && Array.isArray(existing) && existing.length) return;

  const seed = [
    {
      name: "Jordan M.",
      rating: 5,
      text: "Fast, on time, and actually detailed. Bathrooms looked brand new.",
      date: new Date().toISOString()
    },
    {
      name: "Emily R.",
      rating: 5,
      text: "Booked a deep clean before guests. Worth it — spotless kitchen and floors.",
      date: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    {
      name: "Chris T.",
      rating: 4,
      text: "Solid work and clear pricing. Scheduling was easy.",
      date: new Date(Date.now() - 86400000 * 20).toISOString()
    }
  ];

  saveReviews(seed);
}

function renderStars(n){
  const full = "★".repeat(n);
  const empty = "☆".repeat(5 - n);
  return `<span class="stars" aria-label="${n} out of 5">${full}${empty}</span>`;
}

function renderReviews(){
  const wrap = $("#reviewsList");
  if(!wrap) return;

  const list = loadReviews() || [];
  if(!list.length){
    wrap.innerHTML = `<div class="panel"><b>No reviews yet.</b><div class="small-note">Be the first — don’t be shy 😄</div></div>`;
    return;
  }

  // Newest first
  const sorted = [...list].sort((a,b) => new Date(b.date) - new Date(a.date));

  wrap.innerHTML = `
    <div class="review-grid">
      ${sorted.map(r => {
        const dt = new Date(r.date);
        const dateStr = dt.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });
        const safeText = (r.text || "").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        const safeName = (r.name || "Anonymous").replace(/</g,"&lt;").replace(/>/g,"&gt;");

        return `
          <div class="review-card">
            <div class="review-head">
              <div>
                <div class="review-name">${safeName}</div>
                ${renderStars(r.rating)}
              </div>
              <div class="review-date">${dateStr}</div>
            </div>
            <div class="review-text">${safeText}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  // Summary
  const avg = sorted.reduce((s,r)=>s+r.rating,0) / sorted.length;
  $("#reviewSummary").textContent = `${avg.toFixed(1)} / 5 (${sorted.length} review${sorted.length===1?"":"s"})`;
}

function initReviews(){
  const page = $("#reviewsPage");
  if(!page) return;

  seedReviewsIfEmpty();
  renderReviews();

  const form = $("#newReviewForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#r_name").value.trim() || "Anonymous";
    const rating = parseInt($("#r_rating").value, 10);
    const text = $("#r_text").value.trim();

    if(!text || text.length < 10){
      alert("Напиши чуть подробнее (хотя бы 10 символов), а то это не отзыв, а вздох.");
      return;
    }

    const list = loadReviews() || [];
    list.push({
      name,
      rating: clamp(rating, 1, 5),
      text,
      date: new Date().toISOString()
    });

    saveReviews(list);
    form.reset();
    renderReviews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Optional: clear reviews (for you/admin)
  const clearBtn = $("#clearReviews");
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      if(confirm("Стереть все отзывы в этом браузере?")){
        localStorage.removeItem(REV_KEY);
        seedReviewsIfEmpty();
        renderReviews();
      }
    });
  }
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initIndex();
  initReviews();

  // Update nav call buttons everywhere
  $all('[data-call-btn]').forEach(btn => {
    btn.setAttribute("href", `tel:${CONFIG.phoneTel}`);
  });

  // Update places where we show phone pretty
  $all("[data-phone]").forEach(el => el.textContent = CONFIG.phonePretty);
});
