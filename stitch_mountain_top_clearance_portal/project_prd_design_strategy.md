# Product Requirements Document: MTU Clearance Management System

## 1. Project Overview
A web-based system for Mountain Top University to streamline the graduation and withdrawal clearance process across four user roles: Student, Officer, Admin, and Super Admin.

## 2. Visual Identity & Design System
*   **Theme:** Professional, academic, trustworthy, and modern.
*   **Primary Colors:** Navy Blue (Authority), Forest Green (Growth/MTU branding), and White/Light Grey (Cleanliness).
*   **Status Color System (Critical):**
    *   **Pending:** Amber/Yellow (`#F59E0B`) - Indicates "In Progress" or "Waiting".
    *   **Approved:** Emerald Green (`#10B981`) - Indicates "Success" or "Complete".
    *   **Flagged:** Orange (`#F97316`) - Indicates "Attention Required" or "Fixable Issue".
    *   **Rejected:** Rose Red (`#EF4444`) - Indicates "Denied" or "Critical Error".
*   **Typography:** Sans-serif (Inter or Roboto) for high legibility in data-heavy tables.

## 3. Layout Structure (Desktop First)
*   **Global Shell:** 
    *   **Top Header:** Logo, "MTU Clearance Portal", Search, and User Profile/Notifications.
    *   **Sidebar Navigation:** Vertical icons + labels. Collapsible for more workspace.
    *   **Main Content Area:** Padded container with breadcrumbs and page titles.

## 4. Key Components & UI Patterns
*   **Dashboard Cards:** Summary metrics (e.g., "3/8 Departments Cleared").
*   **Clearance Stepper:** A vertical or horizontal progress tracker showing the workflow (HOD -> Library -> Chapel -> Bursary, etc.).
*   **Data Tables:** For list views with sorting, filtering, and status badges.
*   **Action Modals:** Used for quick "Approve/Reject" actions to keep the Officer in context.
*   **Document Previewer:** Side-by-side view for Officers to verify uploads without leaving the page.

## 5. Role-Based Screen Breakdowns

### A. Student Experience
*   **Dashboard:** High-level progress bar and "Next Action" alert (e.g., "Upload Bursary Receipt").
*   **Clearance Tracking:** Detailed view of each department's status, requirement notes, and history.

### B. Officer Experience
*   **Review Interface:** A "split-screen" layout. Left side: Student details and uploaded documents. Right side: Action panel (Approve, Flag with reason, Reject).

### C. Admin/Super Admin Experience
*   **Analytics Dashboard:** Charts showing clearance bottlenecks (e.g., "Average time in Library: 3 days").
*   **User Management:** Clean tables for role assignment and system logs.

## 6. UX Improvements
*   **Predictive Guidance:** Clearly highlight the "Active" department. Students shouldn't guess where they are in the queue.
*   **Feedback Loops:** Automated notifications when a request is flagged, including the specific reason and a "Fix Now" button.
