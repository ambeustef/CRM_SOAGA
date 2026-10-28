# CRM SOAGA — Prototype

Prototype de CRM (gestion de la relation client) aux couleurs de la charte SOAGA, construit à partir du *Cahier de besoins — Acquisition et déploiement d'une solution de Gestion de la Relation Client (CRM)* (SOAGA, août 2026).

Identité visuelle (couleurs, logo, typographie) conforme à `BRAND.md`, extrait du *SOAGA Brand Guideline 2026 — charte digitale* officiel.

## Périmètre de cette v1 ("cœur commercial")

Le cahier de besoins couvre un périmètre très large (leads, pipeline, marketing automation, réseaux sociaux, chatbot, WhatsApp Business, service client avec SLA, vision 360°, reporting, intégrations SI, sécurité…). Cette première version se concentre sur le cœur commercial :

- **Leads** — capture, qualification, scoring (froid / tiède / chaud).
- **Pipeline commercial** — vue Kanban glisser-déposer sur les 8 étapes du cahier (Nouveau lead → À qualifier → Qualifié → Prospect → Opportunité → Client / Perdu / À réactiver).
- **Clients & partenaires** — fiche 360° : informations, historique des échanges, activités liées, tickets liés.
- **Activités & tâches** — appels, rendez-vous, relances, avec repérage des échéances en retard.
- **Tickets & réclamations** — catégorie, priorité, statut, et calcul automatique du respect du SLA (4h / 24h / 72h / 5j selon la priorité).
- **Tableau de bord** — KPI (leads actifs, taux de conversion, valeur du pipeline, tickets ouverts, CSAT moyen), répartition du pipeline, activité récente, échéances de la semaine, motifs récurrents.
- **Journal d'audit** — qui a créé, modifié (valeur avant → après) ou supprimé chaque fiche/tâche/ticket/campagne, avec auteur et date ; visible par fiche (onglet « Journal ») et dans le flux d'activité global du tableau de bord.
- **Rôles & équipe** — chaque personne choisit son rôle (Commercial, Service client, Marketing, Direction, Administrateur) depuis son profil. Page « Équipe » réservée aux éditeurs de l'artefact pour gérer les rôles de l'équipe — c'est la seule restriction réellement appliquée côté stockage (via les règles d'accès de la base de l'artefact) ; le reste de la différenciation par rôle est à but d'affichage uniquement.
- **Service client enrichi** — base de connaissances (FAQ), escalade d'un ticket (passe en urgence + crée une tâche de suivi automatique), note de satisfaction (CSAT) à la clôture.
- **Campagnes marketing (simulées)** — création d'une campagne ciblée (étape/source), lancement générant des statistiques d'envoi/ouverture/clic/conversion simulées pour la démonstration (aucun message n'est réellement envoyé).
- **Rapports** — filtres par période et par propriétaire, délai moyen de résolution des tickets, CSAT moyen, prévisions par propriétaire, et export CSV des fiches.

## Fichiers

- `landing.html` — page vitrine publique (façon zoho.com/soaga.net) : présentation du produit, captures d'écran réelles, bouton « Se connecter » vers l'application. C'est la page qu'on verrait avant de se connecter.
- `index.html` — l'application CRM elle-même (HTML/CSS/JS, un seul fichier, sans dépendance de build). C'est la page « après connexion ».
- `dashboard.png`, `pipeline.png` — captures d'écran réelles de l'application, utilisées par `landing.html`.

## Comment l'ouvrir

### Option 1 — Artefact Claude (version actuelle, avec données partagées en direct)
Les deux pages sont publiées comme Artefacts Claude, avec stockage partagé en temps réel pour le CRM (toute personne ayant le lien voit et modifie les mêmes données) :
- Page vitrine : https://claude.ai/artifact/3n1sVxCeQsRGNmcovbduhn
- Application CRM : https://claude.ai/artifact/WhV6Y9FvREwGAj2Nu6rtaA

### Option 2 — Ouverture locale / hébergement statique
`index.html` peut aussi être ouvert directement dans un navigateur ou hébergé sur n'importe quel serveur statique (GitHub Pages, Netlify, etc.). Dans ce cas, le stockage partagé spécifique aux Artefacts Claude (`window.claude`) n'est pas disponible : l'application affiche un bandeau d'avertissement et fonctionne en mode lecture seule / état vide, sans backend de secours branché. Pour un déploiement réel (hors Artefact Claude), il faudra remplacer la couche de stockage par une vraie base de données / API.

## Prochaines étapes possibles

- Couleurs exactes de la charte SOAGA (logo/charte officielle à confirmer).
- Modules supplémentaires du cahier des besoins : marketing automation, réseaux sociaux, chatbot, WhatsApp Business, intégrations SI (Atlantis SGO, VALORIX, GESSICAV, Active Directory / Entra ID, Microsoft 365), sécurité et conformité avancées.
- Hébergement sur un serveur dédié pour des tests en conditions réelles avec l'équipe.

---
*Document de travail — prototype, non destiné à un usage en production tel quel.*
