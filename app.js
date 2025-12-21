const modalBg = document.getElementById("modalBg");
const openBtns = [document.getElementById("openQuote"), document.getElementById("openQuote2")];
const closeBtn = document.getElementById("closeModal");

openBtns.forEach(btn => btn && btn.addEventListener("click", () => {
  modalBg.style.display = "flex";
}));

closeBtn?.addEventListener("click", () => {
  modalBg.style.display = "none";
});

document.getElementById("quoteForm")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Quote request sent (demo)");
  modalBg.style.display = "none";
});

// calculator
const beds = document.getElementById("beds");
const baths = document.getElementById("baths");
const sqft = document.getElementById("sqft");
const price = document.getElementById("price");

function calc() {
  const val = 100 + beds.value * 40 + baths.value * 30 + sqft.value / 50;
  price.textContent = `$${Math.round(val)}`;
}

[beds, baths, sqft].forEach(el => el?.addEventListener("input", calc));
calc();
