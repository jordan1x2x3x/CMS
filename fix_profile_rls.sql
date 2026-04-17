-- Run this in Supabase SQL Editor to fix the profile RLS issue on signup.
-- The function runs as the DB owner (security definer), bypassing RLS.

create or replace function public.create_profile(
  p_id           uuid,
  p_role         user_role,
  p_first_name   text,
  p_last_name    text,
  p_email        text,
  p_matric_number text default null,
  p_department   text default null,
  p_college      text default null,
  p_programme    text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, role, first_name, last_name, email, matric_number, department, college, programme)
  values (p_id, p_role, p_first_name, p_last_name, p_email, p_matric_number, p_department, p_college, p_programme)
  on conflict (id) do nothing;
end;
$$;

-- Allow anyone (including newly signed-up users with no session) to call it
grant execute on function public.create_profile to anon, authenticated;
