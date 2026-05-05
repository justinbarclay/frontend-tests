# Implementation Plan: JollyUI Schema Architect

This document outlines the strategy for implementing the Schema Architect using **JollyUI**, **React Aria Components (RAC)**, and **Tailwind CSS**.

## 1. Project Foundation
- [x] **Framework:** Vite + React + TypeScript.
- [x] **Styling:** Tailwind CSS with the `tailwindcss-react-aria-components` plugin and `tailwindcss-animate`.
- [x] **Components:** JollyUI (shadcn/ui compatible components built on RAC).
- [x] **State Management:** Zustand (implemented in `src/store`).
- [ ] **Icons:** Lucide React.
- [ ] **Data:** Faker.js for mock data generation (1,000+ records).

## 2. Component Strategy
JollyUI components are added to `src/components/ui`.
- [x] **Core UI:** `Button`, `TextField`, `NumberField`, `Select`, `Checkbox`, `Switch`, `Separator`.
- [ ] **Feedback:** `Toast` (needs implementation), `Badge` (needs implementation).
- [x] **Overlays:** `Dialog` (for Drawer and Modals).
- [ ] **Navigation/Layout:** `AdminLayout` with theme toggle and "Summary Bar".
- [x] **Ledger:** `Table` (from JollyUI).
- [ ] **Advanced Interaction:** `dnd-kit` for drag-and-drop reordering.

## 3. Implementation of User Stories

### Epic 1: Secure Access
- **LoginForm [scaffold]:** 
    - [ ] Email and password fields (required, blur validation).
    - [ ] Password "Show/Hide" toggle.
    - [ ] Submit loading state and Toast feedback.
    - [ ] Mock auth token storage and redirect.

### Epic 2: The Field Ledger (High Density)
- **Field Overview [scaffold]:** 
    - [ ] `VirtualizedTable` (RAC Table + `react-virtuoso`) for 1,000+ rows.
    - [ ] Columns: Label, Name (slug), Type, Status (Badge), Usage Count.
    - [ ] Sortable headers and real-time filter.
- **Bulk Management [scaffold]:** 
    - [ ] Row/Header checkboxes.
    - [ ] Floating action bar (Portal) with "Deactivate" and "Delete".
    - [ ] Confirmation modal for "Delete".

### Epic 3: The Builder (Dynamic Logic)
- **Side-Drawer Creation [scaffold]:** 
    - [ ] Right-side `Sheet` (Dialog) with backdrop and focus trap.
- **Conditional Configuration [manual]:** 
    - *Protocol: I will implement the form skeleton and layout. User implements the logic.*
    - [ ] Skeleton for all form fields (Label, Name, Type, etc.).
    - [ ] User Implementation: Auto-slugify Label to Name.
    - [ ] User Implementation: Conditional rendering logic for type-specific fields.
- **Live Component Preview [manual]:** 
    - *Protocol: I will implement the split-view layout. User implements the preview rendering.*
    - [ ] Split layout (Editor vs Preview panels).
    - [ ] User Implementation: Real-time JollyUI component rendering logic.

### Epic 4: Advanced Interaction
- **DND Reordering [scaffold]:** 
    - [ ] Drag handles and visual feedback.
    - [ ] Keyboard accessibility.

### Epic 5: Look & Feel
- **Theme Switching [scaffold]:** 
    - [ ] Persistence in `localStorage` and system preference.
    - [ ] FOUC prevention.
- **Custom-Styled Summary Bar [scaffold]:**
    - [ ] High-contrast modern look with support for light and dark themes.
    - [ ] Custom gradients/shadows (Tailwind) using framework primitives.
    - [ ] Displays "Total Fields" and "Active Fields".

## 4. Development Workflow
1. [x] Initialize Tailwind and JollyUI core.
2. [x] Implement `useFieldStore` and `useBuilderStore`.
3. [ ] Scaffold `AdminLayout` and simple state-based routing (switch statement: Login vs Ledger).
4. [ ] Implement `FieldLedger` with virtualization.
5. [ ] Implement `BuilderDrawer` with conditional logic and preview skeletons.
6. [ ] Implement `LoginForm`.
7. [ ] Final styling and accessibility audit.
