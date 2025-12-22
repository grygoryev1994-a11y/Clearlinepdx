@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap');

:root{
  /* Neutral dark palette (no green wash) */
  --bg0: #070A0F;
  --bg1: #0B1018;
  --ink: #EAF0FF;
  --ink2:#B8C2D6;

  --primary:#6EA8FF;       /* accent (blue) */
  --primary2:#4C86F2;

  --card: rgba(18, 24, 35, .72);
  --card2: rgba(18, 24, 35, .58);
  --border: rgba(255,255,255,.10);

  --shadow: 0 18px 60px rgba(0,0,0,.55);

  /* sharper corners */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;

  --container: 1180px;
}

*{ box-sizing:border-box; }
html, body{ height:100%; }

body{
  margin:0;
  font-family:"Inter Tight", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(1200px 700px at 20% 15%, rgba(110,168,255,.12), transparent 60%),
    radial-gradient(900px 600px at 85% 25%, rgba(255,255,255,.06), transparent 55%),
    radial-gradient(900px 700px at 70% 85%, rgba(110,168,255,.08), transparent 60%),
    linear-gradient(180deg, var(--bg0), var(--bg1));
  overflow-x:hidden;
}

a{ color:inherit; text-decoration:none; }
p{ margin:0; color: var(--ink2); }
h1,h2,h3{ margin:0; letter-spacing:-0.02em; }
h1{ font-weight:820; font-size: clamp(36px, 4.2vw, 60px); line-height: 1.02; }
h2{ font-weight:760; font-size: 22px; }
small{ color: rgba(234,240,255,.55); }

.container{
  width: min(var(--container), calc(100% - 32px));
  margin: 0 auto;
}

/* ===== Navbar ===== */
.navbar{
  position: sticky;
  top:0;
  z-index:50;
  background: rgba(7,10,15,.62);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.nav-inner{
  height: 70px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:760;
}

.brand-badge{
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  display:grid;
  place-items:center;
  background:
    radial-gradient(18px 18px at 30% 30%, rgba(255,255,255,.25), rgba(255,255,255,.06)),
    linear-gradient(135deg, rgba(110,168,255,.35), rgba(255,255,255,.06));
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: 0 16px 40px rgba(0,0,0,.55);
}

.nav-links{
  display:flex;
  align-items:center;
  gap:18px;
  font-weight:650;
  color: rgba(234,240,255,.78);
}
.nav-links a{
  padding:8px 10px;
  border-radius: var(--r-md);
}
.nav-links a.active,
.nav-links a:hover{
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
}

/* ===== Buttons ===== */
.btn{
  appearance:none;
  border:1px solid transparent;
  border-radius: var(--r-sm);
  padding: 12px 18px;
  font-weight: 670;
  font-size: 14px;
  line-height: 1;
  cursor:pointer;
  user-select:none;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
}
.btn:active{ transform: translateY(1px); }

.btn-primary{
  background: var(--primary2);
  color: #071018;
  border-color: rgba(255,255,255,.10);
  box-shadow: 0 18px 46px rgba(76,134,242,.24);
}
.btn-primary:hover{
  background: var(--primary);
  box-shadow: 0 22px 56px rgba(110,168,255,.26);
}

.btn-secondary{
  background: rgba(255,255,255,.06);
  color: rgba(234,240,255,.92);
  border-color: rgba(255,255,255,.12);
}
.btn-secondary:hover{
  background: rgba(255,255,255,.09);
  border-color: rgba(255,255,255,.18);
}

.btn-ghost{
  background: transparent;
  color: rgba(234,240,255,.86);
  border-color: rgba(255,255,255,.12);
}
.btn-ghost:hover{
  background: rgba(255,255,255,.06);
}

/* ===== Full-bleed hero ===== */
.hero-bleed{
  padding: 26px 0 18px;
}

.hero{
  border-radius: var(--r-lg);
  border: 1px solid rgba(255,255,255,.10);
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;

  /* Use hero.jpg */
  background-image:
    linear-gradient(180deg, rgba(7,10,15,.72), rgba(7,10,15,.42)),
    radial-gradient(900px 520px at 75% 35%, rgba(110,168,255,.18), transparent 58%),
    url("../../hero.jpg");
  background-size: cover;
  background-position: center;
}

.hero::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(900px 500px at 30% 35%, rgba(0,0,0,.10), rgba(0,0,0,.55));
  pointer-events:none;
}

.hero-content{
  position: relative;
  z-index: 2;
  max-width: 760px;
  padding: 42px 42px;
}

.hero-sub{
  margin-top: 12px;
  font-size: 16px;
  font-weight: 520;
}

.hero-actions{
  margin-top: 18px;
  display:flex;
  gap:12px;
  flex-wrap:wrap;
}

.pills{
  margin-top: 16px;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.pill{
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  border-radius: 999px;
  font-weight: 650;
  font-size: 13px;
  color: rgba(234,240,255,.86);
}

/* ===== Layout ===== */
.section{ padding: 18px 0 48px; }

.stack{
  display: grid;
  gap: 14px;
}

/* Cards are DARK (no white windows) */
.card{
  background: var(--card);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: var(--r-md);
  box-shadow: 0 18px 50px rgba(0,0,0,.35);
  backdrop-filter: blur(12px);
  padding: 18px;
}

.card h2{ color: rgba(234,240,255,.92); }
.card .desc{ margin-top: 6px; margin-bottom: 14px; }

/* Inputs */
.label{
  font-size: 13px;
  color: rgba(234,240,255,.68);
  font-weight: 650;
  margin-bottom: 8px;
}

.field-row{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.input, select, textarea{
  width:100%;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: var(--r-sm);
  padding: 12px 12px;
  background: rgba(0,0,0,.22);
  color: rgba(234,240,255,.92);
  outline:none;
  transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
  font-family: inherit;
}

.input:focus, select:focus, textarea:focus{
  border-color: rgba(110,168,255,.40);
  box-shadow: 0 0 0 4px rgba(110,168,255,.18);
  background: rgba(0,0,0,.28);
}

.range{ width:100%; }

.row-split{
  display:flex;
  justify-content:space-between;
  gap:10px;
  font-size: 13px;
  font-weight: 650;
  color: rgba(234,240,255,.70);
}
.mini{ font-size: 12px; color: rgba(234,240,255,.52); }

/* Add-ons */
.addons{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}
.check{
  display:grid;
  grid-template-columns: 18px 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 12px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  cursor:pointer;
}
.check input{ margin-top: 3px; width:18px; height:18px; }
.check-text b{ display:block; font-weight: 760; color: rgba(234,240,255,.92); }
.check-text span{ display:block; margin-top:2px; font-size:12px; color: rgba(234,240,255,.55); }
.check-price{
  font-weight: 820;
  color: rgba(234,240,255,.86);
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: var(--r-sm);
  padding: 8px 10px;
  line-height: 1;
}

/* Estimate */
.estimate{
  margin-top: 12px;
  padding: 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  display:flex;
  justify-content:space-between;
  align-items: baseline;
  gap: 10px;
}
.estimate strong{ font-size: 22px; letter-spacing:-0.02em; color: rgba(234,240,255,.95); }

/* “service” blocks */
.grid3{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tile{
  padding: 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.10);
  background: var(--card2);
  box-shadow: 0 16px 40px rgba(0,0,0,.25);
}
.tile .k{ font-weight: 780; color: rgba(234,240,255,.92); }
.tile .t{ margin-top: 6px; color: rgba(234,240,255,.58); font-size: 13px; line-height: 1.35; }

/* FAQ */
.faq{
  display:grid;
  gap: 10px;
}
.faq .q{
  padding: 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
}
.faq .q b{ display:block; }
.faq .q p{ margin-top: 6px; }

/* Footer */
.footer{
  padding: 32px 0 46px;
  border-top: 1px solid rgba(255,255,255,.08);
  background: rgba(0,0,0,.12);
}

/* Modal */
.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.70);
  display:none;
  align-items:center;
  justify-content:center;
  z-index: 60;
  padding: 18px;
}
.modal-overlay.open{ display:flex; }

.modal{
  width: min(620px, 100%);
  background: rgba(18,24,35,.92);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: var(--r-md);
  box-shadow: var(--shadow);
  padding: 18px;
  color: rgba(234,240,255,.92);
}
.modal-head{
  display:flex;
  justify-content:space-between;
  gap:10px;
  align-items:center;
  margin-bottom: 10px;
}
.modal-title{ font-weight: 820; }
.modal-actions{
  margin-top: 12px;
  display:flex;
  gap: 10px;
  justify-content:flex-end;
  flex-wrap:wrap;
}

/* ===== Reviews layout ===== */
.reviews-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.reviews-summary{
  min-width: 220px;
}

.avg{
  display:flex;
  gap: 12px;
  align-items:center;
  justify-content:flex-end;
  padding: 12px 12px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
}

.avg-num{
  font-size: 34px;
  font-weight: 860;
  letter-spacing: -0.02em;
  color: rgba(234,240,255,.95);
  line-height: 1;
}

.avg-sub{ display:grid; gap: 6px; }
.stars{ display:flex; gap: 4px; }
.star{
  font-size: 14px;
  opacity: .35;
  transform: translateY(-1px);
}
.star.on{ opacity: .95; color: var(--primary); }

.reviews-grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.review-card{
  position: relative;
  padding: 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  overflow:hidden;
}

.review-card::after{
  content:"";
  position:absolute;
  inset:-40px -80px auto auto;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle at 30% 30%, rgba(110,168,255,.18), transparent 60%);
  pointer-events:none;
  filter: blur(2px);
}

.review-top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 10px;
}

.review-meta{
  display:flex;
  gap: 10px;
  align-items:center;
}

.avatar{
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display:grid;
  place-items:center;
  font-weight: 820;
  color: rgba(7,10,15,.95);
  background: linear-gradient(135deg, rgba(110,168,255,.95), rgba(255,255,255,.25));
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
}

.review-name{
  font-weight: 780;
  color: rgba(234,240,255,.95);
  line-height: 1.1;
}
.review-date{
  font-size: 12px;
  color: rgba(234,240,255,.55);
  margin-top: 2px;
}

.review-stars{
  display:flex;
  gap: 3px;
  padding-top: 2px;
}
.review-stars span{
  font-size: 13px;
  opacity: .35;
}
.review-stars span.on{
  opacity: .95;
  color: var(--primary);
}

.review-text{
  margin-top: 10px;
  color: rgba(234,240,255,.72);
  line-height: 1.4;
}

.review-badges{
  display:flex;
  gap: 8px;
  flex-wrap:wrap;
  margin-top: 10px;
}
.badge{
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: rgba(234,240,255,.78);
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
}

@media (max-width: 980px){
  .nav-links{ display:none; }
  .hero-content{ padding: 28px 18px; }
  .grid3{ grid-template-columns: 1fr; }
  .field-row{ grid-template-columns: 1fr; }
  .addons{ grid-template-columns: 1fr; }

  .reviews-head{ flex-direction: column; }
  .reviews-summary{ min-width: auto; width: 100%; }
  .avg{ justify-content:flex-start; }
  .reviews-grid{ grid-template-columns: 1fr; }
}
