/*
# Create study_resources and profiles tables for IsetHub

1. New Tables
- `study_resources`: documents shared by students (cours, examens, TD, TP, résumés).
  - `id` (uuid, primary key)
  - `title` (text, not null): document title
  - `resource_type` (text, not null): Cours / Examen / TD / TP / Résumé
  - `department` (text, not null): IT / Gestion / Mécanique / Électrique
  - `semester` (text, not null): S1..S6
  - `author_name` (text, not null): display name of the contributor
  - `votes` (integer, not null, default 0): helpfulness votes
  - `created_at` (timestamptz, default now())
- `profiles`: public profile info for signed-up students, keyed by auth user id.
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `department` (text)
  - `avatar_initials` (text)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- `study_resources` is intentionally shared between all students: SELECT is open
  (anon + authenticated), INSERT/UPDATE/DELETE require a signed-in user so only
  members can add or modify shared documents.
- `profiles` is owner-scoped: a signed-in user can read and update only their own
  profile row; inserts are allowed for the owner (the app upserts its own profile
  after sign-up).
- Grants: study_resources SELECT to anon + authenticated, writes to authenticated;
  profiles SELECT/INSERT/UPDATE to authenticated. service_role granted on both for
  administrative access.

3. Notes
- The frontend falls back to local demo data when no study_resources rows exist,
  so seeding is optional.
*/

CREATE TABLE IF NOT EXISTS study_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  resource_type text NOT NULL,
  department text NOT NULL,
  semester text NOT NULL,
  author_name text NOT NULL DEFAULT 'Étudiant ISET',
  votes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  department text,
  avatar_initials text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON study_resources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON study_resources TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON study_resources, profiles TO service_role;

DROP POLICY IF EXISTS "study_resources_select_public" ON study_resources;
CREATE POLICY "study_resources_select_public" ON study_resources
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "study_resources_insert_authenticated" ON study_resources;
CREATE POLICY "study_resources_insert_authenticated" ON study_resources
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "study_resources_update_authenticated" ON study_resources;
CREATE POLICY "study_resources_update_authenticated" ON study_resources
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "study_resources_delete_authenticated" ON study_resources;
CREATE POLICY "study_resources_delete_authenticated" ON study_resources
FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
