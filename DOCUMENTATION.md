# MTU Clearance Management System — Documentation

**Mountain Top University | Clearance Management System (CMS)**  
Version 1.0 | 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles](#2-user-roles)
3. [Getting Started](#3-getting-started)
4. [Student Guide](#4-student-guide)
5. [Department Officer Guide](#5-department-officer-guide)
6. [Admin Guide](#6-admin-guide)
7. [Super Admin Guide](#7-super-admin-guide)
8. [Technical Architecture](#8-technical-architecture)
9. [Database Schema](#9-database-schema)
10. [File Structure](#10-file-structure)
11. [Security & Access Control](#11-security--access-control)
12. [Email Notifications](#12-email-notifications)
13. [Deployment & Setup](#13-deployment--setup)

---

## 1. System Overview

The MTU Clearance Management System is a web-based portal that digitises and manages the university graduation clearance process for Mountain Top University. It replaces manual paper-based clearance with a structured online workflow covering all 15 clearance departments.

### What it does
- Students submit a clearance request for their academic year
- The system automatically routes the request to all 15 departments
- Department officers review, approve, flag, or reject their department's clearance item
- Students upload required documents directly on the portal
- Once all 15 departments approve, the student receives a clearance certificate
- Admins and Super Admins monitor and manage the entire process

### Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript (ES6 modules) |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Email | Supabase Edge Function + Resend |
| Hosting | Vercel (cms-ashy-five.vercel.app) |
| Version Control | GitHub |

---

## 2. User Roles

The system has four roles with distinct levels of access:

| Role | Description |
|------|-------------|
| **Student** | University students seeking clearance. Can submit requests, upload documents, and track their clearance status. |
| **Department Officer** | Staff assigned to one clearance department. Reviews and decides on student clearance items for their department. HOD officers are tied to a specific academic department. |
| **Admin** | Registrar/administrative staff. Views all requests, generates reports, monitors department activity, and accesses the audit log. |
| **Super Admin** | ICT Unit staff. Full system access including user management, access code generation, and system configuration. |

### How accounts are created

| Role | Registration Method |
|------|-------------------|
| Student | Self-registration at `signup.html` (requires matric number, college, programme) |
| Department Officer | Invited via access code from Super Admin; registers at `signup.html` |
| Admin | Invited via secret link + access code from Super Admin; registers at `admin-signup.html` |
| Super Admin | Invited via secret link + access code from Super Admin; registers at `admin-signup.html` |

---

## 3. Getting Started

### Logging In

1. Visit the portal and click **Sign In**
2. Enter your **Matric Number** (students) or **Institutional Email** (staff)
3. Select your **Role** from the dropdown
4. Enter your **Password**
5. Click **Sign In**

You will be redirected to your role-specific dashboard automatically.

> Only `@mtu.edu.ng` email addresses are accepted for staff accounts.

### Forgot Password

Click **Forgot Password?** on the login page and enter your email. You will receive a password reset link.

---

## 4. Student Guide

### 4.1 Creating an Account

1. Go to the portal and click **Create an Account**
2. Select **Student** as your account type
3. Fill in your details:
   - Full Name
   - Matric Number (e.g. `MTU/2024/001`)
   - College
   - Department
   - Programme
   - Institutional Email (`@mtu.edu.ng`)
   - Password
4. Click **Create Account**

### 4.2 Student Dashboard

After logging in, your dashboard shows:
- **Overall clearance progress** — percentage of departments approved
- **Quick stats** — Approved, Pending, Flagged counts
- **Recent activity** — latest department decisions
- **Submit Clearance** button (first-time use)

### 4.3 Submitting a Clearance Request

1. From your dashboard, click **Submit Clearance Request**
2. Confirm your details and click **Submit**
3. The system automatically creates clearance items for all 15 departments
4. Your HOD clearance item is automatically routed to the HOD officer of your academic department

> You can only submit one clearance request per academic year.

### 4.4 Tracking Your Clearance

Go to **Clearance Tracking** to see the status of all 15 departments:

| Status | Meaning |
|--------|---------|
| Awaiting Verification | Officer will verify internally — no action needed from you |
| Pending Submission | You need to upload a document for this department |
| Approved | This department has cleared you |
| Flagged | There is an issue — check the officer's reason and take action |
| Rejected | This department has rejected your clearance — contact the department |

### 4.5 Uploading Documents

For departments that require document submission:

1. Go to **Document Upload**
2. Find the department requiring a document
3. Click **Upload Document**
4. Select your file and submit

Accepted file types and size limits are shown on the upload page.

### 4.6 Downloading Your Certificate

Once all 15 departments have approved your clearance:
1. Go to **Final Certificate**
2. Click **Download Certificate**

> The certificate is only available after all 15 departments have approved.

---

## 5. Department Officer Guide

### 5.1 Officer Dashboard

After logging in, the dashboard shows:
- Number of **pending** requests in your department
- **Recent decisions** you have made
- Quick access to your review queue

HOD officers see a chip indicating their specific academic department (e.g. `HOD · Computer Science and Mathematics`).

### 5.2 Reviewing Student Requests

1. Go to **Requests** to see all students assigned to your department
2. Click on a student's name to open the **Review Panel**
3. The review panel shows:
   - Student's name, matric number, and programme
   - For HOD officers: the student's academic department
   - Uploaded documents (if applicable)
   - Current status

### 5.3 Making a Decision

In the review panel, you can:

| Action | When to use |
|--------|-------------|
| **Approve** | Student meets all clearance requirements for your department |
| **Flag** | There is an issue that needs the student's attention (e.g. missing fee, outstanding item) |
| **Reject** | Student does not qualify for clearance from your department |

When flagging or rejecting, you must provide a **reason** that will be shown to the student.

### 5.4 HOD Officers

If you are an HOD officer, you only see students from your assigned academic department. Students from other departments are handled by their respective HOD officer.

---

## 6. Admin Guide

### 6.1 Admin Dashboard

Provides a system-wide overview including:
- Total students with submitted requests
- Overall clearance approval rate
- Department-level breakdown
- Recent activity

### 6.2 All Requests

View every student's clearance request across all departments.

**Filtering options:**
- Filter by department to see all students at a specific clearance stage
- Search by student name or matric number

### 6.3 Department Management

View all 15 clearance departments on the **Departments** page:
- Each non-HOD department shows the assigned officer and approval statistics
- HOD shows one card per registered HOD officer, each with their academic department and filtered student stats

### 6.4 Reports

The **Reports** page provides:
- **Total students** with submitted requests
- **Overall approval rate**
- **Officer decisions count** (approved, flagged, rejected)
- **Department-level pending stats**

**CSV Exports available:**
- Full report (all students and their department statuses)
- Officer decisions report
- Department summary report

### 6.5 Audit Log

The audit log records all significant system events:
- Logins and logouts
- Clearance approvals, flags, and rejections
- Document uploads
- Account changes

---

## 7. Super Admin Guide

### 7.1 User Management

Go to **Users** to view, create, edit, or deactivate any account in the system.

- **Deactivate** an account to block login without deleting the account
- **Edit** a user's profile details
- View all users filtered by role

### 7.2 Access Codes

Access codes are one-time codes required for officer and admin account creation.

**To generate a new access code:**
1. Go to **Access Codes**
2. Click **Generate Code**
3. Select the intended role (`officer`, `admin`, or `super_admin`)
4. Set an expiry date (default 7 days)
5. Share the code with the intended person

Each code:
- Can only be used once
- Expires after the set date
- Is locked to a specific role (an admin code cannot be used to register as an officer)

### 7.3 Inviting an Admin or Super Admin

1. Generate an access code for `admin` or `super_admin` in the Access Codes panel
2. Share the restricted registration link with the person:
   ```
   /admin-signup.html?token=MTU-ICT-ADMIN-2026
   ```
3. Share the access code separately (e.g. via phone or secure message)
4. The person visits the link, fills the form with the access code, and their account is created

> To change the secret URL token, edit `admin-signup.html` and update `VALID_TOKEN`.

### 7.4 Full Audit Log

Super Admins have access to the complete system audit trail, including actions performed by all roles.

---

## 8. Technical Architecture

### System Flow

```
Student submits request
       ↓
System creates 15 clearance_items (one per department)
HOD item assigned to matching HOD officer via academic_dept
       ↓
Officers log in → see their department's items
Officers review → approve / flag / reject
       ↓
On status change → Edge Function triggers email to student
       ↓
All 15 approved → student downloads certificate
```

### Key Design Decisions

- **HOD Routing:** Each HOD officer has an `academic_dept` field. When a student submits a request, the system looks up the HOD officer whose `academic_dept` matches the student's `department` and sets `assigned_officer_id` on the HOD clearance item.
- **Access Code Security:** Two-layer gate for admin registration — secret URL token + access code. Both must be valid.
- **Module Scope:** All pages use `<script type="module">` for ES module isolation. Event listeners are wired via `addEventListener`, not inline `onclick`.
- **Profile Cache:** Student profiles are cached in localStorage with a 10-minute TTL to reduce database round-trips during navigation.

---

## 9. Database Schema

### Tables

#### `profiles`
Extends Supabase `auth.users`. One row per user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Matches `auth.users.id` |
| `role` | TEXT | `student`, `officer`, `admin`, `super_admin` |
| `first_name` | TEXT | |
| `last_name` | TEXT | |
| `email` | TEXT | |
| `matric_number` | TEXT | Students only |
| `department` | TEXT | Student: academic dept string. Officer: clearance unit key (`hod`, `library`, etc.) |
| `academic_dept` | TEXT | HOD officers only — the academic department they manage |
| `college` | TEXT | Students only |
| `programme` | TEXT | Students only |
| `is_active` | BOOLEAN | `false` = account blocked from login |
| `created_at` | TIMESTAMPTZ | |

#### `departments`
The 15 fixed clearance departments. Not editable by users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Department key (e.g. `hod`, `library`, `bursary`) |
| `name` | TEXT | Display name |
| `type` | TEXT | `upload` or `record_check` |
| `requires_upload` | BOOLEAN | Whether student must upload a document |
| `depends_on` | TEXT (FK) | Department that must be approved first |
| `sort_order` | INTEGER | Display order |

#### `clearance_requests`
One per student per academic year.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | |
| `student_id` | UUID (FK → profiles) | |
| `academic_year` | TEXT | e.g. `2025/2026` |
| `status` | TEXT | `draft`, `submitted`, `completed`, `cancelled` |
| `submitted_at` | TIMESTAMPTZ | |

#### `clearance_items`
One per (request × department). 15 rows per submitted request.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | |
| `request_id` | UUID (FK → clearance_requests) | |
| `department_id` | TEXT (FK → departments) | |
| `status` | TEXT | `pending_submission`, `awaiting_verification`, `approved`, `flagged`, `rejected` |
| `assigned_officer_id` | UUID (FK → profiles) | Set for HOD items — routes to specific HOD officer |
| `reviewed_by` | UUID (FK → profiles) | Officer who made the last decision |
| `reason` | TEXT | Officer's reason (required for flag/reject) |
| `reviewed_at` | TIMESTAMPTZ | |

#### `documents`
Files uploaded by students.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | |
| `item_id` | UUID (FK → clearance_items) | |
| `student_id` | UUID (FK → profiles) | |
| `file_name` | TEXT | |
| `storage_path` | TEXT | Path in Supabase Storage bucket |
| `mime_type` | TEXT | |
| `uploaded_at` | TIMESTAMPTZ | |

#### `access_codes`
One-time codes for officer/admin registration.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | |
| `code` | TEXT (UNIQUE) | The code string |
| `intended_role` | TEXT | `officer`, `admin`, or `super_admin` |
| `used_by` | UUID (FK → profiles) | Set when code is used |
| `used_at` | TIMESTAMPTZ | |
| `expires_at` | TIMESTAMPTZ | |
| `created_by` | UUID (FK → profiles) | Super admin who created it |

#### `audit_logs`
Full activity trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | |
| `actor_id` | UUID (FK → profiles) | User who performed the action |
| `action` | TEXT | e.g. `approved`, `flagged`, `login` |
| `target_id` | TEXT | ID of the affected record |
| `meta` | JSONB | Additional context |
| `created_at` | TIMESTAMPTZ | |

### The 15 Clearance Departments

| Key | Name | Type |
|-----|------|------|
| `hod` | HOD / Project | upload |
| `bursary` | Bursary | record_check |
| `library` | Library | record_check |
| `cedgs` | CEDGS | record_check |
| `chapel` | Chapel | record_check |
| `alumni` | Alumni | record_check |
| `sport` | Sport | record_check |
| `health` | Health Unit | record_check |
| `lab` | Lab Instructor | upload |
| `college` | College Officer | record_check |
| `hall` | Hall of Residence | record_check |
| `ict` | ICT Unit | record_check |
| `student_affairs` | Student Affairs | record_check |
| `esm` | ESM (Music) | record_check |
| `academic` | Academic Affairs | record_check (requires all 14 others approved first) |

---

## 10. File Structure

```
CMS/
├── index.html                    # Public landing page
├── login.html                    # Login page (all roles)
├── signup.html                   # Student & officer self-registration
├── admin-signup.html             # Admin/Super Admin registration (restricted)
├── logout.html                   # Sign-out handler
├── help.html                     # General help page
├── DOCUMENTATION.md              # This file
│
├── student/
│   ├── student-dashboard.html    # Student home
│   ├── clearance-tracking.html   # Track all 15 dept statuses
│   ├── document-upload.html      # Upload required files
│   ├── final-certificate.html    # Download certificate
│   ├── student-settings.html     # Profile settings
│   └── student-help.html         # Student help
│
├── dept-officer/
│   ├── officer-dashboard.html    # Officer home
│   ├── officer-requests.html     # List of student requests
│   ├── officer-review.html       # Review individual student item
│   └── officer-settings.html     # Officer profile settings
│
├── admin/
│   ├── admin-dashboard.html      # Admin home
│   ├── admin-requests.html       # All requests across all departments
│   ├── admin-departments.html    # Department overview & stats
│   ├── admin-reports.html        # Reports & CSV exports
│   ├── admin-audit.html          # Audit log
│   └── admin-settings.html       # Admin profile settings
│
├── super-admin/
│   ├── super-admin-dashboard.html
│   ├── super-admin-users.html    # Full user management
│   ├── super-admin-access-codes.html
│   ├── super-admin-audit.html
│   └── super-admin-settings.html
│
├── js/
│   ├── supabase.js               # Supabase client, auth helpers, audit logging
│   ├── topbar.js                 # Shared notification bell + avatar dropdown
│   └── profile-cache.js          # LocalStorage profile caching (10-min TTL)
│
├── sql/
│   ├── schema.sql                # Full DB schema, RLS policies, triggers
│   ├── init_departments.sql      # Seeds the 15 departments
│   └── migrate_statuses.sql      # Status migration script
│
├── supabase/
│   └── functions/
│       └── notify-student/
│           └── index.ts          # Email notification Edge Function
│
└── assets/
    └── mtu-logo.png
```

---

## 11. Security & Access Control

### Row-Level Security (RLS)

All database tables have RLS enabled. Access is enforced at the database level regardless of client-side code.

| Table | Student | Officer | Admin | Super Admin |
|-------|---------|---------|-------|-------------|
| `profiles` | Own row only | Own row only | All rows | All rows |
| `clearance_requests` | Own requests | All submitted | All | All |
| `clearance_items` | Own items | Their dept items | All | All |
| `documents` | Own docs | Their dept docs | All | All |
| `access_codes` | None | None | None | Full CRUD |
| `audit_logs` | None | None | Read | Full |

### Privilege Escalation Prevention

- **Frontend:** `ALLOWED_SELF_REGISTER_ROLES = ['student', 'officer']` — the signup form rejects any other role at submission time.
- **Backend:** A `BEFORE INSERT` database trigger on `profiles` blocks insertion of `admin` or `super_admin` roles via the public anon key. Only the service role key (used server-side) can insert privileged roles.
- **Admin signup:** Requires both a valid URL token AND a valid access code with matching `intended_role`.

### Access Code Rules
- Single-use (marked used immediately on successful registration)
- Role-locked (cannot use an `admin` code to register as `super_admin`)
- Time-limited (expires after set date, default 7 days)

---

## 12. Email Notifications

Handled by the Supabase Edge Function at `supabase/functions/notify-student/`.

### Trigger Events
The function is triggered by a database webhook whenever a `clearance_items` status changes to `approved`, `flagged`, or `rejected`.

### Email Types

| Event | Email Sent |
|-------|-----------|
| Item approved | Confirmation email with department name |
| Item flagged | Warning email with officer's reason |
| Item rejected | Notification email with officer's reason |
| All 15 approved | Congratulations email with certificate download link |

### Required Environment Variables
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
```

---

## 13. Deployment & Setup

### Live URL

The system is hosted on Vercel at:
```
https://cms-ashy-five.vercel.app
```

Any push to the `main` branch on GitHub automatically triggers a redeployment on Vercel — no manual steps required.

### Prerequisites
- Supabase project (free tier or above)
- Vercel account (free Hobby plan is sufficient)
- GitHub repository connected to Vercel

### Initial Setup Steps

1. **Create Supabase project** at supabase.com

2. **Run schema** — paste `sql/schema.sql` into the Supabase SQL Editor and execute

3. **Seed departments** — run `sql/init_departments.sql` in the SQL Editor

4. **Configure Supabase client** — update `js/supabase.js` with your project URL and anon key:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

5. **Create storage bucket** — run `storage_bucket.sql` or create a bucket named `documents` in Supabase Storage

6. **Deploy Edge Function** — from the `supabase/functions/` directory:
   ```bash
   supabase functions deploy notify-student
   ```

7. **Set Edge Function secrets**:
   ```bash
   supabase secrets set RESEND_API_KEY=your_key
   ```

8. **Create first Super Admin** — go to Supabase Dashboard → Authentication → Users → Add user, then insert a profile row directly with `role = 'super_admin'`

9. **Deploy frontend** — push the repo to GitHub, then import the repository on Vercel (vercel.com). Select **Other** as the framework preset, leave build command and output directory empty, and click **Deploy**. Vercel will provide a live URL automatically.

### Rotating the Admin Signup Token

Edit `admin-signup.html` and change:
```javascript
const VALID_TOKEN = 'MTU-ICT-ADMIN-2026';
```
to a new value. Anyone with the old link will immediately be blocked.

---

*Documentation maintained by the ICT Unit, Mountain Top University.*
