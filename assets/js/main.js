(function () {
  const COMPANY_PHONE = "+15035551234";        // <-- поставь свой номер
  const COMPANY_EMAIL = "santa.on@gmail.com";  // <-- поставь свой email

  const ADDON_PRICES = {
    fridge: 25,
    oven: 30,
    cabinets: 35,
    microwave: 15
  };

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;

  const firstMatch = (selectors, root = document) => {
    for (const s of selectors) {
      const el = root.querySelector(s);
      if (el) return el;
    }
    return null;
  };

  const allMatches = (selectors, root = document) => {
    const out = [];
    for (const s of selectors) out.push(...root.querySelectorAll(s));
    return Array.from(new Set(out));
  };

  function lockScroll() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
  function unlockScroll() {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  // ========= Call buttons =========
  allMatches(["[data-call]", ".btn-call", "#callBtn"]).forEach((b) => {
    b.addEventListener("click", () => (window.location.href = `tel:${COMPANY_PHONE}`));
  });

  // ========= Mobile menu =========
  const navToggle = firstMatch([
    ".nav-toggle",
    "#navToggle",
    "#menuBtn",
    ".menu-toggle",
    ".burger",
    "[data-nav-toggle]",
    "[data-menu-toggle]"
  ]);

  const mobileNav = firstMatch([
    "#mobileNav",
    ".mobile-nav",
    "#menuOverlay",
    ".menu-overlay",
    "[data-mobile-nav]"
  ]);

  // Панель внутри меню (может называться по-разному)
  const getPanel = () => mobileNav ? firstMatch([
    ".mobile-nav-inner",
    ".drawer",
    ".menu-panel",
    ".panel",
    "[data-mobile-panel]"
  ], mobileNav) : null;

  const mobileClose = mobileNav
    ? firstMatch([
        ".mobile-close",
        "#mobileClose",
        ".menu-close",
        "[data-close-menu]"
      ], mobileNav)
    : null;

  let lastFocused = null;

  function setAria(isOpen) {
    if (mobileNav) mobileNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
    if (navToggle) navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function forceShow(el){
    if(!el) return;
    if(el.hasAttribute("hidden")) el.removeAttribute("hidden");
    el.style.display = ""; // сброс
    // если кто-то держит display:none инлайном
    const cs = window.getComputedStyle(el);
    if(cs.display === "none") el.style.display = "flex";
    el.style.visibility = "visible";
    el.style.opacity = "1";
  }

  function openMobileNav() {
    if (!mobileNav) return;

    const panel = getPanel();

    lastFocused = document.activeElement;

    // СНИМАЕМ ВСЁ, ЧТО МОЖЕТ ПРЯТАТЬ ЭЛЕМЕНТЫ
    forceShow(mobileNav);
    forceShow(panel);

    mobileNav.classList.add("open");
    setAria(true);
    lockScroll();

    setTimeout(() => {
      const first = mobileNav.querySelector("a, button, input, select, textarea");
      if (first) first.focus();
      // если панель вдруг не нашлась — хотя бы покажем предупреждение
      if(!panel) console.warn("[ClearlinePDX] mobile panel not found inside mobileNav");
    }, 0);
  }

  function closeMobileNav() {
    if (!mobileNav) return;

    mobileNav.classList.remove("open");
    setAria(false);
    unlockScroll();

    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function isMobileNavOpen() {
    return !!(mobileNav && mobileNav.classList.contains("open"));
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      isMobileNavOpen() ? closeMobileNav() : openMobileNav();
    });

    if (mobileClose) {
      mobileClose.addEventListener("click", (e) => {
        e.preventDefault();
        closeMobileNav();
      });
    }

    // Клик по фону закрывает
    mobileNav.addEventListener("click", (e) => {
      const panel = getPanel();
      // если кликнули не внутри панели — закрываем
      if (panel && !panel.contains(e.target)) closeMobileNav();
      // fallback: если панели нет — закрываем по клику по overlay
      if (!panel && e.target === mobileNav) closeMobileNav();
    });

    // клики по ссылкам закрывают
    $$("a", mobileNav).forEach((a) => {
      a.addEventListener("click", () => closeMobileNav());
    });

    // ESC закрывает
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMobileNavOpen()) closeMobileNav();
    });
  } else {
    console.warn("[ClearlinePDX] Mobile menu init failed:", {
      navToggleFound: !!navToggle,
      mobileNavFound: !!mobileNav
    });
  }

  // ========= Quote Modal =========
  const overlay = firstMatch(["#quoteModal", ".quote-modal", "[data-quote-modal]"]);
  const openBtns = allMatches(["[data-open-quote]", ".open-quote", "#openQuote"]);
  const closeBtns = overlay
    ? allMatches(["[data-close-quote]", ".close-quote", ".modal-close"], overlay)
    : [];

  function openModal() {
    if (!overlay) return;
    overlay.classList.add("open");
    lockScroll();

    const msg = $("#qMessage");
    const prefill = $("#quotePrefill")?.value || "";
    if (msg && prefill && !msg.value.includes("Estimate:")) {
      msg.value = (msg.value.trim() ? msg.value.trim() + "\n\n" : "") + prefill;
    }
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove("open");
    unlockScroll();
  }

  openBtns.forEach((b) =>
    b.addEventListener("click", () => {
      if (isMobileNavOpen()) closeMobileNav();
      openModal();
    })
  );
  closeBtns.forEach((b) => b.addEventListener("click", closeModal));

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
    });
  }

  // ========= Calculator =========
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

    const hidden = $("#quotePrefill");
    if (hidden) {
      hidden.value =
        `Estimate: ${money(total)} | ${beds} bed / ${baths} bath | ${sqft} sq ft | ` +
        `${cleaningType} | ${frequency} | condition: ${condition} | pets: ${pets}` +
        (addons.length ? ` | addons: ${addons.map((x) => `${x[0]}+$${x[1]}`).join(", ")}` : "");
    }
  }

  if (calc.sqft && calc.sqftLabel) {
    const paint = () => (calc.sqftLabel.textContent = `${calc.sqft.value} sq ft`);
    calc.sqft.addEventListener("input", () => {
      paint();
      compute();
    });
    paint();
  }

  [
    calc.type, calc.freq, calc.beds, calc.baths, calc.condition, calc.pets,
    calc.addonFridge, calc.addonOven, calc.addonCabinets, calc.addonMicrowave
  ].forEach((el) => {
    if (el) el.addEventListener("change", compute);
  });

  compute();

  // ========= Quote form -> mailto =========
  const form = firstMatch(["#quoteForm", "form[data-quote-form]"]);
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
      closeModal();
    });
  }
})();
