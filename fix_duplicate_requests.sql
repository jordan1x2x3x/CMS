-- Prevent students from submitting more than one clearance request per academic year.
-- Run in: Supabase Dashboard → SQL Editor → New Query

-- First, clean up existing duplicates by keeping only the most recent per student per year
delete from clearance_requests
where id not in (
  select distinct on (student_id, academic_year) id
  from clearance_requests
  order by student_id, academic_year, submitted_at desc nulls last
);

-- Now add the unique constraint
alter table clearance_requests
  add constraint uq_student_academic_year unique (student_id, academic_year);
