// assets/js/main.js
(function(){
  // ====== CONFIG (EDIT THESE) ======
  const COMPANY_PHONE = "+15035551234";        // <-- put your number
  const COMPANY_EMAIL = "santa.on@gmail.com";  // <-- put your email

  // Add-on prices (single source of truth)
  const ADDON_PRICES = {
    fridge: 25,
    oven: 30,
    windows: 20,
    petHair: 20
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function money(n){
    return `$${Math.round(n).toLocaleString("en-US")}`;
  }

  // ====== Call buttons ======
  $$("[data-call]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      window.location.href = `tel:${COMPANY_PHONE}`;
    });
  });

  // ====== Modal ======
  const overlay = $("#quoteModal");
  const openBtns = $$("[data-open-quote]");
  const closeBtns = $$("[data-close-quote]");

  function openModal(){
    if(!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    if(!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtns.forEach(b=> b.addEventListener("click", openModal));
  closeBtns.forEach(b=> b.addEventListener("click", closeModal));

  if(overlay){
    overlay.addEventListener("click", (e)=>{
      if(e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e)=>{
      if(e.key === "Escape") closeModal();
    });
  }

  // ====== Calculator elements ======
  const calc = {
    type: $("#cleaningType"),
    freq: $("#frequency"),
    beds: $("#bedrooms"),
    baths: $("#bathrooms"),
    sqft: $("#sqft"),
    sqftLabel: $("#sqftLabel"),
    condition: $("#condition"),
    pets: $("#pets"),
    totalEl: $("#estimateTotal"),
    detailsEl: $("#estimateDetails"),

    addonFridge: $("#addonFridge"),
    addonOven: $("#addonOven"),
    addonWindows: $("#addonWindows"),
    addonPetHair: $("#addonPetHair"),
  };

  // Paint prices into UI (so it never “disappears”)
  function renderAddonPrices(){
    const nodes = $$("[data-addon-price]");
    nodes.forEach(n=>{
      const key = n.getAttribute("data-addon-price");
      if(!key || !(key in ADDON_PRICES)) return;
      n.textContent = `+$${ADDON_PRICES[key]}`;
    });
  }
  renderAddonPrices();

  function getBaseRate({beds, baths}){
    const matrix = {
      "0": { "1": 105, "2": 125, "3": 145 },
      "1": { "1": 130, "2": 155, "3": 180 },
      "2": { "1": 165, "2": 195, "3": 225 },
      "3": { "1": 210, "2": 245, "3": 275 },
      "4": { "1": 255, "2": 295, "3": 335 },
    };
    const b = String(beds);
    const ba = String(baths);
    if(!matrix[b] || !matrix[b][ba]) return 200;
    return matrix[b][ba];
  }

  function getSelectedAddons(){
    const addons = [];
    if(calc.addonFridge?.checked) addons.push({key:"fridge", label:"fridge", price:ADDON_PRICES.fridge});
    if(calc.addonOven?.checked) addons.push({key:"oven", label:"oven", price:ADDON_PRICES.oven});
    if(calc.addonWindows?.checked) addons.push({key:"windows", label:"windows", price:ADDON_PRICES.windows});
    if(calc.addonPetHair?.checked) addons.push({key:"petHair", label:"pet hair", price:ADDON_PRICES.petHair});
    return addons;
  }

  function computeEstimate(){
    if(!calc.totalEl) return;

    const cleaningType = calc.type?.value || "standard";
    const frequency   = calc.freq?.value || "one-time";
    const beds        = Number(calc.beds?.value || 1);
    const baths       = Number(calc.baths?.value || 1);
    const sqft        = Number(calc.sqft?.value || 1800);
    const condition   = calc.condition?.value || "normal";
    const pets        = calc.pets?.value || "no";

    let total = getBaseRate({beds, baths});

    // sqft adjustment
    const delta = sqft - 1500;
    const steps = delta / 500;
    total += steps > 0 ? steps * 12 : Math.max(steps * 8, -20);

    // type multipliers
    if(cleaningType === "deep") total *= 1.30;
    if(cleaningType === "move") total *= 1.55;

    // frequency discounts
    if(frequency === "weekly") total *= 0.82;
    if(frequency === "biweekly") total *= 0.88;
    if(frequency === "monthly") total *= 0.95;

    // condition add-ons
    if(condition === "heavy") total += 35;
    if(condition === "very-heavy") total += 65;

    // pets selector
    if(pets === "yes") total += 20;

    // add-ons (checkboxes)
    const addons = getSelectedAddons();
    addons.forEach(a => { total += a.price; });

    // clamp + round
    total = Math.max(95, Math.min(total, 900));
    total = Math.round(total);

    calc.totalEl.textContent = money(total);

    if(calc.detailsEl){
      const lines = [
        `${beds} bed / ${baths} bath`,
        `${sqft} sq ft`,
        `${cleaningType} • ${frequency}`,
        `${condition}${pets === "yes" ? " • pets" : ""}`
      ];
      if(addons.length){
        lines.push(`addons: ${addons.map(a=>a.label).join(", ")}`);
      }
      calc.detailsEl.textContent = lines.join(" · ");
    }

    const hidden = $("#quotePrefill");
    if(hidden){
      hidden.value =
        `Estimate: ${money(total)} | ` +
        `${beds} bed / ${baths} bath | ${sqft} sq ft | ` +
        `${cleaningType} | ${frequency} | condition: ${condition} | pets: ${pets}` +
        (addons.length ? ` | addons: ${addons.map(a=>`${a.label}+$${a.price}`).join(", ")}` : "");
    }
  }

  if(calc.sqft && calc.sqftLabel){
    const updateSqft = ()=> calc.sqftLabel.textContent = `${calc.sqft.value} sq ft`;
    calc.sqft.addEventListener("input", ()=>{
      updateSqft();
      computeEstimate();
    });
    updateSqft();
  }

  [calc.type, calc.freq, calc.beds, calc.baths, calc.condition, calc.pets].forEach(el=>{
    if(!el) return;
    el.addEventListener("change", computeEstimate);
  });

  [calc.addonFridge, calc.addonOven, calc.addonWindows, calc.addonPetHair].forEach(el=>{
    if(!el) return;
    el.addEventListener("change", computeEstimate);
  });

  computeEstimate();

  // ====== Quote form -> mailto ======
  const form = $("#quoteForm");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();

      const name = $("#qName")?.value.trim() || "";
      const phone = $("#qPhone")?.value.trim() || "";
      const email = $("#qEmail")?.value.trim() || "";
      const address = $("#qAddress")?.value.trim() || "";
      const message = $("#qMessage")?.value.trim() || "";
      const prefill = $("#quotePrefill")?.value || "";

      const subject = encodeURIComponent(`ClearlinePDX Quote Request — ${name || "New lead"}`);
      const body = encodeURIComponent(
`Name: ${name}
Phone: ${phone}
Email: ${email}
Address: ${address}

${prefill}

Message:
${message}`
      );

      window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
      closeModal();
      form.reset();

      [calc.addonFridge, calc.addonOven, calc.addonWindows, calc.addonPetHair].forEach(el=>{
        if(el) el.checked = false;
      });
      computeEstimate();
    });
  }

})();
