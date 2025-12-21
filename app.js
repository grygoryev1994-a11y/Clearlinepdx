/* ClearlinePDX — app.js (hardened)
   - If anything breaks, error shows inside estNotes (no silent failures)
   - Add-ons trimmed per request
*/

const CONFIG = {
  businessName: "ClearlinePDX",
  quoteEmail: "santa.on@gmail.com",
  phoneTel: "+15035550123",
  phonePretty: "(503) 555-0123"
};

function $(id){ return document.getElementById(id); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function money(n){ return `$${Math.round(n).toLocaleString("en-US")}`; }

function setSafeText(id, txt){
  const el = $(id);
  if(el) el.textContent = txt;
}

function wireCallButtons(){
  $all("[data-call-btn]").forEach(a => a.href = `tel:${CONFIG.phoneTel}`);
  $all("[data-phone]").forEach(s => s.textContent = CONFIG.phonePretty);
}

function initCalculator(){
  // If calculator section isn't present, exit quietly
  const calcRoot = $("calculator");
  if(!calcRoot) return;

  // Grab required UI nodes
  const ids = [
    "cleaningType","frequency","bedrooms","bathrooms","sqft","sqftLabel",
    "condition","pets","estPrice","estTime","estNotes"
  ];

  const missing = ids.filter(id => !$(id));
  if(missing.length){
    setSafeText("estNotes", `UI missing: ${missing.join(", ")} (check IDs in index.html)`);
    return;
  }

  // Add-ons (must match HTML)
  const addonIds = [
    "addonFridge","addonOven","addonMicrowave","addonCabinets",
    "addonLaundry","addonDish","addonExtraDirty","addonPostConstruction"
  ];

  // Pricing anchors (ballpark)
  const baseByBeds = { studio: 105, 1: 130, 2: 160, 3: 215, 4: 270 };
  const bathAdj = { 1: 0, 2: 18, 3: 35 };
  const typeAdj = { standard: 0, deep: 40, move: 55, office: 65 };
  const conditionAdj = { normal: 0, messy: 30, heavy: 70 };
  const petsAdj = { none: 0, cat: 10, dog: 18, multiple: 28 };
  const frequencyMult = { onetime: 1.0, monthly: 0.93, biweekly: 0.88, weekly: 0.82 };

  // Trimmed add-ons
  const ADDONS = [
    { id:"addonFridge",           price:25, time:0.30, label:"Inside fridge" },
    { id:"addonOven",             price:30, time:0.35, label:"Inside oven" },
    { id:"addonMicrowave",        price:10, time:0.12, label:"Inside microwave" },
    { id:"addonCabinets",         price:35, time:0.45, label:"Inside cabinets" },
    { id:"addonLaundry",          price:25, time:0.30, label:"Blinds / window tracks" },
    { id:"addonDish",             price:25, time:0.35, label:"Dishes" },
    { id:"addonExtraDirty",       price:60, time:0.80, label:"Extra dirty / heavy buildup" },
    { id:"addonPostConstruction", price:80, time:1.10, label:"Post-construction" }
  ];

  function estimateBaseHours(type, beds, baths, sqft, condition){
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
    try{
      const type = $("cleaningType").value;
      const freq = $("frequency").value;
      const beds = $("bedrooms").value;
      const baths = $("bathrooms").value;
      const sqft = parseInt($("sqft").value, 10);
      const condition = $("condition").value;
      const pets = $("pets").value;

      $("sqftLabel").textContent = `${sqft} sq ft`;

      const base = baseByBeds[beds] ?? 140;
      const bAdj = bathAdj[baths] ?? 0;
      const sAdj = Math.max(0, sqft - 1200) / 600 * 18;
      const tAdj = typeAdj[type] ?? 0;
      const cAdj = conditionAdj[condition] ?? 0;
      const pAdj = petsAdj[pets] ?? 0;

      let addonsPrice = 0;
      let addonsTime = 0;
      const picked = [];

      for(const a of ADDONS){
        const node = $(a.id);
        if(node && node.checked){
          addonsPrice += a.price;
          addonsTime += a.time;
          picked.push(`${a.label} (+$${a.price})`);
        }
      }

      let subtotal = base + bAdj + sAdj + tAdj + cAdj + pAdj + addonsPrice;
      subtotal *= (frequencyMult[freq] ?? 1);
      subtotal = Math.round(subtotal / 5) * 5;

      const baseHours = estimateBaseHours(type, beds, baths, sqft, condition);
      const hours = clamp(baseHours + addonsTime, 2.0, 12.5);

      $("estPrice").textContent = money(subtotal);
      $("estTime").textContent = `${hours.toFixed(1)}–${(hours+0.7).toFixed(1)} hours`;

      const freqNote = (freq === "onetime")
        ? "One-time estimate. Final quote after details."
        : "Maintenance estimate. Final quote after details.";

      const addonsNote = picked.length ? `Add-ons: ${picked.join(", ")}` : "No add-ons selected.";
      $("estNotes").textContent = `${freqNote} ${addonsNote}`;

      return { type, freq, beds, baths, sqft, condition, pets, subtotal, hours, addonsNote };
    }catch(err){
      // Show the error on the page so we don’t guess in the dark
      setSafeText("estPrice", "$—");
      setSafeText("estTime", "—");
      setSafeText("estNotes", `Calculator error: ${err?.message || err}`);
      throw err;
    }
  }

  // Bind all inputs (including add-ons)
  $all("select, input", calcRoot).forEach(el => {
    el.addEventListener("change", compute);
  });
  $("sqft").addEventListener("input", compute);

  // Quote modal wiring
  const backdrop = $("quoteBackdrop");
  const modal = $("quoteModal");
  const openBtns = $all("[data-open-quote]");
  const closeBtns = $all("[data-close-modal]");

  function openModal(){
    const data = compute();
    const qEst = $("q_estimate");
    const qDet = $("q_details");
    if(qEst) qEst.value = money(data.subtotal);
    if(qDet) qDet.value =
`Type: ${data.type}
Frequency: ${data.freq}
Beds: ${data.beds}
Baths: ${data.baths}
Sqft: ${data.sqft}
Condition: ${data.condition}
Pets: ${data.pets}
Estimated time: ${data.hours.toFixed(1)}–${(data.hours+0.7).toFixed(1)} hours
${data.addonsNote}`;

    if(backdrop){ backdrop.style.display = "flex"; }
    if(modal){ modal.setAttribute("aria-hidden","false"); }
  }

  function closeModal(){
    if(backdrop){ backdrop.style.display = "none"; }
    if(modal){ modal.setAttribute("aria-hidden","true"); }
  }

  openBtns.forEach(b => b.addEventListener("click", openModal));
  closeBtns.forEach(b => b.addEventListener("click", closeModal));
  if(backdrop){
    backdrop.addEventListener("click", (e)=>{ if(e.target === backdrop) closeModal(); });
  }
  document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape" && backdrop && backdrop.style.display === "flex") closeModal();
  });

  const quoteForm = $("quoteForm");
  if(quoteForm){
    quoteForm.addEventListener("submit",(e)=>{
      e.preventDefault();

      const name = ($("q_name")?.value || "").trim();
      const phone = ($("q_phone")?.value || "").trim();
      const email = ($("q_email")?.value || "").trim();
      const address = ($("q_address")?.value || "").trim();
      const notes = ($("q_notes")?.value || "").trim();
      const estimate = ($("q_estimate")?.value || "").trim();
      const details = ($("q_details")?.value || "").trim();

      const subject = encodeURIComponent(`[${CONFIG.businessName}] Quote Request — ${name || "New lead"}`);
      const body = encodeURIComponent(
`New quote request

Name: ${name}
Phone: ${phone}
Email: ${email}
Address/Area: ${address}

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
  }

  // First render
  compute();
}

document.addEventListener("DOMContentLoaded", ()=>{
  wireCallButtons();
  initCalculator();
});
