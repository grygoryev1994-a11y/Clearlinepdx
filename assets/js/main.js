(function(){
  const COMPANY_PHONE = "+15035551234";        // <- поставь свой
  const COMPANY_EMAIL = "santa.on@gmail.com";  // <- поставь свой

  const ADDON_PRICES = {
    fridge: 25,
    oven: 30,
    cabinets: 35,
    microwave: 15
  };

  const $ = (s, r=document)=> r.querySelector(s);
  const $$ = (s, r=document)=> Array.from(r.querySelectorAll(s));
  const money = (n)=> `$${Math.round(n).toLocaleString("en-US")}`;

  /* =========================
     Call buttons
  ========================= */
  $$("[data-call]").forEach(b=>{
    b.addEventListener("click", ()=> window.location.href = `tel:${COMPANY_PHONE}`);
  });

  /* =========================
     Mobile menu (burger)
  ========================= */
  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobileNav");
  const mobileClose = $(".mobile-close");
  const mobileLinks = mobileNav ? $$("a", mobileNav) : [];

  function openMobileNav(){
    if(!mobileNav || !navToggle) return;
    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav(){
    if(!mobileNav || !navToggle) return;
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if(navToggle && mobileNav){
    navToggle.addEventListener("click", ()=>{
      const isOpen = mobileNav.classList.contains("open");
      isOpen ? closeMobileNav() : openMobileNav();
    });

    if(mobileClose) mobileClose.addEventListener("click", closeMobileNav);

    // close on overlay click
    mobileNav.addEventListener("click", (e)=>{
      if(e.target === mobileNav) closeMobileNav();
    });

    // close on link click (and allow anchor navigation)
    mobileLinks.forEach(a=>{
      a.addEventListener("click", ()=> closeMobileNav());
    });

    document.addEventListener("keydown", (e)=>{
      if(e.key === "Escape") closeMobileNav();
    });
  }

  /* =========================
     Quote Modal
  ========================= */
  const overlay = $("#quoteModal");
  const openBtns = $$("[data-open-quote]");
  const closeBtns = $$("[data-close-quote]");

  function openModal(){
    if(!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // prefill estimate into message
    const msg = $("#qMessage");
    const prefill = $("#quotePrefill")?.value || "";
    if(msg && prefill && !msg.value.includes("Estimate:")){
      msg.value = (msg.value.trim() ? msg.value.trim() + "\n\n" : "") + prefill;
    }
  }
  function closeModal(){
    if(!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtns.forEach(b=> b.addEventListener("click", ()=>{
    // If mobile menu is open, close it before opening modal
    closeMobileNav();
    openModal();
  }));
  closeBtns.forEach(b=> b.addEventListener("click", closeModal));

  if(overlay){
    overlay.addEventListener("click", (e)=>{ if(e.target===overlay) closeModal(); });
    document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });
  }

  /* =========================
     Calculator
  ========================= */
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
    addonCabinets: $("#addonCabinets"),
    addonMicrowave: $("#addonMicrowave"),
  };

  // Paint add-on prices
  $$("[data-addon-price]").forEach(n=>{
    const key = n.getAttribute("data-addon-price");
    if(key && ADDON_PRICES[key] != null) n.textContent = `+$${ADDON_PRICES[key]}`;
  });

  function getBaseRate({beds,baths}){
    const m = {
      "0": { "1": 105, "2": 125, "3": 145 },
      "1": { "1": 130, "2": 155, "3": 180 },
      "2": { "1": 165, "2": 195, "3": 225 },
      "3": { "1": 210, "2": 245, "3": 275 },
      "4": { "1": 255, "2": 295, "3": 335 },
    };
    const b = String(beds), ba = String(baths);
    return (m[b] && m[b][ba]) ? m[b][ba] : 200;
  }

  function selectedAddons(){
    const a = [];
    if(calc.addonFridge?.checked) a.push(["fridge", ADDON_PRICES.fridge]);
    if(calc.addonOven?.checked) a.push(["oven", ADDON_PRICES.oven]);
    if(calc.addonCabinets?.checked) a.push(["cabinets", ADDON_PRICES.cabinets]);
    if(calc.addonMicrowave?.checked) a.push(["microwave", ADDON_PRICES.microwave]);
    return a;
  }

  function compute(){
    if(!calc.totalEl) return;

    const cleaningType = calc.type?.value || "standard";
    const frequency    = calc.freq?.value || "one-time";
    const beds         = Number(calc.beds?.value || 1);
    const baths        = Number(calc.baths?.value || 1);
    const sqft         = Number(calc.sqft?.value || 1800);
    const condition    = calc.condition?.value || "normal";
    const pets         = calc.pets?.value || "no";

    let total = getBaseRate({beds,baths});

    // sqft adjust
    const delta = sqft - 1500;
    const steps = delta / 500;
    total += steps > 0 ? steps * 12 : Math.max(steps * 8, -20);

    // type
    if(cleaningType==="deep") total *= 1.30;
    if(cleaningType==="move") total *= 1.55;

    // frequency discounts
    if(frequency==="weekly") total *= 0.82;
    if(frequency==="biweekly") total *= 0.88;
    if(frequency==="monthly") total *= 0.95;

    // condition
    if(condition==="heavy") total += 35;
    if(condition==="very-heavy") total += 65;

    // pets (only here)
    if(pets==="yes") total += 20;

    // add-ons
    const addons = selectedAddons();
    addons.forEach(([,price])=> total += price);

    total = Math.max(95, Math.min(total, 1400));
    total = Math.round(total);

    calc.totalEl.textContent = money(total);

    const details = [
      `${beds} bed / ${baths} bath`,
      `${sqft} sq ft`,
      `${cleaningType} • ${frequency}`,
      `${condition}${pets==="yes" ? " • pets" : ""}`
    ];
    if(addons.length) details.push(`addons: ${addons.map(x=>x[0]).join(", ")}`);
    if(calc.detailsEl) calc.detailsEl.textContent = details.join(" · ");

    const hidden = $("#quotePrefill");
    if(hidden){
      hidden.value =
        `Estimate: ${money(total)} | ${beds} bed / ${baths} bath | ${sqft} sq ft | ` +
        `${cleaningType} | ${frequency} | condition: ${condition} | pets: ${pets}` +
        (addons.length ? ` | addons: ${addons.map(x=>`${x[0]}+$${x[1]}`).join(", ")}` : "");
    }
  }

  if(calc.sqft && calc.sqftLabel){
    const paint = ()=> calc.sqftLabel.textContent = `${calc.sqft.value} sq ft`;
    calc.sqft.addEventListener("input", ()=>{ paint(); compute(); });
    paint();
  }

  [
    calc.type, calc.freq, calc.beds, calc.baths, calc.condition, calc.pets,
    calc.addonFridge, calc.addonOven, calc.addonCabinets, calc.addonMicrowave
  ].forEach(el=>{
    if(el) el.addEventListener("change", compute);
  });

  compute();

  // Quote form -> mailto
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
    });
  }

  // Smooth scroll for in-page anchors (nice UX)
  document.addEventListener("click", (e)=>{
    const a = e.target.closest("a[href^='#'], a[href*='index.html#']");
    if(!a) return;

    const href = a.getAttribute("href") || "";
    const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
    if(!hash || hash === "#") return;

    const id = hash.replace("#","");
    const el = document.getElementById(id);
    if(!el) return;

    // only for same-page anchors
    if(href.startsWith("#") || (href.startsWith("index.html#") && location.pathname.endsWith("index.html"))){
      e.preventDefault();
      closeMobileNav();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash);
    }
  });
})();
