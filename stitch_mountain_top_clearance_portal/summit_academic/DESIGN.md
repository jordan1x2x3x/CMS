# Design System Strategy: Mountain Top University

## 1. Overview & Creative North Star: "The Academic Aerolith"
This design system moves away from the cluttered, "spreadsheet-heavy" legacy of academic portals. Our Creative North Star is **The Academic Aerolith**—a philosophy that treats information as a high-end editorial experience. We eschew the rigid, boxed-in grids of traditional administration for a layout that feels expansive, lofty, and authoritative.

The system breaks the "template" look by utilizing **intentional asymmetry** (large left-aligned display type balanced by airy right-aligned actions) and **tonal depth**. Instead of dividing content with lines, we use the "Atmospheric Layering" of surfaces to guide the eye, creating a portal that feels less like a utility and more like a curated digital campus.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the heritage of `primary` (#1e3a8a) and the prestige of `secondary` (#2b6954), but it is executed through a lens of sophisticated translucency.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. Use `surface_container_low` sections sitting atop a `surface` background to define regions.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use a "Nested Depth" model:
*   **Base:** `surface` (#f8f9ff) for the main canvas.
*   **Structural Sections:** `surface_container_low` (#eff4ff) for sidebar or secondary navigation zones.
*   **Interactive Cards:** `surface_container_lowest` (#ffffff) to create a "lifted" appearance for primary content.
*   **Callouts:** `surface_container_high` (#dce9ff) for interactive widgets that require immediate focus.

### The "Glass & Gradient" Rule
To avoid a flat "Bootstrap" appearance, apply a subtle linear gradient to primary action surfaces: from `primary` (#00236f) to `primary_container` (#1e3a8a). For floating navigation or modal overlays, utilize **Glassmorphism**: apply `surface_container_low` at 80% opacity with a `24px` backdrop-blur to allow the university branding colors to bleed through softly.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance modern utility with academic prestige.

*   **Display & Headline (Manrope):** Used for large-scale "Hero" moments. The wide-set nature of Manrope conveys stability. Use `display-lg` for welcome headers to create a "Magazine Cover" feel.
*   **Body & Title (Inter):** The workhorse. `inter` provides maximum legibility for complex university data. 
*   **The Hierarchy Shift:** Use `label-md` in all-caps with `0.05em` tracking for data labels to differentiate them from the `body-md` user input, ensuring the portal feels like a professional dashboard, not a document.

---

## 4. Elevation & Depth: Tonal Layering
In this system, shadows are an exception, not the rule. We prioritize **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` card placed on a `surface_container_low` background creates a natural, soft lift.
*   **Ambient Shadows:** For "floating" elements like multi-step progress trackers, use shadows with a blur value of `32px` and a color of `on_surface` (#0d1c2e) at 6% opacity. This mimics natural ambient light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in high-contrast data tables, use the `outline_variant` token at **15% opacity**. Never use 100% opaque lines.
*   **Glassmorphism:** Use semi-transparent `surface_container_lowest` for headers to maintain a sense of place as the user scrolls through long academic transcripts.

---

## 5. Components

### High-Contrast Data Tables
*   **Execution:** Forbid the use of vertical and horizontal dividers. 
*   **Styling:** Use `surface_container_lowest` for the table container. The header row should use `surface_container_high` with `title-sm` typography. Alternate rows should remain white, but the "Hover State" must use a subtle shift to `primary_fixed` (#dce1ff) at 30% opacity.

### Sleek Dashboard Cards
*   **Execution:** Use `xl` (0.75rem) corner radius. 
*   **Styling:** Cards should not have borders. Use the **Layering Principle** to define their shape. Titles should be `title-md` in `on_surface`.

### Multi-Step Vertical Progress Tracker
*   **Execution:** An asymmetrical layout where the track is positioned on the left.
*   **Styling:** Use `primary` for completed steps and `secondary_fixed_dim` for upcoming steps. Instead of a line connecting the steps, use a soft gradient path from `primary` to `surface_variant`.

### Buttons & Chips
*   **Primary Button:** `primary` background with `on_primary` text. Use `md` rounding. Add a subtle inner-glow (1px white at 10% opacity) to the top edge for a premium "pressed" feel.
*   **Status Chips:** 
    *   *Approved:* `on_tertiary_container` (#27c38a) text on `tertiary_fixed` (#6ffbbe) background.
    *   *Pending:* Amber text on `surface_container_highest`.
    *   *Flagged/Rejected:* Use `error` (#ba1a1a) with `error_container` (#ffdad6).

### Input Fields
*   **Styling:** Forbid "Box" inputs. Use a "Flushed" style—a `surface_container_low` background with a slightly heavier `outline_variant` (20% opacity) on the bottom edge only. On focus, the bottom edge transitions to a 2px `primary` stroke.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme white space. If a section feels "comfortable," add 16px more padding.
*   **Do** use `secondary` (Forest Green) for branding accents and success states to ground the design in the university's identity.
*   **Do** use `manrope` for any number larger than 24px (e.g., GPA, Credit counts) to give them an "architectural" feel.

### Don’t
*   **Don’t** use black (#000000) for text. Always use `on_surface` (#0d1c2e) to maintain a soft, premium contrast.
*   **Don’t** use standard 1px dividers to separate list items. Use a 12px vertical gap or a subtle background shift.
*   **Don’t** use "saturated" shadows. If a shadow looks grey or dirty, reduce its opacity and add a hint of `primary` blue to the shadow’s hex code.