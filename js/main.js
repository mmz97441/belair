/* === GRAIN CANVAS === */
(function() {
  const canvas = document.getElementById('grain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, frame = 0;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function generateNoise() {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  function loop() { frame++; if (frame % 3 === 0) generateNoise(); requestAnimationFrame(loop); }
  window.addEventListener('resize', resize);
  resize(); loop();
})();

/* === CURSOR === */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -200, my = -200, rx = -200, ry = -200;
let cursorVisible = false;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (!cursorVisible) {
    cursorVisible = true;
    if (dot) dot.classList.add('visible');
    if (ring) ring.classList.add('visible');
  }
});
document.addEventListener('mouseleave', () => {
  if (dot) dot.classList.remove('visible');
  if (ring) ring.classList.remove('visible');
});
(function animCursor() {
  if (dot && ring) {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.10; ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
})();

/* === SLIDER === */
let cur = 0;
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
function goSlide(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}
function nextSlide() { goSlide(cur + 1); }
function prevSlide() { goSlide(cur - 1); }
let touchX = 0;
document.getElementById('hero') && document.getElementById('hero').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, {passive:true});
document.getElementById('hero') && document.getElementById('hero').addEventListener('touchend', e => {
  const d = touchX - e.changedTouches[0].clientX;
  if (Math.abs(d) > 40) { d > 0 ? nextSlide() : prevSlide(); }
}, {passive:true});

/* === SLIDER AUTOPLAY === */
let sliderInterval = setInterval(nextSlide, 5000);
document.getElementById('hero') && document.getElementById('hero').addEventListener('mouseenter', () => clearInterval(sliderInterval));
document.getElementById('hero') && document.getElementById('hero').addEventListener('mouseleave', () => { sliderInterval = setInterval(nextSlide, 5000); });

/* === PAGES === */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  const nb = document.getElementById('navbar');
  if (name !== 'home') { nb.classList.add('scrolled'); nb.classList.add('page-nav'); }
  else { nb.classList.remove('page-nav'); }
}

/* === MOBILE MENU === */
function openMobile()  { document.getElementById('mobileMenu').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); document.body.style.overflow = ''; }

/* === MODAL === */
function openModal() {
  const m = document.getElementById('modal');
  if (!m) return;
  m.classList.add('open');
  const ms = document.getElementById('modal-success');
  if (ms) ms.classList.remove('show');
  const fsub = document.querySelector('.form-sub');
  if (fsub) fsub.style.display = '';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
function handleModalClick(e) { if (e.target === document.getElementById('modal')) closeModal(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* === FORMS === */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[\+]?[\d\s\-\(\)]{7,}$/.test(phone);
}
function showFormError(container, msg) {
  let errEl = container.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'form-error';
    const submitBtn = container.querySelector('.form-sub') || container.querySelector('.form-submit');
    if (submitBtn) submitBtn.parentNode.insertBefore(errEl, submitBtn);
  }
  errEl.textContent = msg;
  errEl.style.display = 'block';
  setTimeout(() => { errEl.style.display = 'none'; }, 4000);
}
function getFormData(container) {
  const inputs = container.querySelectorAll('input, select, textarea');
  const data = {};
  inputs.forEach(input => {
    if (input.type === 'radio') { if (input.checked) data['marche'] = input.value; }
    else if (input.type === 'checkbox') { data['rgpd'] = input.checked; }
    else if (input.type === 'email') { data['email'] = input.value.trim(); }
    else if (input.type === 'tel') { data['telephone'] = input.value.trim(); }
    else if (input.tagName === 'SELECT') { data['pays'] = input.value; }
    else if (input.tagName === 'TEXTAREA') { data['message'] = input.value.trim(); }
    else if (input.placeholder && input.placeholder.includes('prénom')) { data['prenom'] = input.value.trim(); }
    else if (input.placeholder && input.placeholder.includes('nom')) { data['nom'] = input.value.trim(); }
  });
  return data;
}
function validateForm(container) {
  const data = getFormData(container);
  if (!data.prenom || data.prenom.length < 2) { showFormError(container, 'Veuillez entrer votre prénom.'); return null; }
  if (!data.nom || data.nom.length < 2) { showFormError(container, 'Veuillez entrer votre nom.'); return null; }
  if (!data.email || !validateEmail(data.email)) { showFormError(container, 'Veuillez entrer un email valide.'); return null; }
  if (!data.telephone || !validatePhone(data.telephone)) { showFormError(container, 'Veuillez entrer un numéro de téléphone valide.'); return null; }
  if (!data.pays) { showFormError(container, 'Veuillez sélectionner votre pays de résidence.'); return null; }
  if (!data.rgpd) { showFormError(container, 'Veuillez accepter la politique de confidentialité.'); return null; }
  return data;
}
function submitModal() {
  const container = document.querySelector('#modal .modal-body');
  const data = validateForm(container);
  if (!data) return;
  const submitBtn = container.querySelector('.form-sub');
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.style.display = 'none';
    document.getElementById('modal-success').classList.add('show');
    if (typeof gtag === 'function') gtag('event', 'generate_lead', { event_category: 'form', event_label: 'modal', market: data.marche || 'non_specifie' });
  }, 800);
}
function submitContactPage() {
  const container = document.querySelector('#page-contact .contact-grid > div:first-child');
  const data = validateForm(container);
  if (!data) return;
  const submitBtn = container.querySelector('.form-submit');
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.style.display = 'none';
    document.getElementById('page-contact-success').classList.add('show');
    if (typeof gtag === 'function') gtag('event', 'generate_lead', { event_category: 'form', event_label: 'contact_page', market: data.marche || 'non_specifie' });
  }, 800);
}

/* === REVEAL ON SCROLL === */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.05 });
revealEls.forEach(el => revealObs.observe(el));

/* === ANIMATED COUNTER === */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const counterEl = document.getElementById('counter-clients');
if (counterEl) {
  const cObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounter(counterEl, parseInt(counterEl.dataset.target), 1800); cObs.disconnect(); }
  }, { threshold: 0.5 });
  cObs.observe(counterEl);
}

/* === EDITORIAL TESTIMONIALS === */
const testis = [
  { q: "J'avais peur de ne jamais voir la couleur de mon argent depuis La Réunion. Le suivi sur place et la transparence à chaque étape ont tout changé. Le rendement réel a dépassé ce qu'on m'avait annoncé.", a: "Marc-Olivier T. — Saint-Denis, La Réunion" },
  { q: "Investir à l'étranger depuis un DOM, c'est une appréhension énorme au départ. BEL AIR a structuré chaque étape avec une rigueur que je n'avais jamais vue. Aujourd'hui je dors tranquille.", a: "Sandrine B. — Saint-Pierre, La Réunion" },
  { q: "Ce qui m'a convaincu c'est qu'on m'a dit non sur deux projets avant de me proposer le bon. Ça, ça ne s'invente pas. Et la performance locative annoncée ? On était en dessous de la réalité.", a: "Frédéric A. — Le Tampon, La Réunion" }
];
let curTesti = 0;
function goTesti(n) {
  const qEl = document.getElementById('testi-quote');
  const aEl = document.getElementById('testi-author');
  const tdots = document.querySelectorAll('.testi-ed-dot');
  if (!qEl || !aEl) return;
  qEl.style.opacity = '0';
  setTimeout(() => {
    curTesti = n;
    qEl.textContent = '“' + testis[n].q + '”';
    aEl.textContent = testis[n].a;
    qEl.style.opacity = '1';
  }, 300);
  tdots.forEach((d, i) => d.classList.toggle('active', i === n));
}

/* === AUTOPLAY VIDEO === */
document.querySelectorAll('video[autoplay]').forEach(video => {
  video.muted = true;
  video.play().catch(() => {});
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { video.muted = true; video.play().catch(() => {}); } });
  }, { threshold: 0.1, rootMargin: '100px' });
  obs.observe(video);
});

/* === NAVBAR === */
const navEl2 = document.getElementById('navbar');
function updateNav() {}
window.addEventListener('scroll', updateNav, { passive: true });