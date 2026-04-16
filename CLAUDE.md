# CLAUDE.md — Projet BEL AIR

## Vue d'ensemble

**BEL AIR** est un site vitrine premium pour un cabinet de conseil en investissement immobilier international. Societe francaise, basee a Dubai, avec presence terrain au Maroc et en Thailande. Fondateur : **Mathieu Maillot**. Cible : investisseurs francophones (France, Belgique, Suisse, Luxembourg, Canada, DOM-TOM). Ticket moyen : 300-400 k EUR.

**Slogan** : "Investir a l'etranger avec methode. Pas avec espoir."

---

## Arborescence du projet

```
belair/
├── index.html              # HTML principal (53 Ko, ~807 lignes)
├── css/
│   └── style.css           # Tous les styles (1532 lignes)
├── js/
│   └── main.js             # Toute la logique JS (242 lignes)
├── assets/
│   └── images/
│       ├── img-01.jpg      # Logo navbar (28 Ko)
│       ├── img-02.jpg      # Logo mobile menu (28 Ko)
│       ├── img-03.jpg      # Hero slide Thailande (770 Ko)
│       ├── img-04.jpg      # Photo section identification (189 Ko)
│       ├── img-05.jpg      # Photo fondateur (36 Ko)
│       ├── img-06.jpg      # Photo Dubai (73 Ko)
│       ├── img-07.jpg      # Photo fullbleed terrain (284 Ko)
│       ├── img-08.jpg      # Photo marche Maroc card (109 Ko)
│       ├── img-09.jpg      # Photo marche Thailande card (703 Ko)
│       ├── img-10.jpg      # Photo projection/benefices (85 Ko)
│       ├── img-11.jpg      # Header page Thailande (770 Ko)
│       ├── img-12.jpg      # Photo Thai interieur (617 Ko)
│       └── img-13.jpg      # Photo Thai vue generale (703 Ko)
└── CLAUDE.md               # Ce fichier
```

---

## Stack technique

- **HTML/CSS/JS pur** — Aucun framework, aucun bundler
- **Structure separee** : HTML, CSS et JS dans des fichiers distincts
- **Images** : fichiers JPEG dans `assets/images/`
- **Pas de backend** — Formulaires avec validation client-side, a connecter
- **Pas de build system** — Fichiers statiques a deployer tels quels

### Fonts (Google Fonts CDN)
| Font | Usage |
|------|-------|
| **Playfair Display** | Titres h1-h4, chiffres, citations |
| **Cormorant Garamond** | Sous-titres italiques, taglines |
| **DM Sans** | Corps de texte, boutons, labels |

### Design System — Variables CSS (`css/style.css`)
```css
--cream: #FAFAF8       /* Fond principal clair */
--ink: #1A1A1A         /* Texte principal */
--navy: #1C3557        /* Bleu premium / boutons */
--navy-deep: #0F2238   /* Sections sombres */
--gold: #C19F51        /* Accents dores / CTA */
--gold-light: #E0C880  /* Or clair */
--linen: #F0EFEB       /* Fond alternatif clair */
--red-soft: #8B3A3A    /* Erreurs formulaire */
```

---

## Pages SPA (dans `index.html`)

Navigation via `showPage()` dans `js/main.js`. Pages affichees/cachees via `.active`.

| ID | Nom | Description |
|----|-----|-------------|
| `page-home` | Accueil | Page marketing avec hero, trust bar, sections |
| `page-maroc` | Maroc | Investissement au Maroc |
| `page-thai` | Thailande | Investissement en Thailande |
| `page-contact` | Contact | Formulaire de contact |
| `page-mentions` | Mentions legales | Informations juridiques |
| `page-confidentialite` | Confidentialite | Politique de confidentialite |
| `page-rgpd` | RGPD | Droits des utilisateurs |

---

## Sections de la page d'accueil

| # | Section | Contenu |
|---|---------|---------|
| 1 | Hero slider | 2 slides (Maroc + Thailande), autoplay 5s, dots, fleches, touch |
| 2 | Trust bar | 5 indicateurs de confiance |
| 3 | Identification | "Votre situation" — douleurs prospect |
| 4 | Positionnement | "Notre approche" — proposition de valeur |
| 5 | Fondateur | Mathieu Maillot, photo + bio |
| 6 | Methode Dubai | Methode en 5 etapes + stat 90% |
| 7 | Presence terrain | Thailande + Maroc, equipes locales |
| 8 | Deux marches | Cards Maroc + Thailande |
| 9 | Social proof | Compteur anime (47) + temoignages carrousel |
| 10 | Projection | "Ce que vous cherchez vraiment" |
| 11 | CTA final | "Planifier un echange strategique" |

---

## Composants JavaScript (`js/main.js`)

| Fonctionnalite | Fonctions |
|----------------|-----------|
| **Grain Canvas** | IIFE — bruit visuel sur canvas overlay |
| **Curseur custom** | `animCursor()` — dot + ring suivant la souris |
| **Hero Slider** | `goSlide()`, `nextSlide()`, `prevSlide()` + autoplay 5s |
| **SPA Router** | `showPage(name)` — navigation entre pages |
| **Menu mobile** | `openMobile()`, `closeMobile()` |
| **Modal contact** | `openModal()`, `closeModal()` |
| **Formulaires** | `validateForm()`, `submitModal()`, `submitContactPage()` |
| **Validation** | `validateEmail()`, `validatePhone()`, `showFormError()` |
| **Scroll Reveal** | IntersectionObserver sur `.reveal` |
| **Compteur anime** | `animateCounter()` sur #counter-clients |
| **Temoignages** | `goTesti(n)` — carrousel 3 temoignages |
| **Video autoplay** | IntersectionObserver pour autoplay muted |

---

## Formulaires

### Champs communs (modal + page contact)
Prenom, Nom, Email, Telephone, Pays de residence, Marche d'interet (Maroc/Thailande/Les deux), Message (optionnel), Checkbox RGPD.

### Validation client-side
- Prenom/Nom : min 2 caracteres
- Email : regex validation
- Telephone : regex validation
- Pays : obligatoire
- RGPD : checkbox obligatoire
- Erreurs : message anime avec shake effect

### A connecter
Les formulaires valident cote client mais n'envoient pas encore les donnees. Integrer : Formspree, Supabase, ou endpoint API.

---

## Elements de conversion (lead gen)

| Element | Emplacement |
|---------|-------------|
| **WhatsApp flottant** | Bas droite, permanent (numero a configurer) |
| **Telephone flottant** | Au-dessus du WhatsApp (numero a configurer) |
| **Trust bar** | Apres le hero, 5 indicateurs cles |
| **Badge disponibilite** | Hero slide + modal (point vert anime) |
| **Compteur clients** | Section social proof (47, anime) |
| **CTA multiples** | Chaque section a un bouton vers la modale |

---

## SEO

Meta tags presents dans `index.html` :
- `description`, `keywords`, `author`, `robots`
- Open Graph : `og:title`, `og:description`, `og:type`, `og:locale`, `og:site_name`
- Twitter Card : `twitter:card`, `twitter:title`, `twitter:description`
- `canonical` URL (a mettre a jour avec le vrai domaine)

---

## Commandes utiles

```bash
# Lancer un serveur local
python3 -m http.server 8000
# puis ouvrir http://localhost:8000

# Structure du projet
find . -not -path './.git/*' -not -name '.git' | head -30

# Taille des fichiers
ls -lah index.html css/style.css js/main.js

# Chercher du contenu
grep -n "MOT" index.html css/style.css js/main.js
```

---

## Conventions de code

- **CSS** : Commentaires `/* === NOM === */`, variables CSS, classes kebab-case
- **HTML** : Commentaires `<!-- === NOM === -->`
- **JS** : Fonctions globales, vanilla JS, pas de modules
- **Nommage classes** : kebab-case (`sec-title`, `btn-primary`)
- **Nommage IDs** : kebab-case (`page-home`, `cursor-dot`)

---

## TODO restant

- [ ] Remplacer `971XXXXXXXXX` par le vrai numero WhatsApp/telephone
- [ ] Connecter les formulaires a un backend
- [ ] Ajouter Google Analytics (`gtag.js`)
- [ ] Ajouter un favicon
- [ ] Mettre a jour l'URL canonique avec le vrai domaine
- [ ] Optimiser les images (compression WebP/AVIF)
- [ ] Ajouter lazy loading sur les images
- [ ] Ajouter sitemap.xml et robots.txt
