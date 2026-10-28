// Connexion du CRM à Supabase (base de données + comptes utilisateurs).
// Renseignez les deux valeurs depuis Supabase > Project Settings > API.
// La clé « publishable » (ou « anon ») est faite pour être publique : la
// sécurité repose sur les règles d'accès définies dans supabase-schema.sql.
// Laissez vide pour la version Artefact Claude (stockage intégré).
window.SOAGA_SUPABASE = {
  url: "",
  key: ""
};
