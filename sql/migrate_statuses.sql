-- =============================================================
-- MTU CMS — Status Migration
-- Run in Supabase SQL Editor AFTER init_departments.sql
-- Backfills existing 'pending' clearance_items with the correct
-- initial status based on whether the department requires upload.
-- =============================================================

UPDATE clearance_items ci
SET status = CASE
  WHEN d.type = 'upload' THEN 'pending_submission'
  ELSE 'awaiting_verification'
END
FROM departments d
WHERE ci.department_id = d.id
  AND ci.status = 'pending';
