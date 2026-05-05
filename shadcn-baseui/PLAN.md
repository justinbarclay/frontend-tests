# Plan: shadcn-baseui-schema-architect

This project implements "The Schema Architect" using **shadcn/ui** patterns but powered by **Base UI** (@base-ui/react).

## 1. Tech Stack
- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Base UI (@base-ui/react)
- **State Management:** Zustand
- **Drag and Drop:** dnd-kit
- **Virtualization:** react-virtuoso (for high-density table)
- **Icons:** Lucide React
- **Toast:** Base UI Toast

## 2. Implementation Strategy

### Epic 1: Secure Access `[scaffold]`
- **Login Form:** Implement with controlled inputs and `onBlur` validation.
- **Feedback:** Use Base UI Toast (`toastManager.add`) for "Welcome back" or "Invalid credentials" notifications.
- **Routing:** Conditional rendering in `App.tsx` based on `auth.isAuthenticated`.

### Epic 2: The Field Ledger `[scaffold]`
- **Data Generation:** Use `@faker-js/faker` to generate 1,000 mock fields on mount.
- **Field Overview:** `react-virtuoso` for the high-density table.
- **Sorting/Filtering:** Derived state in `useFieldStore`.
- **Bulk Management:**
    - Floating action bar with slide-up animation.
    - Confirmation Modal using Base UI `Dialog` for deletion.

### Epic 3: The Builder
- **Side-Drawer Creation `[scaffold]`:** Use Base UI `Dialog` (configured as a side-sheet) with custom transition logic. Implement the drawer container and the **split-panel layout outline** (Editor panel left, Preview panel right).
- **Conditional Configuration `[manual]`:** *AGENT WILL NOT IMPLEMENT.* This section requires hand-written logic for type-specific fields and auto-slugification. I will leave a "TODO: Developer Implementation" placeholder in the Editor panel.
- **Live Component Preview `[manual]`:** *AGENT WILL NOT IMPLEMENT.* This section requires hand-written logic for real-time component rendering. I will leave a "TODO: Developer Implementation" placeholder in the Preview panel.

### Epic 4: Advanced Interaction `[scaffold]`
- **Drag-and-Drop Reordering:**
    - Integrate `dnd-kit` with `react-virtuoso`.
    - Use `DragOverlay` for smooth visual feedback during virtualized dragging.
    - Persist order via `reorderFields` in `useFieldStore`.

### Epic 5: Look & Feel `[scaffold]`
- **Theme Switching:** `ThemeToggle` component switching the `dark` class on `document.documentElement`.
- **Custom-Styled Summary Bar:** Custom component with specific gradient and padding as specified.

## 3. Execution Steps (Agent Scope)
1. **Setup & UI Primitives:** Complete/verify `src/components/ui` components (Input, Checkbox, Select, Toast, etc.) using `@base-ui/react` primitives.
2. **Auth & Layout:** Implement `useAuthStore`, `LoginForm` `[scaffold]`, and `AdminLayout`.
3. **Data & Ledger:** Implement `useFieldStore` with mock data and `FieldLedger` `[scaffold]`.
4. **Bulk Actions:** Add selection logic and the floating `ActionBar` `[scaffold]`.
5. **Builder Shell:** Implement the `Dialog` container `[scaffold]` for the drawer.
6. **DND Integration:** Add `dnd-kit` to the virtualized table `[scaffold]`.
7. **Theming & Summary:** Add `ThemeToggle` and the `SummaryBar` `[scaffold]`.

*Note: Steps related to `[manual]` stories in Epic 3 will be left for the developer.*

## 4. Final Questions
1. **Manual Placeholders:** For the `[manual]` sections in the Builder, I will implement the basic **split-panel layout** shell (Editor left, Preview right) so the developer just needs to fill in the logic.
2. **Slugification Utility:** I will provide a `slugify` helper function in `src/lib/utils.ts` to assist the developer.
3. **Toast Setup:** I will set up the `Toast.Provider` globally and export a `toast` helper that uses the `toastManager`.
