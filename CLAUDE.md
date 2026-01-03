# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bolt CEP project - an Adobe CEP (Common Extensibility Platform) extension for **Adobe Illustrator** built with React, TypeScript, Vite, and Sass. CEP extensions run inside Adobe applications as HTML panels with access to both the browser runtime and the host application's ExtendScript engine.

## Commands

```bash
# Development with HMR (run build first)
yarn dev          # Start Vite dev server with hot reload on port 3000

# Build extension (creates symlink to Adobe extensions folder)
yarn build        # Full build with TypeScript compilation

# Package for distribution
yarn zxp          # Build and package as ZXP file (dist/zxp/)
yarn zip          # Build and package as ZIP archive (dist/zip/)

# Utilities
yarn symlink      # Create symlink to Adobe extensions folder
yarn delsymlink   # Remove symlink
yarn serve        # Preview built extension on port 5000
```

**Important:** Enable PlayerDebugMode in Adobe for dev/build testing. Only ZXP-packaged extensions work without it.

## Architecture

### Two-Layer System
The extension runs in two separate JavaScript environments that communicate via CEP's `evalScript`:

1. **CEP/Panel Layer** (`src/js/`) - Modern ES6+ running in Chromium (CEP's embedded browser)
   - Entry: `src/js/main/index-react.tsx` -> `main.tsx`
   - Uses React 19, Vite, full Node.js access
   - Communicates with ExtendScript via `evalTS()` and `evalES()`

2. **ExtendScript Layer** (`src/jsx/`) - ES3-compatible code running in Adobe's scripting engine
   - Entry: `src/jsx/index.ts` -> compiled to `dist/cep/jsx/index.js`
   - Has direct access to Adobe DOM (app, documents, layers, etc.)
   - App-specific code in `src/jsx/ilst/ilst.ts` (Illustrator)
   - Compiled via Rollup + Babel to ES3

### Key Communication Pattern

**CEP to ExtendScript:**
```typescript
// Type-safe call from CEP (src/js)
import { evalTS } from "../lib/utils/bolt";
evalTS("functionName", arg1, arg2).then(result => { ... });

// Legacy string-based call
evalES(`functionName("${arg}")`);
```

**ExtendScript to CEP:**
```typescript
// 1. Define event type in src/shared/universals.d.ts
export type EventTS = { myEvent: { data: string } };

// 2. Listen in CEP
listenTS("myEvent", (data) => console.log(data));

// 3. Dispatch from ExtendScript
dispatchTS("myEvent", { data: "value" });
```

### Configuration

- `cep.config.ts` - Extension metadata, host apps, panels, ZXP signing settings
- `vite.config.ts` - Vite build config for CEP layer
- `vite.es.config.ts` - Rollup build config for ExtendScript layer
- `src/shared/shared.ts` - Shared constants (namespace, version) used by both layers

### Namespace Scoping

All ExtendScript functions are attached to `$[ns]` (where `ns` = extension ID from config) to avoid global namespace pollution. The `evalTS`/`evalES` functions automatically scope calls.

## Adding ExtendScript Functions

1. Add function in `src/jsx/ilst/ilst.ts` (or create app-specific module)
2. Export from the module
3. TypeScript types flow through to CEP layer via `@esTypes` path alias
4. Call with `evalTS("functionName", args)` from CEP

## Code Organization Rules

**IMPORTANT:** Always split code into smaller, focused components:

1. **Separation of concerns:**
   - `src/js/lib/types.ts` - all TypeScript types
   - `src/js/lib/config.ts` - configuration data and constants
   - `src/js/lib/store/` - Zustand stores

2. **Component structure:**
   - `src/js/components/ui/` - reusable UI components (shadcn)
   - `src/js/components/layout/` - layout components (AppTabs, etc.)
   - `src/js/components/views/` - page/view components (HomeView, TextView, etc.)

3. **Data-driven UI:**
   - Define data in `config.ts`, iterate in components
   - Never hardcode lists in JSX - use `.map()` over config arrays

4. **Keep main.tsx minimal:**
   - Only compose top-level layout components
   - No business logic or complex JSX

## File Structure

```
src/
├── js/           # CEP panel (React/Vite)
│   ├── main/     # Main panel entry
│   ├── lib/      # Utilities, types, config, stores
│   │   ├── types.ts    # TypeScript types
│   │   ├── config.ts   # Configuration data
│   │   └── store/      # Zustand stores
│   └── components/
│       ├── ui/         # shadcn components
│       ├── layout/     # Layout components
│       └── views/      # View/page components
├── jsx/          # ExtendScript (compiled to ES3)
│   ├── index.ts  # Entry, app detection, namespace setup
│   ├── ilst/     # Illustrator-specific code
│   └── utils/    # Shared ExtendScript utilities
└── shared/       # Shared between CEP and ExtendScript
    ├── shared.ts      # Config exports (namespace, version)
    └── universals.d.ts # Event type definitions
```

## Debugging

- CEP panel: Chrome DevTools at `localhost:8860` (configured in cep.config.ts)
- ExtendScript errors: Caught and logged to CEP console via `evalTS` error handling
- Browser preview: `localhost:3000/main/` during `yarn dev` (limited functionality without Adobe host)
