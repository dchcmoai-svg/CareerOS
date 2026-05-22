# CareerOS Production Ecosystem Doctrine

This document defines the craftsmanship standards, motion choreography, and layout density rules for the production-ready CareerOS client. All frontend elements must strictly adhere to these rules.

---

## 1. Interaction Physics & Motion Choreography
To avoid the playful "startup SaaS" energy, all motion must project a silent, heavy, machine-like authority.

### Framer Motion Standards:
*   **Default Page Transitions:**
    ```tsx
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ type: "spring", stiffness: 400, damping: 40 }}
    ```
*   **Tactile Feedback (Buttons & Cards):**
    Use standard Scale down on click to mimic physical buttons:
    ```tsx
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.1, ease: "easeOut" }}
    ```
*   **Subtle Edge Highlights:**
    Cards must use `border border-hairline` (#23252a) and a slight top-edge highlight on hover:
    ```css
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    ```

---

## 2. Layout & Information Density
*   **Zero Whitespace Waste:** Replace expansive paddings with tight layout groupings (`gap-md`, `gap-sm`). Look to Bloomberg Terminal and Linear for dense, scan-ready UI grids.
*   **Hierarchy via Color Depth:**
    *   `#010102` (Deepest Canvas)
    *   `#07080A` (Surface 1: Default Cards / Panels)
    *   `#0E1117` (Surface 2: Hovered/Selected elements)
    *   `#161B22` (Surface 3: Dropdowns/Chips/Modals)

---

## 3. Surface Specifications
### Discovery (`/jobs`)
*   **Bloomberg-tier Opportunity List:** Dense listing with indicators (Ghost Score, Hiring Velocity, Sponsorship).
*   **Keyboard Navigation Flow:** `j/k` traversal and `Enter` expansion. Focus updates the `RightPanelAgent` context immediately.
*   **Live Intelligence Strip:** An inline warning/opportunity header summarizing target markets.

### Tracker (`/tracker`)
*   **Operations Kanban:** Airtable-style grid. Heavy columns showing Stage Duration (e.g. `In Stage: 14 days` highlighted in warning colors if stalled).
*   **Timeline Memory:** A history dropdown highlighting the last touchpoint and recruiter response status.

### Resume Lab (`/resume`)
*   **IDE Diagnostics Overlay:** Notion-style sheet rendering custom underlines (`border-b-2 border-dashed`) for compilation errors (missing keywords, passive verbs).
*   **ATS Scorecard panel:** Side panel showing Keyword Density, Readability, and Impact Density progress bars.
*   **Version branches:** Git-like commit selectors mapping to targeted ATS models.

### Living Professional Identity (`/profile`)
*   **Graph Ingestion:** Status chips displaying active GitHub and LinkedIn sync status.
*   **Dynamic Skills Graph:** A verification tagger allowing users to accept or decline inferred skills.
*   **Experience Timeline:** Timeline nodes with direct link elements to specific resume variant branches.
