-- =============================================================
-- MTU Clearance Management System — Departments Schema & Seed
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- ── 1. CREATE TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  sub_label       TEXT,
  type            TEXT NOT NULL CHECK (type IN ('upload', 'record_check')),
  requires_upload BOOLEAN NOT NULL DEFAULT FALSE,
  icon            TEXT NOT NULL DEFAULT 'description',
  icon_color      TEXT NOT NULL DEFAULT '#6B0080',
  icon_bg         TEXT NOT NULL DEFAULT '#F0EAF5',
  requirement     TEXT,          -- upload type: document the student must submit
  verify_info     TEXT,          -- record_check type: info shown to student (no upload)
  depends_on      TEXT REFERENCES departments(id),
  depends_on_name TEXT,          -- human-readable label for the dependency
  depends_on_all  BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE for academic (needs all 14)
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. ROW LEVEL SECURITY ─────────────────────────────────────
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read (students need this on their portal)
CREATE POLICY IF NOT EXISTS "departments_read_authenticated"
  ON departments FOR SELECT
  TO authenticated
  USING (TRUE);

-- Also allow anon reads (needed if anon key is used before login check)
CREATE POLICY IF NOT EXISTS "departments_read_anon"
  ON departments FOR SELECT
  TO anon
  USING (is_active = TRUE);

-- Only super_admin can insert / update / delete
CREATE POLICY IF NOT EXISTS "departments_write_superadmin"
  ON departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
  );

-- ── 3. SEED ALL 15 DEPARTMENTS ────────────────────────────────
-- ON CONFLICT DO NOTHING → safe to re-run; will not overwrite manual edits.

INSERT INTO departments
  (id, name, sub_label, type, requires_upload,
   icon, icon_color, icon_bg,
   requirement, verify_info,
   depends_on, depends_on_name, depends_on_all, sort_order)
VALUES

-- ── UPLOAD REQUIRED (student submits a file; officer reviews) ──
('bursary',
 'Bursary: School Fee Receipt',
 'Academic Session 2023/2024',
 'upload', TRUE,
 'account_balance_wallet', '#EF4444', '#FEE2E2',
 'Official digital receipt of final session school fees (PDF, max 5MB)',
 NULL, NULL, NULL, FALSE, 1),

('hod',
 'HOD: Project Soft Copy',
 'Final Year Project Repository',
 'upload', TRUE,
 'inventory_2', '#6B0080', '#F0EAF5',
 'Final year project: 4 bonded hard copies + digital thesis (PDF/ZIP, max 50MB)',
 NULL, NULL, NULL, FALSE, 2),

('cedgs',
 'CEDGS: Poise / Entrepreneurship',
 'Certificate of Completion',
 'upload', TRUE,
 'workspace_premium', '#10B981', '#D1FAE5',
 'Poise/Entrepreneurship completion certificate and CEDGS fee payment proof (PDF)',
 NULL, NULL, NULL, FALSE, 3),

-- ── RECORD CHECK (officer verifies internally; no upload needed) ──
('chapel',
 'Chapel: Attendance Verification',
 'Chaplaincy Unit — 2023/2024',
 'record_check', FALSE,
 'church', '#2563EB', '#DBEAFE',
 NULL,
 'The Chapel officer verifies your attendance records internally. No document upload is required. You will be notified once your attendance has been reviewed.',
 NULL, NULL, FALSE, 4),

('library',
 'Library: Book Return Confirmation',
 'University Library Clearance',
 'record_check', FALSE,
 'menu_book', '#7C3AED', '#EDE9FE',
 NULL,
 'The Library officer verifies your book return status from their system. Ensure all borrowed books are returned and any outstanding fines are settled.',
 NULL, NULL, FALSE, 5),

('alumni',
 'Alumni: Dues & Contributions',
 'Graduating Class Contributions',
 'record_check', FALSE,
 'groups', '#0891B2', '#CFFAFE',
 NULL,
 'Alumni verifies payment of graduating class dues from their records. No upload needed. Requires Bursary clearance to be approved first.',
 'bursary', 'Bursary', FALSE, 6),

('sport',
 'Sport Unit: Equipment Clearance',
 'Sport Unit — MTU',
 'record_check', FALSE,
 'sports', '#EA580C', '#FFEDD5',
 NULL,
 'The Sport Unit officer verifies that all borrowed equipment is returned and no damages are recorded against your name.',
 NULL, NULL, FALSE, 7),

('health',
 'Health Centre: Medical Clearance',
 'University Health Centre',
 'record_check', FALSE,
 'local_hospital', '#DC2626', '#FEE2E2',
 NULL,
 'The Health Centre reviews your medical records and confirms there are no outstanding bills, unpaid damages, or unresolved medical obligations.',
 NULL, NULL, FALSE, 8),

('lab',
 'Lab Instructor: Equipment Check',
 'University Laboratory Unit',
 'record_check', FALSE,
 'science', '#059669', '#D1FAE5',
 NULL,
 'The Lab Instructor verifies that all lab equipment is returned and your lab access card is submitted with no damage or loss reported.',
 NULL, NULL, FALSE, 9),

('college',
 'College Officer: College Clearance',
 'College Academic Office',
 'record_check', FALSE,
 'corporate_fare', '#6B0080', '#F0EAF5',
 NULL,
 'The College Officer reviews your clearance after HOD confirmation is received. HOD must be approved first.',
 'hod', 'HOD', FALSE, 10),

('hall',
 'Hall of Residence: Hostel Clearance',
 'Student Hostel Administration',
 'record_check', FALSE,
 'home', '#B45309', '#FEF3C7',
 NULL,
 'Hostel officer verifies your room key is returned, no property damage is recorded, and all hostel dues are fully paid.',
 NULL, NULL, FALSE, 11),

('ict',
 'ICT Unit: System Access Clearance',
 'ICT Services — MTU',
 'record_check', FALSE,
 'computer', '#0284C7', '#E0F2FE',
 NULL,
 'ICT Unit verifies your university system access is properly deactivated. Requires HOD approval first.',
 'hod', 'HOD', FALSE, 12),

('student_affairs',
 'Student Affairs: Clearance',
 'Dean of Student Affairs',
 'record_check', FALSE,
 'diversity_3', '#7C3AED', '#EDE9FE',
 NULL,
 'Student Affairs reviews your student records after Hall of Residence clearance is confirmed.',
 'hall', 'Hall of Residence', FALSE, 13),

('esm',
 'ESM Unit: Spiritual Music Clearance',
 'Ensemble for Spiritual Music',
 'record_check', FALSE,
 'music_note', '#DB2777', '#FCE7F3',
 NULL,
 'ESM Coordinator verifies your attendance of all mandatory spiritual music sessions and signs your clearance form.',
 NULL, NULL, FALSE, 14),

-- ── FINAL STEP (locked until ALL 14 others are approved) ──
('academic',
 'Academic Affairs (Registrar)',
 'Final Step — Office of the Registrar',
 'record_check', FALSE,
 'verified', '#6B0080', '#F0EAF5',
 NULL,
 'Final clearance is issued by the Registrar. All 14 departments must be fully approved before this step unlocks.',
 NULL, NULL, TRUE, 15)

ON CONFLICT (id) DO NOTHING;


-- ── 4. BACKWARD FIX ───────────────────────────────────────────
-- Ensures every existing clearance_request has a clearance_item
-- for each of the 15 departments. Missing rows are inserted as
-- 'pending'. Existing rows are left untouched (DO NOTHING).

INSERT INTO clearance_items (request_id, department_id, status)
SELECT
  r.id        AS request_id,
  d.id        AS department_id,
  'pending'   AS status
FROM clearance_requests r
CROSS JOIN departments d
WHERE d.is_active = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM clearance_items ci
    WHERE ci.request_id    = r.id
      AND ci.department_id = d.id
  );
