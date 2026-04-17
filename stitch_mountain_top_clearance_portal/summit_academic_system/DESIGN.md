# Design System Specification: The Modern Archive

## 1. Overview & Creative North Star
**Creative North Star: The Illuminated Scholar**
This design system moves away from the rigid, boxy constraints of traditional academic software and instead embraces the "Modern Archive" aesthetic. It treats digital space like a premium editorial journal—high-end, authoritative, yet breathable. 

The identity is built on a foundation of **Deep Navy Blue** (representing the immovable authority of Mountain Top University) and **Forest Green** (symbolizing the growth of its students). We break the "template" look by using intentional asymmetry, overlapping elements, and extreme typographic contrast. Rather than using lines to separate thoughts, we use light, depth, and tonal shifts to guide the eye.

---

## 2. Colors & Tonal Depth
Our color palette is a sophisticated interplay between deep, scholarly hues and vibrant, growth-oriented accents.

### Core Palette
*   **Primary (Authority):** `#00113a` — Used for navigation, primary actions, and headers.
*   **Secondary (Growth):** `#006e0c` — Reserved for success states, progress indicators, and growth-related callouts.
*   **Tertiary (Illumination):** `#100051` — An ultra-deep indigo used for subtle layering and high-contrast text.

### The "No-Line" Rule
To achieve a high-end editorial feel, **designers are prohibited from using 1px solid borders for sectioning.** Boundaries must be defined solely through:
1.  **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
2.  **Negative Space:** Using the spacing scale to create clear "islands" of content.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum paper. 
*   **Base:** `surface` (`#f8f9fa`)
*   **Deepest Level:** `surface-container-lowest` (`#ffffff`) for main content cards.
*   **Elevated Levels:** Use `surface-container-high` (`#e7e8e9`) to define utility sidebars or nested data areas.

### The Glass & Gradient Rule
Move beyond flat color. Use a subtle linear gradient from `primary` to `primary_container` for hero sections and main CTAs. For floating navigation or modal overlays, apply **Glassmorphism**: use semi-transparent `surface` colors with a `20px` backdrop-blur to allow underlying content to peek through, softening the interface.

---

## 3. Typography
The typographic system creates a tension between the classic academic tradition and modern data efficiency.

*   **Display & Headlines (Newsreader):** Use for storytelling, page titles, and high-level headers. It conveys the University’s heritage.
    *   *Display-LG:* `3.5rem` / Newsreader.
    *   *Headline-MD:* `1.75rem` / Newsreader.
*   **Body & Data (Inter):** Use for all functional text, data-heavy tables, and labels. Inter provides the technical clarity required for university administration.
    *   *Body-LG:* `1rem` / Inter.
    *   *Label-MD:* `0.75rem` / Inter (Medium weight for emphasis).

---

## 4. Elevation & Depth
In this design system, depth is a tool for focus, not just decoration.

### The Layering Principle
Achieve hierarchy by stacking tonal tiers. A card (`surface-container-lowest`) placed on a section (`surface-container-low`) creates a natural "lift."

### Ambient Shadows
Shadows must be "atmospheric." When a floating effect is required (e.g., a dropdown or modal):
*   **Color:** Use a 6% opacity version of `on-surface` (`#191c1d`).
*   **Blur:** High diffusion (24px to 40px) with 0 spread.
*   **Natural Light:** Avoid dark grey shadows; the shadow should feel like a subtle dimming of the background color.

### The "Ghost Border" Fallback
If a border is required for accessibility in complex forms, use a **Ghost Border**: `outline-variant` (`#c5c6d2`) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Status Tokens
Status indicators are styled as "pills" with high-end tonal backgrounds.

*   **Approved (Emerald):** Background: `on_secondary_container` at 10% / Text: `on_secondary_container`.
*   **Flagged (Orange):** Background: `#FFF3E0` / Text: `#E65100`.
*   **Rejected (Rose):** Background: `error_container` / Text: `on_error_container`.
*   **Pending (Amber):** Background: `#FFF8E1` / Text: `#FF8F00`.

---

## 6. Components

### Buttons
*   **Primary:** Solid `primary` background with `on_primary` text. Radius: `md` (0.375rem). Use a subtle 10% `primary_fixed` inner glow on hover.
*   **Secondary:** Ghost style. No background, `outline-variant` (Ghost Border) at 20% opacity. Text: `primary`.

### Data Tables (The Academic Ledger)
*   **Header:** `surface-container-high` background, `label-md` uppercase text.
*   **Rows:** No horizontal dividers. Use `body-md` Inter. 
*   **Separation:** Use a 4px vertical gap between rows or alternating `surface` and `surface-container-low` backgrounds.

### Cards
*   **Style:** Radius `xl` (0.75rem). No borders. 
*   **Interaction:** On hover, transition the background from `surface-container-lowest` to `surface-bright`.

### Input Fields
*   **The Minimalist Input:** A simple underline using `outline_variant` (15% opacity) that transforms into a `primary` 2px bar on focus. Label in `label-sm` Inter, floating above the field.

---

## 7. Do's and Don'ts

### Do
*   **Do** use Newsreader for large, editorial quotes or introductory statements to give a sense of prestige.
*   **Do** lean into white space. If a layout feels "full," increase the padding by one scale step.
*   **Do** use the `secondary` green for elements that represent student progress or successful outcomes.

### Don't
*   **Don't** use black shadows. Always tint shadows with the surface color.
*   **Don't** use dividers in lists. Use vertical rhythm and background shifts instead.
*   **Don't** use Newsreader for data or labels. It is for "reading," not for "processing data."
*   **Don't** use sharp corners. Always use the specified rounding scale (minimum `sm`) to keep the UI approachable.

---

## 8. Roundedness Scale (Reference)
*   **Default:** `0.25rem` (Buttons, small inputs)
*   **MD:** `0.375rem` (Chips, small cards)
*   **XL:** `0.75rem` (Main content containers, modals)
*   **Full:** `9999px` (Status badges, pill buttons)