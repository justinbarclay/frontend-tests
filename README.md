!# Sandbox Framework Outlines

This directory contains instructions and commands to quickly spin up different frontend framework environments using Vite and TypeScript.

## 1. Mantine v8

To set up a fresh Mantine v8 environment:

### Step 1: Initialize Vite Project

```bash
mkdir -p sandbox/mantine-v8
cd sandbox/mantine-v8
npm create vite@latest . -- --template react-ts
```

### Step 2: Install Mantine v8 Dependencies

```bash
npm install @mantine/core@8 @mantine/hooks@8 @mantine/dates@8 @mantine/notifications@8
```

### Step 3: Install PostCSS Dependencies

Mantine requires PostCSS for its CSS variables and mixins.

```bash
npm install -D postcss postcss-preset-mantine@8 postcss-simple-vars
```

### Step 4: Configure PostCSS

Create a `postcss.config.cjs` file in `sandbox/mantine-v8/`:

```javascript
module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em",
        "mantine-breakpoint-sm": "48em",
        "mantine-breakpoint-md": "62em",
        "mantine-breakpoint-lg": "75em",
        "mantine-breakpoint-xl": "88em",
      },
    },
  },
};
```

### Step 5: Basic Setup

Update `src/main.tsx` to include styles and the `MantineProvider`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";

// Core styles
import "@mantine/core/styles.css";
// Optional package styles
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
```

---

## 2. shadcn/ui

To set up a fresh shadcn/ui environment with Vite and Tailwind CSS v4:

### Step 1: Initialize Vite Project

```bash
mkdir -p sandbox/shadcn-ui
cd sandbox/shadcn-ui
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 3: Configure Vite for Tailwind and Path Aliases

Install Node types for path resolution:

```bash
npm install -D @types/node
```

Update `vite.config.ts`:

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Step 4: Configure Path Aliases in TypeScript

Update `tsconfig.app.json` (or `tsconfig.json`):

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Step 5: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

_Follow the prompts (Style: Default, Color: Slate, CSS Variables: Yes)._

### Step 6: Add Components

```bash
npx shadcn@latest add button
```

---

## 3. React Aria Components + Tailwind CSS v4

To set up a fresh environment with React Aria Components and Tailwind CSS v4:

### Step 1: Initialize Vite Project

```bash
mkdir -p sandbox/react-aria-rac
cd sandbox/react-aria-rac
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Dependencies

```bash
npm install react-aria-components tailwindcss @tailwindcss/vite tailwindcss-react-aria-components
```

### Step 3: Configure Vite

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Step 4: Configure CSS

In `src/index.css`, import Tailwind and the React Aria plugin:

```css
@import "tailwindcss";

/* Register the React Aria Components plugin for state variants (hovered, pressed, etc.) */
@plugin "tailwindcss-react-aria-components";
```

### Step 5: Usage Example

Update `src/App.tsx` to test a button with state variants:

```tsx
import { Button } from "react-aria-components";

export default function App() {
  return (
    <div className="p-8">
      <Button className="bg-blue-600 pressed:bg-blue-700 hovered:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors focus-visible:ring-2 ring-blue-300 outline-none">
        Click Me
      </Button>
    </div>
  );
}
```

---

## 4. JollyUI

JollyUI provides shadcn/ui-compatible components built on React Aria Components — same copy-paste workflow as shadcn, but with RAC accessibility primitives instead of Radix UI underneath.

### Step 1: Initialize Vite Project

```bash
mkdir -p sandbox/jolly-ui
cd sandbox/jolly-ui
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 3: Configure Vite for Tailwind and Path Aliases

```bash
npm install -D @types/node
```

Update `vite.config.ts`:

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Update `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Step 4: Install JollyUI Dependencies

```bash
npm install react-aria-components
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```

### Step 5: Initialize shadcn

JollyUI uses the shadcn CLI to add components:

```bash
npx shadcn@latest init
```

_Follow the prompts (Style: Default, Color: Zinc, CSS Variables: Yes)._

### Step 6: Add Components via JollyUI Registry

```bash
npx shadcn@latest add https://jollyui.dev/default/button
```
