/* ClearlinePDX — app.js
   - Calculator (rich like original)
   - Quote modal (mailto)
   - Reviews (localStorage)
*/

const CONFIG = {
  businessName: "ClearlinePDX",
  quoteEmail: "santa.on@gmail.com", // поменяй на свой
  phoneTel: "+15035550123",         // поменяй на свой
  phonePretty: "(503) 555-0123"
};

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function money(n){
  const v = Math.round(n);
  return `$${v.toLocaleString("en-US")}`;
}

/* ---------- Call buttons ---------- */
function wireCallButtons(){
  $all("[data-call-btn]").forEach(a=>{
    a.href = `tel:${CONFIG.phoneTel}`;
  });
  $all("[data-phone]").forEach(s=>{
    s.textContent = CONFIG.phonePretty;
  });
}

/* ==============================
   INDEX: Calculator + Quote Modal
================================ */
function initIndex(){
  const calc = $("#calculator");
  if(!calc) return;

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
    openQuote: $all('[data-open-quote]')
  };

  // Pricing model similar to what you had: base by bedrooms + adders
  const baseByBeds = { studio: 105, 1: 130, 2: 160, 3: 215, 4: 275 };
  const bathAdj = { 1: 0, 2: 18, 3: 35 };
  const typeAdj = { standard: 0, deep: 40, move: 55, office: 65 };
  const conditionAdj = { normal: 0, messy: 35, heavy: 70 };
  const petsAdj = { none: 0, cat: 10, dog: 18, multiple: 28 };
  const frequencyMult = { onetime: 1.0, monthly: 0.93, biweekly: 0.88, weekly: 0.82 };

  function estimateTimeHours(type, beds, baths, sqft, condition){
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
    const beds = el.bedrooms.value;
    const baths = el.bathrooms.value;
    const sqft = parseInt(el.sqft.value, 10);
    const condition = el.condition.value;
    const pets = el.pets.value;

    el.sqftLabel.textContent = `${sqft} sq ft`;

    const base = baseByBeds[beds] ?? 140;
    const bAdj = bathAdj[baths] ?? 0;
    const sAdj = Math.max(0, sqft - 1200) / 600 * 18;
    const tAdj = typeAdj[type] ?? 0;
    const cAdj = conditionAdj[condition] ?? 0;
    const pAdj = petsAdj[pets] ?? 0;

    const addons =
      (el.addonFridge.checked ? 25 : 0) +
      (el.addonOven.checked ? 25 : 0) +
      (el.addonWindows.checked ? 45 : 0) +
      (el.addonLaundry.checked ? 20 : 0);

    let subtotal = base + bAdj + sAdj + tAdj + cAdj + pAdj + addons;
    subtotal *= (frequencyMult[freq] ?? 1);
    subtotal = Math.round(subtotal / 5) * 5;

    const hours = estimateTimeHours(type, beds, baths, sqft, condition);

    el.estPrice.textContent = money(subtotal);
    el.estTime.textContent = `${hours.toFixed(1)}–${(hours+0.7).toFixed(1)} hours`;
    el.estNotes.textContent = (freq === "onetime")
      ? "Ballpark estimate. Final quote after details."
      : "Maintenance estimate. Final quote after details.";

    return { type, freq, beds, baths, sqft, condition, pets, addons, subtotal, hours };
  }

  // Bind
  $all("select, input", calc).forEach(x => x.addEventListener("change", compute));
  el.sqft.addEventListener("input", compute);

  // Modal
  const backdrop = $("#quoteBackdrop");
  const modal = $("#quoteModal");
  const closeBtns = $all("[data-close-modal]");

  function openModal(){
    const data = compute();
    $("#q_estimate").value = money(data.subtotal);
    $("#q_details").value =
`Type: ${data.type}
Frequency: ${data.freq}
Beds: ${data.beds}
Baths: ${data.baths}
Sqft: ${data.sqft}
Condition: ${data.condition}
Pets: ${data.pets}
Add-ons: ${data.addons}
Estimated time: ${data.hours.toFixed(1)}–${(data.hours+0.7).toFixed(1)} hours`;

    backdrop.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(){
    backdrop.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  el.openQuote.forEach(btn => btn.addEventListener("click", openModal));
  closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
  backdrop.addEventListener("click", (e) => { if(e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape" && backdrop.style.display === "flex") closeModal(); });

  // mailto submit
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
`
    );

    window.location.href = `mailto:${CONFIG.quoteEmail}?subject=${subject}&body=${body}`;
    closeModal();
  });

  compute();
}

/* ==============================
   REVIEWS: localStorage
================================ */
const REV_KEY = "clearline_reviews_v1";

function loadReviews(){
  try{ return JSON.parse(localStorage.getItem(REV_KEY) || "[]"); }
  catch{ return []; }
}
function saveReviews(list){
  localStorage.setItem(REV_KEY, JSON.stringify(list));
}
function seedReviews(){
  const list = loadReviews();
  if(list.length) return;
  saveReviews([
    { name:"Jordan M.", rating:5, text:"Fast, on time, and detailed. Bathrooms looked brand new.", date:new Date().toISOString() },
    { name:"Emily R.", rating:5, text:"Deep clean before guests — spotless kitchen and floors.", date:new Date(Date.now()-86400000*8).toISOString() },
    { name:"Chris T.", rating:4, text:"Clear pricing and easy scheduling. Solid work.", date:new Date(Date.now()-86400000*20).toISOString() }
  ]);
}
function renderStars(n){
  const full = "★".repeat(n);
  const empty = "☆".repeat(5-n);
  return `<span class="stars" aria-label="${n} out of 5">${full}${empty}</span>`;
}
function renderReviews(){
  const wrap = $("#reviewsList");
  if(!wrap) return;

  const list = loadReviews().sort((a,b)=>new Date(b.date)-new Date(a.date));
  const avg = list.reduce((s,r)=>s+r.rating,0) / (list.length || 1);
  $("#reviewSummary").textContent = `${avg.toFixed(1)} / 5 (${list.length})`;

  wrap.innerHTML = `
    <div class="review-grid">
      ${list.map(r=>{
        const dt = new Date(r.date);
        const dateStr = dt.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"2-digit"});
        const safeName = (r.name||"Anonymous").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        const safeText = (r.text||"").replace(/</g,"&lt;").replace(/>/g,"&gt;");
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
}
function initReviews(){
  if(!$("#reviewsPage")) return;

  seedReviews();
  renderReviews();

  $("#newReviewForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const name = $("#r_name").value.trim() || "Anonymous";
    const rating = clamp(parseInt($("#r_rating").value,10),1,5);
    const text = $("#r_text").value.trim();

    if(text.length < 10){
      alert("Напиши чуть подробнее (минимум 10 символов).");
      return;
    }
    const list = loadReviews();
    list.push({ name, rating, text, date:new Date().toISOString() });
    saveReviews(list);
    e.target.reset();
    renderReviews();
    window.scrollTo({top:0, behavior:"smooth"});
  });
}

/* Boot */
document.addEventListener("DOMContentLoaded", ()=>{
  wireCallButtons();
  initIndex();
  initReviews();
});
