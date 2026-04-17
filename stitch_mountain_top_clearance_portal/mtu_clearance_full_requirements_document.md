# MTU Clearance Management System - Detailed Requirements

## 1. User Roles
- **Student**
- **Department Officer**
- **Admin / Registrar**
- **Super Admin / ICT**

## 2. Role-Specific Functionality

### A. Student
- **Authentication:** Login and Profile management.
- **Clearance Request:** Submit requests across all departments.
- **Document Management:** Upload documents with validity checks.
- **Tracking:** Detailed tracking across 15+ specialized departments with unique rules:
    - **HOD:** Requires 4 bonded project copies, 4 CDs, and plagiarism results. Needs HOD & Supervisor signatures.
    - **CEDGS:** Requires fee payment, HOD signature, and Poise/Entrepreneurship fee proof.
    - **Lab Instructor:** Clearance based on no equipment damage.
    - **College Officer:** Requires HOD signature first.
    - **ESM (Music):** Specific fee payment required.
    - **Chapel:** Attendance check (< 10 misses allowed; else deliverance).
    - **Health/Sport/Hall of Residence:** Damage/usage clearance.
    - **ICT Unit:** Requires HOD signature first.
    - **Alumni:** Requires proof of Alumni fee payment.
    - **Student Affairs:** Requires Hostel clearance first.
    - **Library:** Requires CEDGS, HOD, and College Officer clearance first.
    - **Bursary:** Final debt check via school fee receipt upload.
    - **Academic Affairs:** Final verification.
- **Feedback:** View flags/rejections and resubmit.
- **Download:** Final clearance certificate showing approval/disapproval status.

### B. Department Officer
- **Queue Management:** View pending requests for their specific department.
- **Decision Making:** Approve, Reject, or Flag (with written reason).
- **Verification:** Check document validity.
- **Resolution:** Resolve previously flagged requests.
- **Logging:** Write audit logs.

### C. Admin / Registrar
- **Monitoring:** View all requests across all departments.
- **Reporting:** Generate and export clearance reports.
- **Configuration:** Manage departments (Add/Edit).
- **Audit:** View system audit logs.

### D. Super Admin / ICT
- **User Management:** Create/deactivate/reactivate accounts.
- **Access Control:** Issue and revoke one-time access codes.
- **Assignment:** Assign officers to specific departments.
- **Security:** View full system audit trail.

## 3. Core Forms

### Signup Page
- Name, Email (@mtu.edu.ng)
- Role (Student, Officer, Admin, Super Admin)
- Matric Number (Students)
- Department (Students & Officers)
- Programme (Students)
- Access Code
- Password

### Login Page
- Email or Matric Number
- Role Selection
- Password

## 4. Visual Identity
- **Colors:** Derived from MTU Logo (Navy Blue & Forest Green).
- **Style:** Professional, trustworthy, user-friendly, and academic.