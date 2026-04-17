# MTU Clearance Management System

A web-based digital clearance management system for **Mountain Top University**, built with vanilla HTML/CSS/JavaScript and Supabase as the backend.

## Features

- **Student Portal** — Submit clearance requests, track status across 15 departments, upload documents, download final certificate
- **Department Officer Portal** — Review, approve, flag, or reject student requests per department
- **Admin / Registrar Portal** — Monitor all requests, view department progress, generate reports, audit officer decisions
- **Super Admin / ICT Portal** *(coming soon)* — Manage users, issue access codes, full audit trail

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend:** [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage)
- **Fonts:** Google Fonts (Inter, Newsreader)
- **Icons:** Google Material Symbols

## Folder Structure

```
CMS/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Registration (3-step)
├── logout.html             # Session cleanup
├── help.html               # Help centre / FAQ
├── student/                # Student portal pages
│   ├── student-dashboard.html
│   ├── clearance-tracking.html
│   ├── document-upload.html
│   ├── final-certificate.html
│   ├── student-help.html
│   └── student-settings.html
├── dept-officer/           # Department officer pages
│   ├── officer-dashboard.html
│   ├── officer-requests.html
│   ├── officer-review.html
│   └── officer-settings.html
├── admin/                  # Admin / Registrar pages
│   ├── admin-dashboard.html
│   ├── admin-requests.html
│   ├── admin-departments.html
│   ├── admin-reports.html
│   ├── admin-audit.html
│   └── admin-settings.html
├── assets/
│   └── mtu-logo.png
├── js/
│   └── supabase.js         # Supabase client + helpers
├── schema.sql              # Full database schema + RLS policies
└── fix_profile_rls.sql     # RLS bypass function for signup
```

## Departments (15)

HOD · CEDGS · Lab Instructor · College Officer · Health Unit · Sport · Hall of Residence · ICT Unit · Alumni · Student Affairs · Library · Bursary · ESM (Music) · Academic Affairs · Chapel

## Getting Started

1. Clone the repo
2. Open `index.html` in your browser (or use Live Server in VS Code)
3. Register an account via `signup.html`
4. For non-student roles, an access code from the ICT Unit is required

## Database Setup

Run `schema.sql` in your Supabase SQL Editor to create all tables and RLS policies.  
Run `fix_profile_rls.sql` to set up the signup profile helper function.

---

*Mountain Top University — Empowered to Excel*
