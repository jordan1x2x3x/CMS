-- ============================================================
-- MTU Clearance Management System — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── ENUM types ───────────────────────────────────────────────
create type user_role as enum ('student', 'officer', 'admin', 'super_admin');
create type clearance_status as enum ('pending', 'approved', 'flagged', 'rejected');
create type request_status as enum ('draft', 'submitted', 'completed', 'cancelled');

-- ── PROFILES ─────────────────────────────────────────────────
-- Extends auth.users; one row per registered user.
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          user_role        not null,
  first_name    text             not null,
  last_name     text             not null,
  email         text             not null unique,
  matric_number text             unique,          -- students only
  department    text,                             -- students & officers
  college       text,                             -- students only
  programme     text,                             -- students only
  is_active     boolean          not null default true,
  created_at    timestamptz      not null default now(),
  updated_at    timestamptz      not null default now()
);

-- ── DEPARTMENTS ──────────────────────────────────────────────
create table departments (
  id          text primary key,   -- e.g. 'hod', 'library', 'bursary'
  name        text not null,
  description text,
  sort_order  int  not null default 0,
  is_active   boolean not null default true
);

-- Seed all 15 departments
insert into departments (id, name, sort_order) values
  ('hod',           'Head of Department',          1),
  ('cedgs',         'CEDGS',                        2),
  ('lab',           'Lab Instructor',               3),
  ('college',       'College Officer',              4),
  ('esm',           'ESM (Music)',                  5),
  ('chapel',        'Chapel',                       6),
  ('health',        'Health Centre',                7),
  ('sport',         'Sport',                        8),
  ('hall',          'Hall of Residence',            9),
  ('ict',           'ICT Unit',                    10),
  ('alumni',        'Alumni',                      11),
  ('student_affairs','Student Affairs',            12),
  ('library',       'Library',                     13),
  ('bursary',       'Bursary',                     14),
  ('academic',      'Academic Affairs',            15);

-- ── ACCESS CODES ─────────────────────────────────────────────
-- One-time codes issued by super_admin for officer/admin signup.
create table access_codes (
  id           uuid primary key default uuid_generate_v4(),
  code         text        not null unique,
  intended_role user_role  not null,              -- which role this code unlocks
  issued_to    text,                              -- optional: name/email hint
  used_by      uuid references profiles(id),
  used_at      timestamptz,
  expires_at   timestamptz not null default (now() + interval '7 days'),
  created_by   uuid references profiles(id),
  created_at   timestamptz not null default now()
);

-- ── CLEARANCE REQUESTS ───────────────────────────────────────
-- One row per student clearance application.
create table clearance_requests (
  id             uuid primary key default uuid_generate_v4(),
  student_id     uuid        not null references profiles(id) on delete cascade,
  academic_year  text        not null,            -- e.g. '2024/2025'
  status         request_status not null default 'draft',
  submitted_at   timestamptz,
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── CLEARANCE ITEMS ──────────────────────────────────────────
-- One row per (request × department) — tracks each department's decision.
create table clearance_items (
  id            uuid primary key default uuid_generate_v4(),
  request_id    uuid           not null references clearance_requests(id) on delete cascade,
  department_id text           not null references departments(id),
  status        clearance_status not null default 'pending',
  reviewed_by   uuid           references profiles(id),
  reason        text,          -- officer's flag/rejection reason
  comment       text,          -- officer's internal note
  reviewed_at   timestamptz,
  created_at    timestamptz    not null default now(),
  updated_at    timestamptz    not null default now(),
  unique (request_id, department_id)
);

-- ── DOCUMENTS ────────────────────────────────────────────────
-- Files uploaded by students for a specific clearance item.
create table documents (
  id            uuid primary key default uuid_generate_v4(),
  item_id       uuid  not null references clearance_items(id) on delete cascade,
  student_id    uuid  not null references profiles(id) on delete cascade,
  file_name     text  not null,
  storage_path  text  not null,   -- Supabase Storage object path
  mime_type     text,
  uploaded_at   timestamptz not null default now()
);

-- ── AUDIT LOGS ───────────────────────────────────────────────
create table audit_logs (
  id         uuid primary key default uuid_generate_v4(),
  actor_id   uuid references profiles(id),
  action     text        not null,   -- e.g. 'approve_item', 'reject_item', 'login'
  target_id  uuid,                   -- optional: the clearance_item or user affected
  meta       jsonb       not null default '{}',
  created_at timestamptz not null default now()
);

-- ── UPDATED_AT triggers ──────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger trg_requests_updated_at
  before update on clearance_requests
  for each row execute procedure set_updated_at();

create trigger trg_items_updated_at
  before update on clearance_items
  for each row execute procedure set_updated_at();

-- ── Auto-create profile after auth.users insert ───────────────
-- Called from the app after signUp; kept as fallback via trigger.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  -- Profile is inserted by the app with full metadata.
  -- This trigger is a no-op safety net; the app insert takes precedence.
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ════════════════════════════════════════════════════════════════
--  ROW-LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════

alter table profiles           enable row level security;
alter table access_codes       enable row level security;
alter table clearance_requests enable row level security;
alter table clearance_items    enable row level security;
alter table documents          enable row level security;
alter table audit_logs         enable row level security;
alter table departments        enable row level security;

-- Helper: current user's role (avoids repeated sub-selects)
create or replace function my_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid();
$$;

-- ── departments (public read) ────────────────────────────────
create policy "Anyone can read departments"
  on departments for select using (true);

create policy "Admin+ can manage departments"
  on departments for all
  using (my_role() in ('admin', 'super_admin'));

-- ── profiles ─────────────────────────────────────────────────
create policy "Own profile is always readable"
  on profiles for select
  using (id = auth.uid());

create policy "Admin+ can read all profiles"
  on profiles for select
  using (my_role() in ('admin', 'super_admin'));

create policy "Officers can read student profiles"
  on profiles for select
  using (my_role() = 'officer');

create policy "Insert own profile on signup"
  on profiles for insert
  with check (id = auth.uid());

create policy "Update own profile"
  on profiles for update
  using (id = auth.uid());

create policy "Super admin can update any profile"
  on profiles for update
  using (my_role() = 'super_admin');

-- ── access_codes ─────────────────────────────────────────────
create policy "Super admin manages access codes"
  on access_codes for all
  using (my_role() = 'super_admin');

create policy "Anyone can read a code to validate it (anon signup)"
  on access_codes for select
  using (true);

-- ── clearance_requests ───────────────────────────────────────
create policy "Students see own requests"
  on clearance_requests for select
  using (student_id = auth.uid());

create policy "Students insert own requests"
  on clearance_requests for insert
  with check (student_id = auth.uid());

create policy "Students update own draft requests"
  on clearance_requests for update
  using (student_id = auth.uid() and status = 'draft');

create policy "Officers see all submitted requests"
  on clearance_requests for select
  using (my_role() in ('officer', 'admin', 'super_admin'));

create policy "Admin+ see all requests"
  on clearance_requests for select
  using (my_role() in ('admin', 'super_admin'));

-- ── clearance_items ──────────────────────────────────────────
create policy "Students see own items"
  on clearance_items for select
  using (
    exists (
      select 1 from clearance_requests r
      where r.id = clearance_items.request_id
        and r.student_id = auth.uid()
    )
  );

create policy "Officers see items for their department"
  on clearance_items for select
  using (
    my_role() = 'officer' and
    department_id = (select department from profiles where id = auth.uid())
  );

create policy "Officers update items for their department"
  on clearance_items for update
  using (
    my_role() = 'officer' and
    department_id = (select department from profiles where id = auth.uid())
  );

create policy "Admin+ see all items"
  on clearance_items for select
  using (my_role() in ('admin', 'super_admin'));

create policy "System can insert items"
  on clearance_items for insert
  with check (
    exists (
      select 1 from clearance_requests r
      where r.id = clearance_items.request_id
        and r.student_id = auth.uid()
    )
  );

-- ── documents ────────────────────────────────────────────────
create policy "Students manage own documents"
  on documents for all
  using (student_id = auth.uid());

create policy "Officers read documents for their dept items"
  on documents for select
  using (
    my_role() in ('officer', 'admin', 'super_admin')
  );

-- ── audit_logs ───────────────────────────────────────────────
create policy "Admin+ read audit logs"
  on audit_logs for select
  using (my_role() in ('admin', 'super_admin'));

create policy "Authenticated can insert audit logs"
  on audit_logs for insert
  with check (auth.uid() is not null);
