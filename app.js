/* ==============================
   REVIEWS (pre-filled, no empty state)
================================ */

const REV_KEY = "clearline_reviews_v2";

function loadReviews(){
  try {
    const stored = JSON.parse(localStorage.getItem(REV_KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}
  return null;
}

function saveReviews(list){
  localStorage.setItem(REV_KEY, JSON.stringify(list));
}

function getDefaultReviews(){
  return [
    {
      name: "Jordan M.",
      rating: 5,
      text: "Fast, on time, and detailed. Bathrooms looked brand new.",
      date: "2024-11-12"
    },
    {
      name: "Emily R.",
      rating: 5,
      text: "Deep clean before guests — spotless kitchen and floors.",
      date: "2024-10-28"
    },
    {
      name: "Chris T.",
      rating: 4,
      text: "Clear pricing and easy scheduling. Solid work.",
      date: "2024-10-03"
    }
  ];
}

function renderStars(n){
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function renderReviews(){
  const wrap = document.getElementById("reviewsList");
  if (!wrap) return;

  let reviews = loadReviews();
  if (!reviews) {
    reviews = getDefaultReviews();
    saveReviews(reviews);
  }

  wrap.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-head">
        <div>
          <div class="review-name">${r.name}</div>
          <div class="stars">${renderStars(r.rating)}</div>
        </div>
        <div class="review-date">${r.date}</div>
      </div>
      <div class="review-text">${r.text}</div>
    </div>
  `).join("");
}

function initReviews(){
  if (!document.getElementById("reviewsPage")) return;

  renderReviews();

  const form = document.getElementById("newReviewForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("r_name").value.trim() || "Anonymous";
    const rating = parseInt(document.getElementById("r_rating").value, 10);
    const text = document.getElementById("r_text").value.trim();

    if (text.length < 10) {
      alert("Please write at least 10 characters.");
      return;
    }

    const reviews = loadReviews() || [];
    reviews.unshift({
      name,
      rating,
      text,
      date: new Date().toISOString().slice(0,10)
    });

    saveReviews(reviews);
    form.reset();
    renderReviews();
  });
}
