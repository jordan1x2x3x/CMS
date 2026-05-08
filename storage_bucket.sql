-- ============================================================
-- MTU CMS — Supabase Storage Setup
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Create the bucket
insert into storage.buckets (id, name, public)
values ('clearance-documents', 'clearance-documents', false)
on conflict (id) do nothing;

-- Students can upload to their own folder: {user_id}/{dept_id}/{filename}
create policy "Students upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'clearance-documents' and
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Students can read their own documents
create policy "Students read own documents"
  on storage.objects for select
  using (
    bucket_id = 'clearance-documents' and
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Students can delete/replace their own documents
create policy "Students delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'clearance-documents' and
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Officers, admins, super_admins can read all documents
create policy "Officers and admins read all documents"
  on storage.objects for select
  using (
    bucket_id = 'clearance-documents' and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('officer', 'admin', 'super_admin')
    )
  );
