(function () {
  const COMPANY_PHONE = "+19713472644";        // <-- твой номер
  const COMPANY_EMAIL = "clearlinepdx@gmail.com";  // <-- твой email

  const ADDON_PRICES = {
    fridge: 25,
    oven: 30,
    cabinets: 35,
    microwave: 15
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;

  // ===== Time estimate (always for 1 cleaner) =====
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function estimateTimeOneCleaner({ cleaningType, frequency, beds, baths, sqft, condition, pets, addons }) {
    beds = clamp(Number(beds) || 0, 0, 15);
    baths = clamp(Number(baths) || 0, 0, 15);
    sqft = clamp(Number(sqft) || 0, 200, 20000);

    // Baseline model tuned so 1800sqft / 4bd / 2ba (standard) ~= 4–6h range
    const basePerSqft = 0.0035; // hours per sqft
    const perBedroom = 0.25;    // hours per bedroom
    const perBathroom = 0.80;   // hours per bathroom

    let hours = (sqft * basePerSqft) + (beds * perBedroom) + (baths * perBathroom);

    const typeMultiplier = {
      standard: 1.00,
      deep: 1.35,
      move: 1.50
    }[cleaningType] || 1.00;

    hours *= typeMultiplier;

    // Condition makes a big difference
    const conditionMultiplier = {
      normal: 1.00,
      heavy: 1.15,
      "very-heavy": 1.30
    }[condition] || 1.00;

    hours *= conditionMultiplier;

    // Pets: more hair/detailing
    if (pets === "yes") hours += 0.5;

    // Add-ons (extra hours)
    // Map aligns with your add-ons: fridge/oven/cabinets/microwave
    const addonHours = {
      fridge: 0.75,
      oven: 0.75,
      cabinets: 1.00,
      microwave: 0.25
    };

    (addons || []).forEach(([key]) => {
      if (addonHours[key] != null) hours += addonHours[key];
    });

    // Frequency (recurring cleans are usually faster after the first visit)
    const freqMultiplier = {
      weekly: 0.90,
      biweekly: 0.95,
      monthly: 1.00,
      "one-time": 1.00
    }[frequency] || 1.00;

    hours *= freqMultiplier;

    // Range ±15% to avoid overpromising
    const min = hours * 0.85;
    const max = hours * 1.15;

    const round1 = (n) => Math.round(n * 10) / 10;
    return { hours: round1(hours), minHours: round1(min), maxHours: round1(max) };
  }

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function lockScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  function unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  // Call buttons
  $$("[data-call]").forEach((b) => {
    b.addEventListener("click", () => (window.location.href = `tel:${COMPANY_PHONE}`));
  });

  // ===== Mobile menu =====
  const navToggle = $(".nav-toggle");
  const mobileNav = $("#mobileNav");
  const mobileSheet = mobileNav ? $(".mobile-sheet", mobileNav) : null;
  const mobileClose = mobileNav ? $(".mobile-close", mobileNav) : null;

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    navToggle && navToggle.setAttribute("aria-expanded", "true");
    lockScroll();
    setTimeout(() => mobileClose && mobileClose.focus(), 0);
  }

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
    unlockScroll();
  }

  function menuIsOpen() {
    return mobileNav && mobileNav.classList.contains("open");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      menuIsOpen() ? closeMenu() : openMenu();
    });

    mobileClose && mobileClose.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });

    // click outside card closes
    mobileNav.addEventListener("click", (e) => {
      if (!mobileSheet) return;
      if (!mobileSheet.contains(e.target)) closeMenu();
    });

    // close on link click
    $$("a", mobileNav).forEach((a) => a.addEventListener("click", () => closeMenu()));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuIsOpen()) closeMenu();
    });
  }

  // ===== Quote modal =====
  const quoteModal = $("#quoteModal");
  const openQuoteBtns = $$("[data-open-quote]");
  const closeQuoteBtns = $$("[data-close-quote]");

  function openQuote() {
    if (!quoteModal) return;
    quoteModal.classList.add("open");
    lockScroll();

    const msg = $("#qMessage");
    const prefill = $("#quotePrefill")?.value || "";
    if (msg && prefill && !msg.value.includes("Estimate:")) {
      msg.value = (msg.value.trim() ? msg.value.trim() + "\n\n" : "") + prefill;
    }
  }

  function closeQuote() {
    if (!quoteModal) return;
    quoteModal.classList.remove("open");
    unlockScroll();
  }

  openQuoteBtns.forEach((b) =>
    b.addEventListener("click", () => {
      if (menuIsOpen()) closeMenu();
      openQuote();
    })
  );
  closeQuoteBtns.forEach((b) => b.addEventListener("click", closeQuote));

  if (quoteModal) {
    quoteModal.addEventListener("click", (e) => {
      if (e.target === quoteModal) closeQuote();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && quoteModal.classList.contains("open")) closeQuote();
    });
  }

  // ===== Calculator =====
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
    timeEl: $("#timeEstimate"),

    addonFridge: $("#addonFridge"),
    addonOven: $("#addonOven"),
    addonCabinets: $("#addonCabinets"),
    addonMicrowave: $("#addonMicrowave")
  };

  $$("[data-addon-price]").forEach((n) => {
    const key = n.getAttribute("data-addon-price");
    if (key && ADDON_PRICES[key] != null) n.textContent = `+$${ADDON_PRICES[key]}`;
  });

  function getBaseRate({ beds, baths }) {
    const m = {
      "0": { "1": 105, "2": 125, "3": 145 },
      "1": { "1": 130, "2": 155, "3": 180 },
      "2": { "1": 165, "2": 195, "3": 225 },
      "3": { "1": 210, "2": 245, "3": 275 },
      "4": { "1": 255, "2": 295, "3": 335 }
    };
    const b = String(beds), ba = String(baths);
    return (m[b] && m[b][ba]) ? m[b][ba] : 200;
  }

  function selectedAddons() {
    const a = [];
    if (calc.addonFridge?.checked) a.push(["fridge", ADDON_PRICES.fridge]);
    if (calc.addonOven?.checked) a.push(["oven", ADDON_PRICES.oven]);
    if (calc.addonCabinets?.checked) a.push(["cabinets", ADDON_PRICES.cabinets]);
    if (calc.addonMicrowave?.checked) a.push(["microwave", ADDON_PRICES.microwave]);
    return a;
  }

  function compute() {
    if (!calc.totalEl) return;

    const cleaningType = calc.type?.value || "standard";
    const frequency = calc.freq?.value || "one-time";
    const beds = Number(calc.beds?.value || 1);
    const baths = Number(calc.baths?.value || 1);
    const sqft = Number(calc.sqft?.value || 1800);
    const condition = calc.condition?.value || "normal";
    const pets = calc.pets?.value || "no";

    let total = getBaseRate({ beds, baths });

    const delta = sqft - 1500;
    const steps = delta / 500;
    total += steps > 0 ? steps * 12 : Math.max(steps * 8, -20);

    if (cleaningType === "deep") total *= 1.30;
    if (cleaningType === "move") total *= 1.55;

    if (frequency === "weekly") total *= 0.82;
    if (frequency === "biweekly") total *= 0.88;
    if (frequency === "monthly") total *= 0.95;

    if (condition === "heavy") total += 35;
    if (condition === "very-heavy") total += 65;

    if (pets === "yes") total += 20;

    const addons = selectedAddons();
    addons.forEach(([, price]) => (total += price));

    // Time estimate (1 cleaner)
    const t = estimateTimeOneCleaner({
      cleaningType,
      frequency,
      beds,
      baths,
      sqft,
      condition,
      pets,
      addons
    });

    total = Math.max(95, Math.min(total, 1400));
    total = Math.round(total);

    calc.totalEl.textContent = money(total);

    const details = [
      `${beds} bed / ${baths} bath`,
      `${sqft} sq ft`,
      `${cleaningType} • ${frequency}`,
      `${condition}${pets === "yes" ? " • pets" : ""}`
    ];
    if (addons.length) details.push(`addons: ${addons.map((x) => x[0]).join(", ")}`);
    if (calc.detailsEl) calc.detailsEl.textContent = details.join(" · ");

    if (calc.timeEl) calc.timeEl.textContent = `Estimated time (1 cleaner): ${t.minHours}–${t.maxHours} hours`;

    const hidden = $("#quotePrefill");
    if (hidden) {
      hidden.value =
        `Estimate: ${money(total)} | ${beds} bed / ${baths} bath | ${sqft} sq ft | ` +
        `${cleaningType} | ${frequency} | condition: ${condition} | pets: ${pets} | time(1 cleaner): ${t.minHours}–${t.maxHours} hrs` +
        (addons.length ? ` | addons: ${addons.map((x) => `${x[0]}+$${x[1]}`).join(", ")}` : "");
    }
  }

  if (calc.sqft && calc.sqftLabel) {
    const paint = () => (calc.sqftLabel.textContent = `${calc.sqft.value} sq ft`);
    calc.sqft.addEventListener("input", () => { paint(); compute(); });
    paint();
  }

  [
    calc.type, calc.freq, calc.beds, calc.baths, calc.condition, calc.pets,
    calc.addonFridge, calc.addonOven, calc.addonCabinets, calc.addonMicrowave
  ].forEach((el) => el && el.addEventListener("change", compute));

  compute();

  const form = $("#quoteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
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
      closeQuote();
    });
  }
})();
