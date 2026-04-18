/* ============================================================
   BEL AIR — main.js
   ============================================================ */

/* === GRAIN CANVAS === */
(function() {
  var canvas = document.getElementById('grain-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h, frame = 0;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function generateNoise() {
    var imageData = ctx.createImageData(w, h);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var v = Math.random() * 255 | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  function loop() { frame++; if (frame % 3 === 0) generateNoise(); requestAnimationFrame(loop); }
  window.addEventListener('resize', resize);
  resize(); loop();
})();

/* === CUSTOM CURSOR === */
(function() {
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var mx = -200, my = -200, rx = -200, ry = -200;
  var visible = false;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    if (!visible) {
      visible = true;
      dot.classList.add('visible');
      ring.classList.add('visible');
    }
  });
  document.addEventListener('mouseleave', function() {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });
  (function animate() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.10; ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animate);
  })();
})();

/* === HERO SLIDER === */
var cur = 0;
var slides = document.querySelectorAll('.slide');
var dots   = document.querySelectorAll('.dot');

function goSlide(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}
function nextSlide() { goSlide(cur + 1); }
function prevSlide() { goSlide(cur - 1); }

/* Touch support */
(function() {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var touchX = 0;
  hero.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, {passive:true});
  hero.addEventListener('touchend', function(e) {
    var d = touchX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) { d > 0 ? nextSlide() : prevSlide(); }
  }, {passive:true});
})();

/* Autoplay */
var sliderInterval = setInterval(nextSlide, 5000);
(function() {
  var hero = document.getElementById('hero');
  if (!hero) return;
  hero.addEventListener('mouseenter', function() { clearInterval(sliderInterval); });
  hero.addEventListener('mouseleave', function() { sliderInterval = setInterval(nextSlide, 5000); });
})();

/* === SPA NAVIGATION WITH HISTORY === */
function showPage(name, pushHistory) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  var page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  var navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  var nb = document.getElementById('navbar');
  if (name !== 'home') { nb.classList.add('scrolled'); nb.classList.add('page-nav'); }
  else { nb.classList.remove('page-nav'); }
  if (pushHistory !== false) {
    history.pushState({ page: name }, '', '#' + name);
  }
}

window.addEventListener('popstate', function(e) {
  if (e.state && e.state.page) {
    showPage(e.state.page, false);
  } else {
    var hash = location.hash.replace('#', '');
    showPage(hash || 'home', false);
  }
});

(function() {
  var hash = location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    showPage(hash, false);
  } else {
    history.replaceState({ page: 'home' }, '', '#home');
  }
})();

/* === MOBILE MENU === */
function openMobile() {
  document.getElementById('mobileMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}

/* === MODAL === */
function openModal() {
  var m = document.getElementById('modal');
  if (!m) return;
  m.classList.add('open');
  var ms = document.getElementById('modal-success');
  if (ms) ms.classList.remove('show');
  var form = document.getElementById('form-modal');
  if (form) { form.reset(); form.style.display = ''; }
  var sub = m.querySelector('.form-sub');
  if (sub) { sub.style.display = ''; sub.disabled = false; sub.textContent = 'Envoyer ma demande'; }
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  var m = document.getElementById('modal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeModal(); closeBrochure(); }
});

/* === BROCHURE MODAL === */
function openBrochure(projectName) {
  var m = document.getElementById('modal-brochure');
  if (!m) return;
  m.classList.add('open');
  document.getElementById('brochure-projet').value = projectName;
  document.getElementById('brochure-title').textContent = 'Brochure — ' + projectName;
  var success = document.getElementById('brochure-success');
  if (success) success.classList.remove('show');
  var form = document.getElementById('form-brochure');
  if (form) { form.reset(); form.style.display = ''; }
  var sub = m.querySelector('.form-sub');
  if (sub) { sub.style.display = ''; sub.disabled = false; sub.textContent = 'Recevoir la brochure →'; }
  document.body.style.overflow = 'hidden';
}
function closeBrochure() {
  var m = document.getElementById('modal-brochure');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

/* === FORM SUBMISSION (Formspree via AJAX) === */
function showFormError(form, msg) {
  var errEl = form.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'form-error';
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.parentNode.insertBefore(errEl, submitBtn);
  }
  errEl.textContent = msg;
  errEl.style.display = 'block';
  setTimeout(function() { errEl.style.display = 'none'; }, 4000);
}

function handleFormSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var submitBtn = form.querySelector('button[type="submit"]');
  var successEl = form.querySelector('.form-success');

  /* Validation supplementaire */
  var prenom = form.querySelector('[name="prenom"]');
  var nom = form.querySelector('[name="nom"]');
  var email = form.querySelector('[name="email"]');
  var tel = form.querySelector('[name="telephone"]');

  if (prenom && prenom.value.trim().length < 2) { showFormError(form, 'Veuillez entrer votre prénom.'); return; }
  if (nom && nom.value.trim().length < 2) { showFormError(form, 'Veuillez entrer votre nom.'); return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showFormError(form, 'Veuillez entrer un email valide.'); return; }
  if (tel && !/^[\+]?[\d\s\-\(\)]{7,}$/.test(tel.value.trim())) { showFormError(form, 'Veuillez entrer un numéro de téléphone valide.'); return; }

  /* UI: loading state */
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;

  /* Envoyer via Formspree AJAX */
  var formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(function(response) {
    if (response.ok) {
      submitBtn.style.display = 'none';
      if (successEl) successEl.classList.add('show');
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: form.id,
          market: formData.get('marche') || 'non_specifie'
        });
      }
    } else {
      throw new Error('Erreur serveur');
    }
  })
  .catch(function() {
    showFormError(form, 'Une erreur est survenue. Veuillez réessayer.');
    submitBtn.textContent = 'Envoyer ma demande';
    submitBtn.disabled = false;
  });
}

/* Attach form handlers */
document.addEventListener('DOMContentLoaded', function() {
  var formModal = document.getElementById('form-modal');
  var formContact = document.getElementById('form-contact');
  if (formModal) formModal.addEventListener('submit', handleFormSubmit);
  if (formContact) formContact.addEventListener('submit', handleFormSubmit);
  var formBrochure = document.getElementById('form-brochure');
  if (formBrochure) formBrochure.addEventListener('submit', handleFormSubmit);

  /* Modal click outside to close */
  var modalOverlay = document.getElementById('modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  var brochureOverlay = document.getElementById('modal-brochure');
  if (brochureOverlay) {
    brochureOverlay.addEventListener('click', function(e) {
      if (e.target === brochureOverlay) closeBrochure();
    });
  }
});

/* === SCROLL REVEAL === */
var revealEls = document.querySelectorAll('.reveal');
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.05 });
revealEls.forEach(function(el) { revealObs.observe(el); });

/* === ANIMATED COUNTER === */
function animateCounter(el, target, duration) {
  var start = 0;
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
(function() {
  var counterEl = document.getElementById('counter-clients');
  if (!counterEl) return;
  var cObs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      animateCounter(counterEl, parseInt(counterEl.dataset.target), 1800);
      cObs.disconnect();
    }
  }, { threshold: 0.5 });
  cObs.observe(counterEl);
})();

/* === EDITORIAL TESTIMONIALS === */
var testis = [
  { q: "J'avais peur de ne jamais voir la couleur de mon argent depuis La Réunion. Le suivi sur place et la transparence à chaque étape ont tout changé. Le rendement réel a dépassé ce qu'on m'avait annoncé.", a: "Marc-Olivier T. — Saint-Denis, La Réunion" },
  { q: "Investir à l'étranger depuis un DOM, c'est une appréhension énorme au départ. BEL AIR a structuré chaque étape avec une rigueur que je n'avais jamais vue. Aujourd'hui je dors tranquille.", a: "Sandrine B. — Saint-Pierre, La Réunion" },
  { q: "Ce qui m'a convaincu c'est qu'on m'a dit non sur deux projets avant de me proposer le bon. Ça, ça ne s'invente pas. Et la performance locative annoncée ? On était en dessous de la réalité.", a: "Frédéric A. — Le Tampon, La Réunion" }
];
var curTesti = 0;
function goTesti(n) {
  var qEl = document.getElementById('testi-quote');
  var aEl = document.getElementById('testi-author');
  var tdots = document.querySelectorAll('.testi-ed-dot');
  if (!qEl || !aEl) return;
  qEl.style.opacity = '0';
  setTimeout(function() {
    curTesti = n;
    qEl.textContent = '\u201C' + testis[n].q + '\u201D';
    aEl.textContent = testis[n].a;
    qEl.style.opacity = '1';
  }, 300);
  tdots.forEach(function(d, i) { d.classList.toggle('active', i === n); });
}

/* === AUTOPLAY VIDEO === */
document.querySelectorAll('video[autoplay]').forEach(function(video) {
  video.muted = true;
  video.play().catch(function() {});
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { video.muted = true; video.play().catch(function() {}); }
    });
  }, { threshold: 0.1, rootMargin: '100px' });
  obs.observe(video);
});

/* === PHONE PREFIX SELECTOR === */
(function() {
  var countries = [
    { name: 'La Réunion', dial: '+262', flag: '🇷🇪' },
    { name: 'France', dial: '+33', flag: '🇫🇷' },
    { name: 'Belgique', dial: '+32', flag: '🇧🇪' },
    { name: 'Suisse', dial: '+41', flag: '🇨🇭' },
    { name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
    { name: 'Canada', dial: '+1', flag: '🇨🇦' },
    { name: 'Maroc', dial: '+212', flag: '🇲🇦' },
    { name: 'Thaïlande', dial: '+66', flag: '🇹🇭' },
    { name: 'Émirats arabes unis', dial: '+971', flag: '🇦🇪' },
    { name: 'Guadeloupe', dial: '+590', flag: '🇬🇵' },
    { name: 'Martinique', dial: '+596', flag: '🇲🇶' },
    { name: 'Guyane française', dial: '+594', flag: '🇬🇫' },
    { name: 'Mayotte', dial: '+262', flag: '🇾🇹' },
    { name: 'Nouvelle-Calédonie', dial: '+687', flag: '🇳🇨' },
    { name: 'Polynésie française', dial: '+689', flag: '🇵🇫' },
    { name: 'Allemagne', dial: '+49', flag: '🇩🇪' },
    { name: 'Espagne', dial: '+34', flag: '🇪🇸' },
    { name: 'Italie', dial: '+39', flag: '🇮🇹' },
    { name: 'Portugal', dial: '+351', flag: '🇵🇹' },
    { name: 'Royaume-Uni', dial: '+44', flag: '🇬🇧' },
    { name: 'Pays-Bas', dial: '+31', flag: '🇳🇱' },
    { name: 'États-Unis', dial: '+1', flag: '🇺🇸' },
    { name: 'Monaco', dial: '+377', flag: '🇲🇨' },
    { name: 'Tunisie', dial: '+216', flag: '🇹🇳' },
    { name: 'Algérie', dial: '+213', flag: '🇩🇿' },
    { name: 'Sénégal', dial: '+221', flag: '🇸🇳' },
    { name: 'Côte d\'Ivoire', dial: '+225', flag: '🇨🇮' },
    { name: 'Maurice', dial: '+230', flag: '🇲🇺' },
    { name: 'Madagascar', dial: '+261', flag: '🇲🇬' },
    { name: 'Cameroun', dial: '+237', flag: '🇨🇲' },
    { name: 'Gabon', dial: '+241', flag: '🇬🇦' },
    { name: 'Congo', dial: '+242', flag: '🇨🇬' },
    { name: 'Liban', dial: '+961', flag: '🇱🇧' },
    { name: 'Israël', dial: '+972', flag: '🇮🇱' },
    { name: 'Australie', dial: '+61', flag: '🇦🇺' },
    { name: 'Singapour', dial: '+65', flag: '🇸🇬' },
    { name: 'Hong Kong', dial: '+852', flag: '🇭🇰' },
    { name: 'Japon', dial: '+81', flag: '🇯🇵' },
    { name: 'Chine', dial: '+86', flag: '🇨🇳' },
    { name: 'Inde', dial: '+91', flag: '🇮🇳' },
    { name: 'Brésil', dial: '+55', flag: '🇧🇷' },
    { name: 'Mexique', dial: '+52', flag: '🇲🇽' },
    { name: 'Russie', dial: '+7', flag: '🇷🇺' },
    { name: 'Turquie', dial: '+90', flag: '🇹🇷' },
    { name: 'Pologne', dial: '+48', flag: '🇵🇱' },
    { name: 'Roumanie', dial: '+40', flag: '🇷🇴' },
    { name: 'Suède', dial: '+46', flag: '🇸🇪' },
    { name: 'Norvège', dial: '+47', flag: '🇳🇴' },
    { name: 'Danemark', dial: '+45', flag: '🇩🇰' },
    { name: 'Finlande', dial: '+358', flag: '🇫🇮' },
    { name: 'Irlande', dial: '+353', flag: '🇮🇪' },
    { name: 'Autriche', dial: '+43', flag: '🇦🇹' },
    { name: 'Grèce', dial: '+30', flag: '🇬🇷' },
    { name: 'Croatie', dial: '+385', flag: '🇭🇷' },
    { name: 'République tchèque', dial: '+420', flag: '🇨🇿' }
  ];

  function initPhoneSelectors() {
    var containers = document.querySelectorAll('.phone-input-container');
    containers.forEach(function(container) {
      var btn = container.querySelector('[data-phone-prefix]');
      var dropdown = container.querySelector('[data-phone-dropdown]');
      var searchInput = container.querySelector('[data-phone-search]');
      var listEl = container.querySelector('[data-phone-list]');
      var hiddenInput = container.querySelector('input[name="indicatif"]');
      var telInput = container.querySelector('input[type="tel"]');
      if (!btn || !dropdown || !listEl) return;

      function renderList(filter) {
        var html = '';
        var q = (filter || '').toLowerCase();
        countries.forEach(function(c, i) {
          if (q && c.name.toLowerCase().indexOf(q) === -1 && c.dial.indexOf(q) === -1) return;
          var sel = c.dial === hiddenInput.value && c.flag === btn.querySelector('.flag').textContent ? ' selected' : '';
          html += '<div class="phone-option' + sel + '" data-index="' + i + '">'
            + '<span class="flag">' + c.flag + '</span>'
            + '<span class="name">' + c.name + '</span>'
            + '<span class="dial">' + c.dial + '</span>'
            + '</div>';
        });
        listEl.innerHTML = html;
      }

      function openDropdown() {
        renderList('');
        dropdown.classList.add('open');
        btn.classList.add('open');
        if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      }

      function closeDropdown() {
        dropdown.classList.remove('open');
        btn.classList.remove('open');
      }

      function selectCountry(idx) {
        var c = countries[idx];
        btn.querySelector('.flag').textContent = c.flag;
        btn.querySelector('.code').textContent = c.dial;
        hiddenInput.value = c.dial;
        closeDropdown();
        if (telInput) telInput.focus();
      }

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown.classList.contains('open')) closeDropdown();
        else openDropdown();
      });

      listEl.addEventListener('click', function(e) {
        var opt = e.target.closest('.phone-option');
        if (opt) selectCountry(parseInt(opt.dataset.index));
      });

      if (searchInput) {
        searchInput.addEventListener('input', function() {
          renderList(this.value);
        });
        searchInput.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') closeDropdown();
        });
      }

      document.addEventListener('click', function(e) {
        if (!container.contains(e.target)) closeDropdown();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneSelectors);
  } else {
    initPhoneSelectors();
  }
})();

/* === NAVBAR SCROLL === */
(function() {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) nav.classList.add('scrolled');
    else if (!nav.classList.contains('page-nav')) nav.classList.remove('scrolled');
  }, { passive: true });
})();

/* === COOKIE CONSENT === */
(function() {
  var consent = localStorage.getItem('cookie-consent');
  if (!consent) {
    setTimeout(function() {
      var banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.add('visible');
    }, 1500);
  } else if (consent === 'accepted') {
    loadAnalytics();
  }
})();

function acceptCookies() {
  localStorage.setItem('cookie-consent', 'accepted');
  document.getElementById('cookie-banner').classList.remove('visible');
  loadAnalytics();
}
function refuseCookies() {
  localStorage.setItem('cookie-consent', 'refused');
  document.getElementById('cookie-banner').classList.remove('visible');
}
function loadAnalytics() {
  // Google Analytics 4 — remplacer G-XXXXXXXXXX par votre ID
  // var s = document.createElement('script');
  // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  // s.async = true;
  // document.head.appendChild(s);
  // s.onload = function() {
  //   window.dataLayer = window.dataLayer || [];
  //   function gtag(){dataLayer.push(arguments);}
  //   gtag('js', new Date());
  //   gtag('config', 'G-XXXXXXXXXX');
  // };
}

/* === SEO: DYNAMIC TITLE & META PER PAGE === */
var pageMeta = {
  'home': {
    title: 'BEL AIR — Investir en Thaïlande avec méthode. Pas avec espoir.',
    desc: 'BEL AIR accompagne les investisseurs francophones dans l\'investissement immobilier en Thaïlande. Cabinet basé à Dubaï. Sélection rigoureuse, présence terrain à Phuket.'
  },
  'thai': {
    title: 'Investir en Thaïlande — BEL AIR | Rendement locatif garanti à Phuket',
    desc: 'Investissement immobilier en Thaïlande : condominiums à Phuket, rendement locatif 7-10% net. Accompagnement complet par BEL AIR, agence française basée à Dubaï.'
  },
  'blog': {
    title: 'Blog — Investissement immobilier Phuket | BEL AIR',
    desc: 'Analyses de marché, rendement locatif, réglementation Airbnb, quartiers premium à Phuket. Le journal de l\'investissement immobilier international par BEL AIR.'
  },
  'contact': {
    title: 'Contact — Planifier un échange stratégique | BEL AIR',
    desc: 'Contactez BEL AIR pour un échange stratégique sur votre projet d\'investissement immobilier en Thaïlande. Réponse sous 24h. Sans engagement.'
  },
  'project-layan-verde': {
    title: 'Layan Verde — Condominium premium à Phuket | BEL AIR',
    desc: 'Projet Layan Verde à Phuket : condominium à partir de 160 000€, rendement 8-10% net, livraison Q4 2027. Community mall, espaces verts, architecture contemporaine.'
  },
  'project-rhea-sansini': {
    title: 'Rhea By Sansiri — Condominium Phuket | BEL AIR',
    desc: 'Projet Rhea By Sansiri à Phuket : condominium à partir de 110 000€, rendement 7-8% net, livraison Q4 2027. Piscine, lobby premium, pet park.'
  },
  'article-phuket-opportunites': {
    title: 'Pourquoi investir à Phuket : opportunités pour les étrangers | BEL AIR',
    desc: 'Pourquoi Phuket attire les investisseurs étrangers : marché résilient, avantages fiscaux, rendement 5-10% net. Analyse complète par BEL AIR.'
  },
  'article-phuket-guide': {
    title: 'Guide complet : investir à Phuket — immobilier et rendement locatif',
    desc: 'Tout savoir pour investir à Phuket : types de biens, législation, rendement 6-10% brut, quartiers premium, erreurs à éviter. Guide par Mathieu Maillot.'
  },
  'article-phuket-bang-tao-surin': {
    title: 'Investir à Bang Tao et Surin — quartiers premium de Phuket | BEL AIR',
    desc: 'Bang Tao et Surin : les quartiers les plus rentables de Phuket. Condominiums, villas, rendement locatif, style de vie. Analyse par BEL AIR.'
  },
  'article-phuket-rentabilite': {
    title: 'Airbnb Phuket : le vrai potentiel de rentabilité locative | BEL AIR',
    desc: 'Rendement Airbnb à Phuket : 8-12% brut en courte durée vs 5-7% en longue durée. Comparatif, réglementation, conseils pratiques par BEL AIR.'
  },
  'article-phuket-airbnb': {
    title: 'Optimiser la rentabilité Airbnb à Phuket — location courte durée | BEL AIR',
    desc: 'Location courte durée à Phuket via Airbnb : rendement 6-12%, réglementation, indicateurs clés, conseils pour maximiser vos revenus locatifs.'
  }
};

var originalShowPage = showPage;
showPage = function(name, pushHistory) {
  originalShowPage(name, pushHistory);
  var meta = pageMeta[name];
  if (meta) {
    document.title = meta.title;
    var descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', meta.desc);
  }
};

/* === FAQ ACCORDION === */
function toggleFaq(btn) {
  var item = btn.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(el) { el.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}
