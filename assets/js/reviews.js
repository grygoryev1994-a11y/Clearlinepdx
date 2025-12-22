(function(){
  const $ = (s, r=document)=> r.querySelector(s);

  const list = $("#reviewsList");
  const form = $("#reviewForm");

  const STORAGE_KEY = "clearlinepdx_reviews_v1";

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

  function stars(n){
    const full = "★★★★★".slice(0, n);
    const empty = "☆☆☆☆☆".slice(0, 5-n);
    return full + empty;
  }

  function render(items){
    if(!list) return;
    list.innerHTML = "";
    items.forEach(r=>{
      const el = document.createElement("div");
      el.className = "review-item";
      el.innerHTML = `
        <div class="review-top">
          <div>
            <div class="review-name">${escapeHtml(r.name)}</div>
            <div class="review-date">${escapeHtml(r.date)}</div>
          </div>
          <div class="review-stars">${stars(Number(r.stars)||5)}</div>
        </div>
        <div class="review-text">${escapeHtml(r.text)}</div>
      `;
      list.appendChild(el);
    });
  }

  function escapeHtml(s){
    return String(s||"")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
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

      items = [{ name, date, stars: Math.max(1, Math.min(5, starsVal)), text }, ...items].slice(0, 20);
      save(items);
      render(items);
      form.reset();
    });
  }
})();
