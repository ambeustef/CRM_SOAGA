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
- **Rôles et accès** — le rôle est **attribué par un administrateur** (page « Équipe ») et détermine les modules visibles et le tableau de bord :
  - *Commercial* : tableau de bord de son portefeuille (mes leads, mon pipeline, mes tâches, mes leads sans suivi), Leads, Pipeline, Clients, Activités, Base de connaissances ;
  - *Service client* : tableau de bord tickets / SLA / satisfaction, Clients, Activités, Tickets, Base de connaissances ;
  - *Marketing* : tableau de bord sources / campagnes / consentements, Leads, Campagnes, Base de connaissances, Rapports ;
  - *Direction* et *Administrateur* : tous les modules et la vue d'ensemble.
  L'attribution des rôles est vérifiée par le stockage (personne ne peut se donner un rôle lui-même). Les restrictions de modules sont appliquées par l'application ; un cloisonnement des données par rôle côté serveur reste à faire.
- **Import de leads (CSV)** — import d'un fichier Excel enregistré en CSV, avec aperçu, reconnaissance automatique des colonnes (Nom ou Prénom + Nom, E-mail, Téléphone, Société, Source, Notes), détection des doublons et modèle téléchargeable.
- **Doublons** — alerte à la création d'une fiche et badge « Doublon ? » (même e-mail, même téléphone ou même nom + société).
- **Consentements** — e-mail / SMS / WhatsApp par fiche, avec date et origine ; les campagnes e-mail / SMS / WhatsApp ne ciblent que les contacts ayant consenti.
- **Leads sans suivi** — un lead sans propriétaire, ou sans échange ni tâche depuis plus de 48 h, est signalé (filtre dédié, alerte sur le tableau de bord).
- **Service client enrichi** — base de connaissances (FAQ), escalade d'un ticket (passe en urgence + crée une tâche de suivi automatique), note de satisfaction (CSAT) à la clôture.
- **Campagnes marketing (simulées)** — création d'une campagne ciblée (étape/source), lancement générant des statistiques d'envoi/ouverture/clic/conversion simulées pour la démonstration (aucun message n'est réellement envoyé).
- **Rapports** — filtres par période et par propriétaire, délai moyen de résolution des tickets, CSAT moyen, prévisions par propriétaire, et export CSV des fiches.

## Fichiers

- `landing.html` — page vitrine publique (façon zoho.com/soaga.net) : présentation du produit, captures d'écran réelles, bouton « Se connecter » vers l'application. C'est la page qu'on verrait avant de se connecter.
- `index.html` — l'application CRM elle-même (HTML/CSS/JS, un seul fichier, sans dépendance de build). C'est la page « après connexion ».
- `fonds.json` — valeurs liquidatives des fonds SOAGA affichées dans la bande déroulante de la vitrine (nom, catégorie, variation, YTD, VL, date). Pour mettre à jour : modifier ce fichier et l'envoyer sur GitHub.
- `config.js` — adresse et clé publique du projet Supabase (à renseigner).
- `supabase-adapter.js` — connecteur Supabase : connexion, base de données, temps réel.
- `supabase-schema.sql` — tables et règles d'accès à exécuter une fois dans Supabase.
- `dashboard.png`, `pipeline.png` — captures d'écran réelles de l'application, utilisées par `landing.html`.
- `persona-*.jpg`, `photo-*.jpg`, `campagne-1.jpg` — photos issues du Brand Guideline SOAGA 2026, utilisées par `landing.html` (personas clients, visuels d'équipe et de campagne).

## Comment l'ouvrir

### Option 1 — Artefact Claude (version actuelle, avec données partagées en direct)
Les deux pages sont publiées comme Artefacts Claude, avec stockage partagé en temps réel pour le CRM (toute personne ayant le lien voit et modifie les mêmes données) :
- Page vitrine : https://claude.ai/artifact/3n1sVxCeQsRGNmcovbduhn
- Application CRM : https://claude.ai/artifact/WhV6Y9FvREwGAj2Nu6rtaA

### Option 2 — Mise en ligne avec Supabase (vraie base + vrais comptes)
Hors Artefact Claude (Vercel, serveur…), l'application se branche sur **Supabase** (offre gratuite) grâce à `supabase-adapter.js` : vrais comptes e-mail / mot de passe, données partagées en temps réel entre collègues, journal d'audit conservé en base et **non modifiable** (règle appliquée côté serveur).

1. Créez un compte gratuit sur https://supabase.com puis un projet (région la plus proche, ex. *West EU*).
2. Dans **SQL Editor → New query**, collez tout le contenu de `supabase-schema.sql` et cliquez **Run**.
3. Dans **Authentication → Sign In / Providers → Email**, pour le prototype vous pouvez désactiver *Confirm email* (sinon chaque nouveau compte doit cliquer le lien reçu par e-mail).
4. Dans **Project Settings → API**, copiez l'**URL du projet** et la clé **publishable** (ou *anon*), et collez-les dans `config.js`.
5. Envoyez sur GitHub : Vercel redéploie tout seul.

Adresses sur Vercel :
- `/landing` — la vitrine ; « Se connecter » y fait une vraie connexion puis ouvre l'application.
- `/app` — l'application CRM (écran de connexion / création de compte si besoin).

Règles d'accès (définies dans `supabase-schema.sql`) :
- Il faut être connecté pour lire ou écrire quoi que ce soit.
- Le **premier compte créé devient administrateur** (accès à la page « Équipe »). Pour nommer un autre administrateur : `update profiles set is_admin = true where email = 'prenom.nom@soaga.net';` dans le SQL Editor.
- Chaque membre ne peut modifier que son propre rôle ; seul un administrateur gère l'équipe.
- Le journal d'audit ne peut être ni modifié ni supprimé par personne depuis l'application.

Si `config.js` est vide, l'application s'ouvre mais affiche « Base de données non configurée » et n'enregistre rien. Dans l'Artefact Claude, `config.js` est ignoré et le stockage intégré est utilisé.

## Prochaines étapes possibles

- Couleurs exactes de la charte SOAGA (logo/charte officielle à confirmer).
- Modules supplémentaires du cahier des besoins : marketing automation, réseaux sociaux, chatbot, WhatsApp Business, intégrations SI (Atlantis SGO, VALORIX, GESSICAV, Active Directory / Entra ID, Microsoft 365), sécurité et conformité avancées.

---
*Document de travail — prototype, non destiné à un usage en production tel quel.*
