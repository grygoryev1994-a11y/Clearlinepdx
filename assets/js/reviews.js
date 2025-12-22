(function(){
  const $ = (s, r=document)=> r.querySelector(s);

  const list = $("#reviewsList");
  const form = $("#reviewForm");

  const STORAGE_KEY = "clearlinepdx_reviews_v2";

  const seed = [
    {
      name: "Jordan M.",
      date: "12/13/2025",
      stars: 5,
      text: "Booked a standard clean and it was exactly what we needed. On time, detailed, and the pricing matched the estimate."
    },
    {
      name: "Emily R.",
      date: "12/04/2025",
      stars: 5,
      text: "Super consistent service. Bathrooms and kitchen looked brand new, and the team was quick without cutting corners."
    },
    {
      name: "Marcus T.",
      date: "11/25/2025",
      stars: 5,
      text: "Best part: clear communication. We requested a quote and got confirmation fast. Would recommend for Portland."
    }
  ];

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return seed;
      const data = JSON.parse(raw);
      return Array.isArray(data) && data.length ? data : seed;
    }catch{
      return seed;
    }
  }

  function save(items){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }catch{}
  }

  function escapeHtml(s){
    return String(s||"")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function initials(name){
    const parts = String(name||"").trim().split(/\s+/).slice(0,2);
    if(!parts.length) return "CL";
    return parts.map(p=>p[0].toUpperCase()).join("");
  }

  function render(items){
    if(!list) return;
    list.innerHTML = "";

    // Update summary widgets if present
    const avgEl = document.getElementById("avgRating");
    const cntEl = document.getElementById("reviewCount");
    if(items.length){
      const avg = items.reduce((s,r)=> s + (Number(r.stars)||0), 0) / items.length;
      if(avgEl) avgEl.textContent = avg.toFixed(1);
      if(cntEl) cntEl.textContent = `${items.length} reviews`;
    }else{
      if(avgEl) avgEl.textContent = "—";
      if(cntEl) cntEl.textContent = "0 reviews";
    }

    items.forEach(r=>{
      const stars = Math.max(1, Math.min(5, Number(r.stars)||5));

      const el = document.createElement("div");
      el.className = "review-card";
      el.innerHTML = `
        <div class="review-top">
          <div class="review-meta">
            <div class="avatar">${initials(r.name)}</div>
            <div>
              <div class="review-name">${escapeHtml(r.name)}</div>
              <div class="review-date">${escapeHtml(r.date)}</div>
            </div>
          </div>

          <div class="review-stars" aria-label="${stars} out of 5">
            ${[1,2,3,4,5].map(i=>`<span class="${i<=stars?'on':''}">★</span>`).join("")}
          </div>
        </div>

        <div class="review-text">${escapeHtml(r.text)}</div>

        <div class="review-badges">
          <span class="badge">Portland</span>
          <span class="badge">Clean finish</span>
          <span class="badge">On-time</span>
        </div>
      `;
      list.appendChild(el);
    });
  }

  let items = load();
  render(items);

  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();

      const name = $("#rName")?.value.trim();
      const starsVal = Number($("#rStars")?.value || 5);
      const text = $("#rText")?.value.trim();

      if(!name || !text || text.length < 10){
        alert("Please add a name and a short review (10+ characters).");
        return;
      }

      const now = new Date();
      const mm = String(now.getMonth()+1).padStart(2,"0");
      const dd = String(now.getDate()).padStart(2,"0");
      const yyyy = now.getFullYear();
      const date = `${mm}/${dd}/${yyyy}`;

      items = [{ name, date, stars: Math.max(1, Math.min(5, starsVal)), text }, ...items].slice(0, 30);
      save(items);
      render(items);
      form.reset();
    });
  }
})();
