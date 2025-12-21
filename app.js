function initReviews(){
  if (!document.getElementById("reviewsPage")) return;

  const form = document.getElementById("newReviewForm");
  if(!form) return;

  form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const name = (document.getElementById("r_name").value.trim() || "Anonymous");
    const rating = parseInt(document.getElementById("r_rating").value, 10);
    const text = document.getElementById("r_text").value.trim();

    if(text.length < 10){
      alert("Please write at least 10 characters.");
      return;
    }

    const list = document.getElementById("reviewsList");
    if(!list) return;

    // Add new card on top (instant feedback)
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined,{month:"short", year:"numeric"});
    const stars = "★".repeat(rating) + "☆".repeat(5-rating);

    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-head">
        <div>
          <div class="review-name">${name.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
          <div class="stars" aria-label="${rating} out of 5">${stars}</div>
        </div>
        <div class="review-date">${dateStr}</div>
      </div>
      <div class="review-text">${text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
    `;

    list.prepend(card);
    form.reset();
  });
}
