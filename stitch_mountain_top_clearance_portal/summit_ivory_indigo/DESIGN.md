# Design System Specification: The Scholarly Curator

## 1. Overview & Creative North Star
The "Scholarly Curator" is the creative North Star of this design system. We are moving away from the "SaaS Dashboard" look and toward a "High-End Digital Editorial" experience. This system balances the weight and authority of a centuries-old institution with the fluid, light-filled interface of a modern research tool.

The aesthetic is defined by **intentional asymmetry**, **exaggerated white space**, and **tonal depth**. Instead of boxing content into rigid grids, we allow the typography to breathe and the surfaces to overlap, creating an interface that feels curated rather than generated.

## 2. Color Strategy: Depth Through Tone
Our palette is anchored by a rich Indigo, supported by a sophisticated hierarchy of lilac-tinted neutrals.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections, sidebars, or headers. Boundaries must be defined solely through background color shifts.
*   Use `surface` (#fcf8ff) as your base canvas.
*   Use `surface_container_low` (#f6f2fe) to define secondary content areas.
*   Use `surface_container` (#f0ecf8) for tertiary nesting.
The transition between these tones provides all the structural clarity needed without the "clutter" of lines.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Level 0 (The Desk):** `surface_dim` (#dcd8e4)
*   **Level 1 (The Paper):** `surface` (#fcf8ff)
*   **Level 2 (The Inset):** `surface_container_lowest` (#ffffff) for high-focus content cards.

### The "Glass & Gradient" Rule
To escape the "flat" look, apply a subtle gradient to primary actions: 
*   **CTAs:** Transition from `primary` (#2a14b4) at the bottom-right to `primary_container` (#4338ca) at the top-left.
*   **Glassmorphism:** For floating navigation or modal overlays, use `surface_container_low` at 80% opacity with a `24px` backdrop blur. This allows the Indigo brand colors to "glow" through the interface layers.

## 3. Typography: The Serif-Sans Dialogue
We use a high-contrast typographic pairing to signal academic prestige and modern utility.

*   **The Voice (Newsreader):** Used for `display-`, `headline-`, and `title-` scales. This serif face carries the "Academic" weight. Ensure `display-lg` (3.5rem) uses tighter letter-spacing (-0.02em) to feel like a premium masthead.
*   **The Machine (Work Sans):** Used for `body-`, `label-`, and `title-sm`. This sans-serif provides functional clarity. It should never exceed a line height of 1.6 for body text to maintain an editorial density.

**Intentional Asymmetry:** When using `display-md` headers, try offsetting them to the left or placing them over a vertical "bleed" of `surface_container_high` to break the standard horizontal flow.

## 4. Elevation & Depth
In this design system, shadows are a last resort, not a default.

### The Layering Principle
Depth is achieved by stacking. A `surface_container_lowest` card sitting on a `surface_container_low` background creates a natural, soft lift. This is the preferred method for cards and modules.

### Ambient Shadows
When a component must float (e.g., a dropdown or a floating action button), use an **Ambient Shadow**:
*   **Color:** `on_surface` (#1b1b23) at 6% opacity.
*   **Blur:** 32px to 64px.
*   **Spread:** -4px.
This mimics natural light and prevents the UI from feeling "heavy."

### The "Ghost Border" Fallback
If accessibility or extreme contrast is required, use a **Ghost Border**. 
*   **Token:** `outline_variant` (#c7c4d7) at **15% opacity**. 
*   Never use 100% opacity for borders; it breaks the editorial "air."

## 5. Components

### Buttons
*   **Primary:** Indigo gradient (`primary` to `primary_container`). White text. `rounded-md` (0.375rem).
*   **Secondary:** `surface_container_high` background with `on_surface_variant` text. No border.
*   **Tertiary:** No background. Text in `primary`. Use for low-emphasis actions.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines.
*   **Execution:** Separate list items using 12px of vertical white space and a `surface_container_low` hover state with a `rounded-lg` (0.5rem) corner.
*   **Cards:** Use `surface_container_lowest` and an Ambient Shadow.

### Input Fields
*   **Default:** `surface_container_low` background. 
*   **Border:** Use the Ghost Border fallback (15% `outline_variant`). 
*   **Focus:** Transition the Ghost Border to 100% `primary` and add a 2px outer "glow" using `primary_fixed` at 30% opacity.

### Status Indicators
Maintain the "Professional Academic" tone by using status colors sparingly:
*   **Success:** Emerald Green for "Verified Research" or "Completed."
*   **Warning/Attention:** Amber or Orange for "Pending Review."
*   **Error:** Rose Red (`error`) for "Action Required."
*   **Note:** Use `tertiary` (#692400) for "Archival" or "Historical" references to maintain a scholarly feel.

### Academic Components (Contextual)
*   **Citation Blocks:** Use `surface_container_highest` with a thick 4px left-accent of `primary`. Typography should be `body-sm`.
*   **Annotation Chips:** Use `secondary_container` with `on_secondary_container` text. These should be `rounded-full` to contrast with the more structured rectangular cards.

## 6. Do's and Don'ts

### Do
*   **Do** use `display-lg` serif type for page titles to create an "Editorial" feel.
*   **Do** use tonal shifts (e.g., `surface` to `surface_container_low`) to separate the navigation from the main content.
*   **Do** allow for generous margins (minimum 48px on desktop) to evoke the feel of a luxury printed journal.

### Don't
*   **Don't** use 1px solid black or grey borders. They are the enemy of this system.
*   **Don't** use standard "drop shadows" with high opacity or small blurs.
*   **Don't** use the Indigo `primary` color for large background areas; it is an accent and a "signature," not a wallpaper. Use the `surface` tokens for large areas.
*   **Don't** mix the serif font (Newsreader) into functional data tables or small labels; keep it for "the narrative" only.