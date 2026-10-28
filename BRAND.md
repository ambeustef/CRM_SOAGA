# Charte SOAGA — référence de marque

Source : *SOAGA Brand Guideline 2026 — charte digitale* (document officiel fourni par le client, Aweni Design).
Ce fichier sert de mémoire de projet : toute nouvelle fonctionnalité ou nouvel écran doit respecter ces valeurs.

## Couleurs

### Palette principale (Web & Print)
| Usage | Hex |
|---|---|
| Rouge primaire (Crimson Red) | `#990000` |
| Terracotta clair | `#D2AE9F` |
| Bleu marine | `#111A31` |
| Gris | `#BCBABA` |
| Or / doré | `#FCC97D` |

Règle de la charte : **3 couleurs maximum** par création.

### Palette monochrome détaillée
- **A. Primaire — Crimson red `#990000`** (CMYK 0,100,100,40) — nuances `#4D0000` (foncé) / `#CC0000` / `#FF9999` (clair)
- **B. Secondaire 1 — Terracotta `#C87B63`** (CMYK 0,39,51,22) — nuances `#4B261B` / `#BD5F42` / `#E4BFB4`
- **B. Secondaire 2 — Bleu marine `#111A31` / `#141E39`** (CMYK 65,47,0,81) — nuances `#141E39` / `#355097` / `#A0B2DE`
- **C. Tertiaire — Or `#FCC97D`** (CMYK 0,20,50,1) — nuances `#643D02` / `#F99706` / `#FEEACD`
- **C. Neutre 1** (gris) `#565759`
- **C. Neutre 2** (blanc cassé, surfaces) `#FFFAFA`
- **C. Neutre 3** (crème, fond) `#FFF8ED`
- Vert — usage exceptionnel uniquement, à éviter en usage courant.

## Typographie

| Support | Corps de texte | Titrage & emphase |
|---|---|---|
| Web | **Roboto** | **Helvetica** |
| Print | **Futura** | **Helvetica** |

→ Pour le CRM (web) : Roboto en corps de texte, pile Helvetica Neue/Helvetica/Arial pour les titres, boutons et éléments de navigation (emphase).

## Logo

- Pictogramme : silhouette du continent africain composée de blocs arrondis, en rouge et bleu marine (version couleur) ou en un seul ton (déclinaisons).
- Wordmark : « SOAGA » en rouge primaire (usage principal) ou en bleu marine (usage secondaire), accompagné de la signature « Société Ouest Africaine de Gestion d'Actifs ».
- Déclinaisons d'icône (app/web) : pictogramme blanc sur carré rouge plein (usage principal des icônes d'app), pictogramme couleur sur fond blanc/crème, pictogramme blanc sur marine/noir.
- Règle : ne jamais recomposer le pictogramme autrement que par blocs arrondis alignés en forme de continent.

## Ton de marque (rappel court)

Précurseur, expert, altruiste, exclusif, constant et fiable. Message : accessibilité, simplicité, expertise financière, panafricanisme. Accroche courante : « Épargnez simplement, réalisez aisément. »

## Logo — fichier réel

`logo-icon.png` est le **vrai** pictogramme SOAGA (carré rouge arrondi + silhouette Afrique en blocs blancs), extrait directement des pages « Logotype » et « Supports Web » du Brand Guideline officiel (rendu haute résolution du PDF, fond détouré en transparent). Ce n'est plus une reconstitution approximative : `index.html` et `landing.html` chargent ce fichier via `<img src="logo-icon.png">` partout où le logo apparaît (barre latérale, navigation, pied de page). Ne jamais revenir à un SVG recomposé à la main pour ce pictogramme.

## Où c'est appliqué dans ce repo

`index.html` (le CRM) utilise ces valeurs comme tokens CSS (`--accent`, `--navy`, etc. dans `:root`) — modifier la palette ou les polices se fait à cet endroit uniquement, jamais en dur dans les composants.
