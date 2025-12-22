// assets/js/reviews.js

(function(){
  const KEY = "clearline_reviews_v1";

  const seed = [
    {
      name: "Jordan M.",
      stars: 5,
      date: recentDate(9),
      text: "Booked a standard clean and it was exactly what we needed. On time, detailed, and the pricing matched the estimate."
    },
    {
      name: "Emily R.",
      stars: 5,
      date: recentDate(18),
      text: "Super consistent service. Bathrooms and kitchen looked brand new, and the team was quick without cutting corners."
    },
    {
      name: "Marcus T.",
      stars: 5,
      date: recentDate(27),
      text: "Best part: clear communication. We requested a quote and got confirmation fast. Would recommend for Portland."
    }
  ];

  const $ = (s, r=document) => r.querySelector(s);

  function recentDate(daysAgo){
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  function load(){
    const raw = localStorage.getItem(KEY);
    if(!raw){
      localStorage.setItem(KEY, JSON.stringify(seed));
      return [...seed];
    }
    try{
      const parsed = JSON.parse(raw);
      if(!Array.isArray(parsed) || parsed.length === 0){
        localStorage.setItem(KEY, JSON.stringify(seed));
        return [...seed];
      }
      return parsed;
    }catch{
      localStorage.setItem(KEY, JSON.stringify(seed));
      return [...seed];
    }
  }

  function save(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function stars(n){
    return "★★★★★".slice(0,n) + "☆☆☆☆☆".slice(0,5-n);
  }

  function render(list){
    const root = $("#reviewsList");
    if(!root) return;
    root.innerHTML = "";

    list
      .slice()
      .sort((a,b)=> new Date(b.date) - new Date(a.date))
      .slice(0, 12) // не надо 200 штук
      .forEach(r=>{
        const div = document.createElement("div");
        div.className = "review-item";
        div.innerHTML = `
          <div class="review-top">
            <div>
              <div class="name">${escapeHtml(r.name)}</div>
              <div class="date">${escapeHtml(r.date)}</div>
            </div>
            <div class="stars">${stars(Number(r.stars)||5)}</div>
          </div>
          <div class="quote">${escapeHtml(r.text)}</div>
        `;
        root.appendChild(div);
      });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[c]));
  }

  const list = load();
  render(list);

  // form
  const form = $("#reviewForm");
  if(form){
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      const name = $("#rName").value.trim();
      const text = $("#rText").value.trim();
      const starsVal = Number($("#rStars").value || 5);

      if(name.length < 2 || text.length < 10){
        alert("Please add your name and a bit more detail (10+ characters).");
        return;
      }

      const d = new Date();
      const mm = String(d.getMonth()+1).padStart(2,"0");
      const dd = String(d.getDate()).padStart(2,"0");
      const yyyy = d.getFullYear();

      list.push({
        name,
        stars: Math.min(5, Math.max(1, starsVal)),
        date: `${mm}/${dd}/${yyyy}`,
        text
      });

      save(list);
      render(list);
      form.reset();
      $("#rStars").value = "5";
      alert("Thanks! Your review was added.");
    });
  }

})();
