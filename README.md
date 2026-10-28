# CRM SOAGA — Prototype

Prototype de CRM (gestion de la relation client) aux couleurs de la charte SOAGA, construit à partir du *Cahier de besoins — Acquisition et déploiement d'une solution de Gestion de la Relation Client (CRM)* (SOAGA, août 2026).

## Périmètre de cette v1 ("cœur commercial")

Le cahier de besoins couvre un périmètre très large (leads, pipeline, marketing automation, réseaux sociaux, chatbot, WhatsApp Business, service client avec SLA, vision 360°, reporting, intégrations SI, sécurité…). Cette première version se concentre sur le cœur commercial :

- **Leads** — capture, qualification, scoring (froid / tiède / chaud).
- **Pipeline commercial** — vue Kanban glisser-déposer sur les 8 étapes du cahier (Nouveau lead → À qualifier → Qualifié → Prospect → Opportunité → Client / Perdu / À réactiver).
- **Clients & partenaires** — fiche 360° : informations, historique des échanges, activités liées, tickets liés.
- **Activités & tâches** — appels, rendez-vous, relances, avec repérage des échéances en retard.
- **Tickets & réclamations** — catégorie, priorité, statut, et calcul automatique du respect du SLA (4h / 24h / 72h / 5j selon la priorité).
- **Tableau de bord** — KPI (leads actifs, taux de conversion, valeur du pipeline, tickets ouverts), répartition du pipeline, activité récente, échéances de la semaine.

## Fichier

- `index.html` — l'application complète (HTML/CSS/JS, un seul fichier, sans dépendance de build).

## Comment l'ouvrir

### Option 1 — Artefact Claude (version actuelle, avec données partagées en direct)
Le prototype est publié comme Artefact Claude, avec stockage partagé en temps réel (toute personne ayant le lien voit et modifie les mêmes données) :
https://claude.ai/artifact/WhV6Y9FvREwGAj2Nu6rtaA

### Option 2 — Ouverture locale / hébergement statique
`index.html` peut aussi être ouvert directement dans un navigateur ou hébergé sur n'importe quel serveur statique (GitHub Pages, Netlify, etc.). Dans ce cas, le stockage partagé spécifique aux Artefacts Claude (`window.claude`) n'est pas disponible : l'application affiche un bandeau d'avertissement et fonctionne en mode lecture seule / état vide, sans backend de secours branché. Pour un déploiement réel (hors Artefact Claude), il faudra remplacer la couche de stockage par une vraie base de données / API.

## Prochaines étapes possibles

- Couleurs exactes de la charte SOAGA (logo/charte officielle à confirmer).
- Modules supplémentaires du cahier des besoins : marketing automation, réseaux sociaux, chatbot, WhatsApp Business, intégrations SI (Atlantis SGO, VALORIX, GESSICAV, Active Directory / Entra ID, Microsoft 365), sécurité et conformité avancées.
- Hébergement sur un serveur dédié pour des tests en conditions réelles avec l'équipe.

---
*Document de travail — prototype, non destiné à un usage en production tel quel.*
