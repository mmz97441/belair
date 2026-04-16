# CLAUDE.md — Analyse Projet BEL AIR

## Vue d'ensemble

**BEL AIR** est un site vitrine premium pour un cabinet de conseil en investissement immobilier international. La societe est francaise, basee operationnellement a Dubai, avec une presence terrain au Maroc et en Thailande. Le fondateur est **Mathieu Maillot**. Cible : investisseurs francophones (France, Belgique, Suisse, Luxembourg, Canada, DOM-TOM). Ticket moyen accompagne : 300-400 k EUR.

**Slogan** : "Investir a l'etranger avec methode. Pas avec espoir."

---

## Architecture technique

### Stack
- **HTML/CSS/JS pur** — Aucun framework, aucun bundler, aucun package manager
- **Fichier unique** : `belair-premium (4).html` (~6 Mo, 2184 lignes)
- **Images encodees en base64** directement dans le HTML (cause principale du poids du fichier)
- **Pas de backend** — Les formulaires ne soumettent rien cote serveur
- **Pas de build system** — Fichier statique a deployer tel quel

### Fonts (Google Fonts)
| Font | Usage |
|------|-------|
| **Playfair Display** | Titres h1-h4, chiffres, citations |
| **Cormorant Garamond** | Sous-titres italiques, taglines |
| **DM Sans** | Corps de texte, boutons, labels |

### Design System — Variables CSS
```css
--cream: #FAFAF8       /* Fond principal clair */
--ink: #1A1A1A         /* Texte principal */
--navy: #1C3557        /* Bleu premium / boutons */
--navy-deep: #0F2238   /* Sections sombres */
--gold: #C19F51        /* Accents dores / CTA */
--gold-light: #E0C880  /* Or clair */
--linen: #F0EFEB       /* Fond alternatif clair */
--red-soft: #8B3A3A    /* Non utilise actuellement */
```

### Esthetique
- Luxe / premium avec tons sombres et accents dores
- Alternance sections sombres (#0A0A0A) et claires (cream/linen)
- Typographie serif pour les titres, sans-serif pour le corps
- Overlay grain (canvas) pour texture filmique
- Curseur personnalise (point dore + anneau)

---

## Structure des pages (SPA)

Le site fonctionne en **Single Page Application** avec navigation JavaScript (`showPage()`). Toutes les pages sont dans le meme fichier HTML, affichees/cachees via la classe `.active`.

### 4 Pages

| ID | Nom | Description |
|----|-----|-------------|
| `page-home` | Accueil | Page principale avec toutes les sections marketing |
| `page-maroc` | Maroc | Page dediee a l'investissement au Maroc |
| `page-thai` | Thailande | Page dediee a l'investissement en Thailande |
| `page-contact` | Contact | Formulaire de contact complet |

### Navigation
- **Navbar fixe** (#navbar) : logo + 4 liens (Accueil, Maroc, Thailande, Contact) + bouton CTA
- **Menu mobile** (hamburger) : meme navigation en plein ecran
- **Footer** : navigation + liens legaux

---

## Sections de la page d'accueil (dans l'ordre)

| # | ID/Classe | Contenu |
|---|-----------|---------|
| 1 | `.hero` | Slider hero avec 2+ slides (Maroc + Thailande), fleches, dots, touch |
| 2 | Section grid | **"Votre situation"** — Identification du prospect (problemes, douleurs) |
| 3 | `.sec.sec-center` | **"Notre approche"** — Positionnement BEL AIR |
| 4 | Section grid | **Fondateur** — Mathieu Maillot, photo + bio |
| 5 | Section grid linen | **"Notre exigence vient de Dubai"** — Methode en 5 etapes + stat 90% |
| 6 | `.sec-fullbleed` | **"Presence terrain"** — Thailande + Maroc, equipes locales |
| 7 | `.sec.sec-linen` | **"Deux marches"** — Cards Maroc + Thailande avec CTA |
| 8 | `.sec.sec-center` | **"Clients accompagnes"** — Compteur anime (47 investisseurs) |
| 9 | `.testi-editorial` | **Temoignages** — Carrousel editorial avec 3 temoignages |
| 10 | Section grid | **"Ce que vous cherchez vraiment"** — Projection / benefices |
| 11 | `.final-sec` | **CTA final** — "Planifier un echange strategique" |

---

## Composants JavaScript

| Fonctionnalite | Description |
|----------------|-------------|
| **Grain Canvas** | Bruit visuel anime sur canvas overlay (texture filmique) |
| **Curseur custom** | Point dore (#cursor-dot) + anneau (#cursor-ring) suivant la souris |
| **Hero Slider** | Slides auto avec dots, fleches, support touch/swipe |
| **SPA Router** | `showPage(name)` — affiche/cache les pages, met a jour la nav |
| **Menu mobile** | `openMobile()` / `closeMobile()` |
| **Modal contact** | `openModal()` / `closeModal()` — formulaire dans une modale |
| **Formulaires** | `submitModal()` / `submitContactPage()` — affichent un message de succes (pas d'envoi reel) |
| **Scroll Reveal** | IntersectionObserver sur `.reveal` — fade-in au scroll |
| **Compteur anime** | `animateCounter()` sur #counter-clients (cible: 47) |
| **Temoignages** | `goTesti(n)` — carrousel editorial avec 3 temoignages |
| **Video autoplay** | Detection IntersectionObserver pour lecture auto des videos |
| **Navbar scroll** | Classe `.scrolled` ajoutee au scroll (fond opaque) |

---

## Formulaires

### Modal de contact (globale)
Champs : Prenom, Nom, Email, Telephone, Pays de residence (select), Marche d'interet (radio: Maroc/Thailande/Les deux), Message (optionnel), Checkbox RGPD.

### Page contact
Memes champs que la modale, dans une mise en page dediee avec infos de contact a droite.

**IMPORTANT** : Aucun formulaire n'envoie de donnees. Les fonctions `submitModal()` et `submitContactPage()` ne font qu'afficher un message de succes cote client.

---

## Contenu textuel cle

### Proposition de valeur
- "Nous ne vendons pas des biens. Nous structurons des investissements."
- 90% des projets analyses sont ecartes
- 47 investisseurs accompagnes
- Presence terrain active au Maroc et en Thailande
- Methode en 5 etapes : Analyse zones > Selection projets > Verification terrain > Alignement strategie > Accompagnement complet

### Temoignages (3)
1. Marc-Olivier T. — Saint-Denis, La Reunion
2. Sandrine B. — Saint-Pierre, La Reunion
3. Frederic A. — Le Tampon, La Reunion

**Note** : Les temoignages mentionnent "Immorun" au lieu de "BEL AIR" (ancien nom probable, a corriger).

---

## Problemes identifies / Points d'amelioration

### Bugs
- [ ] **Images cassees** : Plusieurs balises `<img>` n'ont pas d'attribut `src=` (seulement `style=`), donc elles ne s'affichent pas
- [ ] **Slides hero dupliques** : Deux slides identiques "Maroc" dans le hero (commentaire "Slide 2 - Maroc" x2)
- [ ] **Incoherence de marque** : Les temoignages mentionnent "Immorun" au lieu de "BEL AIR"
- [ ] **Pas d'autoplay slider** : Le hero slider ne change pas automatiquement (pas de `setInterval`)

### Architecture
- [ ] **Fichier monolithique** : Tout dans un seul fichier HTML de 6 Mo — difficile a maintenir
- [ ] **Images base64** : Alourdissent enormement le fichier. Devraient etre des fichiers separes
- [ ] **Pas de backend** : Les formulaires ne fonctionnent pas reellement
- [ ] **Pas de meta SEO** : Pas de description, pas d'Open Graph, pas de schema.org
- [ ] **Pas d'analytics** : Aucun tracking (Google Analytics, etc.)
- [ ] **Pas de favicon**

### Pages manquantes
- [ ] **Mentions legales** — Lien present mais page inexistante
- [ ] **Politique de confidentialite** — Lien present mais page inexistante
- [ ] **RGPD** — Lien present mais page inexistante

### UX/Performance
- [ ] **Curseur custom** masque le curseur natif (`cursor: none !important`) — probleme d'accessibilite
- [ ] **Responsive partiel** : Quelques media queries mais sections grid non adaptees au mobile
- [ ] **Poids de page** : ~6 Mo pour une seule page (images base64)
- [ ] **Pas de lazy loading** sur les images

---

## Arborescence du repo

```
belair/
├── .git/
├── belair-premium (4).html    # Fichier unique — tout le site
└── CLAUDE.md                  # Ce fichier
```

---

## Commandes utiles

```bash
# Ouvrir le site localement
open "belair-premium (4).html"
# ou
python3 -m http.server 8000   # puis http://localhost:8000

# Compter les lignes
wc -l "belair-premium (4).html"   # 2184 lignes

# Chercher une section
grep -n "SECTION_NAME" "belair-premium (4).html"
```

---

## Plan de refactoring recommande

### Phase 1 — Corrections immediates
1. Corriger les balises `<img>` cassees (ajouter `src=`)
2. Supprimer le slide hero duplique
3. Remplacer "Immorun" par "BEL AIR" dans les temoignages
4. Ajouter l'autoplay au slider hero

### Phase 2 — Separation des assets
1. Extraire les images base64 en fichiers separes (`/assets/images/`)
2. Separer le CSS dans un fichier `style.css`
3. Separer le JS dans un fichier `main.js`
4. Renommer le fichier HTML en `index.html`

### Phase 3 — Fonctionnalites manquantes
1. Connecter les formulaires a un backend (Supabase, Formspree, etc.)
2. Creer les pages legales (mentions, confidentialite, RGPD)
3. Ajouter meta SEO + Open Graph
4. Ajouter Google Analytics / tracking
5. Ajouter un favicon

### Phase 4 — Optimisation
1. Optimiser les images (compression, formats modernes WebP/AVIF)
2. Implementer le lazy loading
3. Ameliorer le responsive design
4. Tester l'accessibilite (WCAG)
5. Ajouter un sitemap.xml et robots.txt

---

## Conventions de code

- **CSS** : Commentaires avec `/* === NOM === */`, variables CSS, classes BEM-like
- **HTML** : Commentaires avec `<!-- === NOM === -->`
- **JS** : Fonctions globales, pas de modules, vanilla JS
- **Langue** : Contenu en francais, code/commentaires mixte francais/anglais
- **Nommage classes** : kebab-case (`sec-title`, `btn-primary`, `nav-cta-btn`)
- **Nommage IDs** : kebab-case (`page-home`, `cursor-dot`, `modal-success`)
