# Implementation Plan: The Schema Architect (Mantine v8 Benchmark)

## Phased Implementation Plan

### Phase 1: Foundation & Data Layer `[scaffold]` ✅

1. **Mantine Setup:** Configure `MantineProvider` with light/dark mode support, global theme, and notifications.
2. **Schema Types:** Define TypeScript interfaces for the Field Schema.
3. **Global Store (Zustand):**
   - `useAuthStore` for session management.
   - `useFieldStore` for managing 1,000+ fields.
4. **Mock Data:** Use `@faker-js/faker` to generate the initial 1,000 records.

### Phase 2: Secure Access & Layout `[scaffold]` ✅

1. **Login Form:** Implement controlled inputs with inline validation and success/failure toasts.
2. **Admin Layout:** Build the main application shell with a header and navigation sidebar.
3. **Theme Switching:** Implement Epic 5 for Light/Dark mode persistence.

### Phase 3: The Field Ledger `[scaffold]` 🛠️

1. **High-Density Table:** Build a paginated table using Mantine's `Table` component.
2. **Derived State:** Implement real-time search filtering and column sorting.
3. **Bulk Management:** Add row selection and the floating Action Bar for deactivation/deletion.
4. **Drag-and-Drop:** Integrate `@dnd-kit` for manual row reordering.
5. **Summary Bar:** Implement a custom-styled summary component using CSS Modules.

### Phase 4: The Builder (Part 1) `[scaffold]` ✅

1. **Side-Drawer Shell:** Create the `BuilderDrawer` component with a split layout.
2. **Portal Management:** Ensure the drawer handles focus traps and portal rendering.

### Phase 5: The Builder (Part 2) `[manual]` 👤

1. **Conditional Configuration:** Build the form logic that reveals/hides fields based on the selected 'Type'.
2. **Auto-Slugify:** Implement the Label-to-Name slugification logic.
3. **Complex Type Inputs:** Implement dynamic list for 'select' options and specific inputs for 'number' and 'text' validation.

### Phase 6: Live Preview `[scaffold]` ✅

1. **Live Component Preview:** Implement real-time rendering of Mantine components based on form state.

---

## Verification Strategy

- **Performance:** Verify table responsiveness with 1,000+ rows.
- **Accessibility:** Audit the manual components with a screen reader.
- **State Integrity:** Ensure the final JSON output of the Builder matches the core schema.
