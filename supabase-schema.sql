-- =====================================================================
-- CRM SOAGA — schéma Supabase (base de données + règles d'accès)
-- À exécuter une seule fois : Supabase > SQL Editor > New query > coller > Run
-- =====================================================================

-- 1. Profils des utilisateurs (créés automatiquement à l'inscription)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  color      text,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Données du CRM : une ligne par fiche, rangée par « collection »
--    (contacts, tasks, tickets, interactions, audit, team, campaigns, kb_articles)
create table if not exists public.records (
  collection text not null,
  id         text not null,
  data       jsonb not null default '{}'::jsonb,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);
create index if not exists records_collection_created_idx on public.records (collection, created_at desc);
alter table public.records replica identity full;

-- 3. Fonctions utilitaires
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Mise à jour partielle atomique (équivalent de doc(id).update(patch))
create or replace function public.merge_record(p_collection text, p_id text, p_patch jsonb)
returns void language sql security invoker set search_path = public as $$
  update public.records
     set data = data || p_patch, updated_at = now()
   where collection = p_collection and id = p_id;
$$;

-- Profil créé à l'inscription ; le tout premier compte devient administrateur
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare palette text[] := array['#990000','#111A31','#C87B63','#355097','#F99706','#4B261B'];
begin
  insert into public.profiles (id, name, email, color, is_admin)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name',''), split_part(new.email,'@',1)),
    new.email,
    palette[1 + floor(random()*array_length(palette,1))::int],
    not exists (select 1 from public.profiles)
  );
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seul un administrateur peut changer le statut administrateur d'un profil
create or replace function public.protect_admin_flag() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() est vide quand la requête vient du SQL Editor (propriétaire du projet)
  if new.is_admin is distinct from old.is_admin and auth.uid() is not null and not public.is_admin() then
    raise exception 'Seul un administrateur peut modifier ce droit.';
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_admin on public.profiles;
create trigger profiles_protect_admin before update on public.profiles
  for each row execute function public.protect_admin_flag();

-- 4. Règles d'accès (Row Level Security)
alter table public.profiles enable row level security;
alter table public.records  enable row level security;

drop policy if exists "profils lisibles par l'équipe" on public.profiles;
create policy "profils lisibles par l'équipe" on public.profiles
  for select to authenticated using (true);

drop policy if exists "chacun modifie son profil" on public.profiles;
create policy "chacun modifie son profil" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "lecture équipe" on public.records;
create policy "lecture équipe" on public.records
  for select to authenticated using (true);

-- Création : tout membre connecté ; pour « team », seulement sa propre ligne (ou admin)
drop policy if exists "création" on public.records;
create policy "création" on public.records
  for insert to authenticated with check (
    collection <> 'team' or id = auth.uid()::text or public.is_admin()
  );

-- Modification : jamais sur le journal d'audit (traces non modifiables)
drop policy if exists "modification" on public.records;
create policy "modification" on public.records
  for update to authenticated using (
    collection <> 'audit' and (collection <> 'team' or id = auth.uid()::text or public.is_admin())
  );

-- Suppression : jamais sur le journal d'audit ; « team » réservé aux admins
drop policy if exists "suppression" on public.records;
create policy "suppression" on public.records
  for delete to authenticated using (
    collection <> 'audit' and (collection <> 'team' or public.is_admin())
  );

-- 5. Temps réel : diffuser les changements à tous les navigateurs connectés
do $$ begin
  alter publication supabase_realtime add table public.records;
exception when duplicate_object then null; end $$;
