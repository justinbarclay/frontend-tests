# Sandbox Framework Outlines

This directory contains three subprojects, each implementing the same [Schema Architect](./SPECIFICATION.md) spec using a different UI framework stack:

| Directory | Framework | Styling |
|---|---|---|
| `mantine-v8/` | Mantine v8 | Mantine CSS (built-in) |
| `shadcn-baseui/` | shadcn + Base UI | Tailwind CSS v4 |
| `jolly-ui/` | JollyUI (React Aria Components) | Tailwind CSS v3 |

Each project is a Vite + React + TypeScript app. The setup instructions below can be used to recreate each environment from scratch.

---

## 1. Mantine v8

### Step 1: Initialize Vite Project

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Mantine v8 Dependencies

```bash
npm install @mantine/core@8 @mantine/hooks@8 @mantine/notifications@8
```

### Step 3: Basic Setup

Update `src/main.tsx` to include styles and the `MantineProvider`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./App";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
```

> **Note:** Mantine v8 ships pre-built CSS and no longer requires PostCSS configuration.

---

## 2. shadcn + Base UI

shadcn components backed by [Base UI](https://base-ui.com) primitives instead of Radix UI, using the `base-vega` style.

### Step 1: Initialize Vite Project

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Tailwind CSS v4 and Path Alias Support

```bash
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
```

### Step 3: Configure Vite

Update `vite.config.ts`:

```typescript
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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

### Step 5: Install Base UI and Utilities

```bash
npm install @base-ui/react class-variance-authority clsx tailwind-merge lucide-react
```

### Step 6: Initialize shadcn with Base UI Style

```bash
npx shadcn@latest init
```

_Follow the prompts and select **Style: base-vega** when asked._

### Step 7: Add Components

```bash
npx shadcn@latest add button
```

---

## 3. JollyUI

JollyUI provides shadcn/ui-compatible components built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) — same copy-paste workflow as shadcn, but with RAC accessibility primitives instead of Radix UI underneath.

### Step 1: Initialize Vite Project

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2: Install Tailwind CSS v3 and Path Alias Support

```bash
npm install -D tailwindcss autoprefixer postcss @types/node
```

### Step 3: Configure PostCSS

Create `postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Step 4: Configure Vite for Path Aliases

Update `vite.config.ts`:

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Step 5: Configure TypeScript Path Aliases

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

### Step 6: Install JollyUI Dependencies

```bash
npm install react-aria-components tailwindcss-animate tailwindcss-react-aria-components
npm install class-variance-authority clsx tailwind-merge lucide-react
```

### Step 7: Configure Tailwind

Create `tailwind.config.js` with the required plugins:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-react-aria-components")],
};
```

### Step 8: Initialize shadcn

```bash
npx shadcn@latest init
```

_Follow the prompts (Style: Default, Color: Slate, CSS Variables: Yes)._

### Step 9: Add Components via JollyUI Registry

```bash
npx shadcn@latest add https://jollyui.dev/default/button
```
