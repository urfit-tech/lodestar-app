# React 17 + Vite Migration — Design

**Date:** 2026-04-30
**Status:** Approved (pending user review of this document)
**Owner:** Eddy Tan

## Goal

Replace the CRA-based build pipeline with Vite while keeping React on 17. The motivation is dev-loop speed (A), production bundle quality (C), and getting off `react-scripts` which is no longer maintained (D). React 18 is **not** in scope — this minimises risk by avoiding the old ecosystem (antd 3, Chakra 1, framer-motion 2, react-bootstrap 1, react-helmet 6) that has not been validated on React 18.

The migration ships as a single big-bang PR onto `develop`, internally split into reviewable commits.

## Why React 17 + Vite (and not the alternatives)

| | React 17 + CRA (status quo) | **React 17 + Vite (chosen)** | React 18 + Vite |
|---|---|---|---|
| dev/build speed | slow | fast | fast |
| old library compatibility | safe | safe | risk on antd3 / chakra1 / helmet6 / framer-motion2 / react-bootstrap1 |
| React Compiler | works (`target: '17'`) | works unchanged | requires `target: '18'` |
| `react-hot-loader` | kept | removed (Vite Refresh) | removed |
| env vars / index.html / `createRoot` | unchanged | must change | must change |
| effort | 0 | medium | large (medium + library upgrades + types) |

React 17 + Vite captures ~95% of the practical benefit at ~50% of the risk of the React 18 path.

## Scope

### In scope

- Replace build/dev tooling: remove `react-scripts`, `react-app-rewired`, `customize-cra`, `config-overrides.js`, `react-hot-loader`, `react-error-overlay`, `react-app-rewire-hot-loader`, `env-cmd`.
- Add `vite@^5`, `@vitejs/plugin-react@^4`, `vite-plugin-style-import@^2`, `consola` (peer dep workaround for the style-import plugin).
- Rename all `process.env.REACT_APP_*` (~106 occurrences across 71 files) to `import.meta.env.VITE_*`. Rename keys in `.env.development` / `.env.staging` / `.env.production` accordingly.
- Replace `process.env.PUBLIC_URL` (~10 files) with `import.meta.env.BASE_URL`.
- Move `public/index.html` to root `index.html`. Replace `%PUBLIC_URL%` placeholders with `/`-prefixed paths. Add `<script type="module" src="/src/index.tsx">`.
- Simplify `src/index.tsx`: remove `react-hot-loader/root` wrapper and the dead `hydrate` branch (no real SSR exists). Keep React 17 `react-dom` `render`.
- Replace `src/react-app-env.d.ts` with `vite/client` types.
- Bump TypeScript `target` from `es5` to `es2017`.
- Reproduce CRA `splitChunks` (antd / vendors) using Rollup `output.manualChunks`.
- Build output stays at `build/` (avoids touching `deploy-to-s3.yml`'s `SOURCE_DIR`).
- Replace `React.lazy(() => import(\`./pages/${pageName}\`))` in `LoadablePage.tsx` with `import.meta.glob` (folder + flat patterns) for predictable chunk graph.
- Switch package manager from Yarn 4 to pnpm. Bump Node 18 → 22.

### Explicitly out of scope

- React 17 → 18.
- antd 3 → 4/5; Chakra 1 → 2; framer-motion 2 → 11; react-bootstrap 1 → 2; react-helmet → react-helmet-async.
- react-router 5 → 6.
- Adding test coverage.
- Reorganising `tsconfig.dist.json` / library-build artefacts (legacy, no scripts wired).
- Service worker rewrite (keep the `unregister()` call as-is).
- Changing React Compiler target away from `'17'`.

### Unchanged

- Build artefact path `build/`, S3 deploy workflow.
- Existence and location of `.env.{NODE_ENV}` files (only inner key names change).
- antd 3 less theme customisation via `src/theme.json`.
- `lodestar-app-element` git URL dep and the practice of importing from its `src/`.

## Architecture

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'
import path from 'path'
import themeVars from './src/theme.json'

const ReactCompilerConfig = {
  target: '17',
  compilationMode: 'annotation',
  sources: (filename: string) =>
    filename.includes(path.resolve('src')) &&
    !filename.includes('lodestar-app-element'),
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    createStyleImportPlugin({
      resolves: [AntdResolve()],
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name) => `antd/es/${name}/style/index.js`,
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themeVars,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/antd/')) return 'antd'
          if (id.includes('node_modules/')) return 'vendors'
        },
      },
    },
  },
  server: { port: 3000 },
}))
```

### CRA → Vite mapping

| CRA / `config-overrides.js` | Vite equivalent |
|---|---|
| `react-scripts start/build` | `vite` / `vite build` |
| `react-app-rewired` + `customize-cra` | `vite.config.ts` |
| `removeModuleScopePlugin` | not needed (Vite has no such restriction) |
| `babelInclude([src, lodestar-app-element/src])` | esbuild + babel auto; lodestar-app-element gets `optimizeDeps.include` if needed |
| `fixBabelImports('antd', { libraryDirectory: 'es', style: true })` | `vite-plugin-style-import` + `AntdResolve` |
| `addLessLoader({ javascriptEnabled, modifyVars })` | `css.preprocessorOptions.less` |
| `react-app-rewire-hot-loader` | Vite React Refresh (built into `@vitejs/plugin-react`) |
| `splitChunks` cache groups (antd / vendors) | `rollupOptions.output.manualChunks` |
| `optimization.runtimeChunk: 'single'` | Rollup default; tunable via `output.chunkFileNames` if needed |
| `config.devtool = false` (prod) | `build.sourcemap: false` |
| `env-cmd -f .env.${NODE_ENV}` | `vite build --mode {mode}` reads `.env.{mode}` natively |

`splitChunks` size hints (`maxSize: 250000`, `minSize: 20000`) do not have a direct Rollup equivalent and are dropped. Bundle size will be re-verified manually post-migration.

### Env loading flow

- File locations: `.env.production` / `.env.staging` / `.env.development` stay where they are.
- All `REACT_APP_*` keys rename to `VITE_*`.
- Build invocation: `vite build --mode production` / `vite build --mode staging`.
- Code reads via `import.meta.env.VITE_*`. Types come from `vite/client`.

## Code changes

### `src/index.tsx` (simplified)

```tsx
import React from 'react'
import { render } from 'react-dom'
import App from './Application'
import { unregister } from './serviceWorker'

const appId = import.meta.env.VITE_APP_ID || (window as any).APP_ID
const rootElement = document.getElementById('root')

if (!appId) {
  render(<div>Application cannot be loaded.</div>, rootElement)
} else {
  render(<App appId={appId} />, rootElement)
}
unregister()
```

Rationale: there is no real SSR (verified — no `react-dom/server` usage anywhere), so the `hasChildNodes()` / `hydrate` branch is dead code. `react-hot-loader/root` is replaced by Vite's React Refresh.

### `index.html`

- Move `public/index.html` to `index.html` at repo root.
- `%PUBLIC_URL%/manifest.json` → `/manifest.json`; `%PUBLIC_URL%/amp/...` → `/amp/...`.
- Add `<script type="module" src="/src/index.tsx"></script>` before `</body>`.
- Other static assets in `public/` (`amp/`, `manifest.json`, `insider-sw-sdk.js`, `privacy.html`, `robots.txt`, `sample_orders.csv`, `spin.css`) stay in `public/` — Vite copies them verbatim into `build/`.

### `src/LoadablePage.tsx`

Replace the template-literal dynamic import with explicit `import.meta.glob` patterns to handle the mix of folder-style pages (`pages/HomePage/index.tsx`) and flat-file pages (`pages/CartPage.tsx`):

```tsx
const folderModules = import.meta.glob('./pages/**/index.{ts,tsx}')
const flatModules = import.meta.glob('./pages/*.{ts,tsx}')

const PageComponent = React.lazy(() => {
  const folderKey = `./pages/${pageName}/index.tsx`
  const flatKey = `./pages/${pageName}.tsx`
  const loader = folderModules[folderKey] ?? flatModules[flatKey]
  if (!loader) throw new Error(`Unknown page: ${pageName}`)
  return loader() as Promise<{ default: React.ComponentType }>
})
```

This is preferred over relying on Vite's built-in dynamic-import-vars because:
- The two patterns make the chunk graph explicit and predictable.
- Mixed folder / flat layout is a known footgun for dynamic-import-vars.
- Errors surface as a clear `Unknown page: X` rather than an opaque plugin failure.

### Env vars rename (codemod)

- AST codemod: `process.env.REACT_APP_(\w+)` → `import.meta.env.VITE_$1`. Use `ast-grep` or `jscodeshift`.
- `process.env.PUBLIC_URL` → `import.meta.env.BASE_URL`.
- Update `.env.development` / `.env.production` / `.env.staging` keys: `REACT_APP_X=...` → `VITE_X=...`.
- Manual review pass after the codemod to catch string-interpolated keys / template literals (the regex covers most but not all cases).

### `package.json`

Remove: `react-scripts`, `react-app-rewired`, `react-app-rewire-hot-loader`, `react-hot-loader`, `react-error-overlay`, `customize-cra`, `env-cmd`, `@types/node@12`.

Add: `vite@^5`, `@vitejs/plugin-react@^4`, `vite-plugin-style-import@^2`, `consola`, `@types/node@^22`.

Scripts:
```json
{
  "start": "vite",
  "build": "vite build --mode ${NODE_ENV:-production}",
  "preview": "vite preview",
  "test": "echo 'no tests'",
  "format": "pnpm format:organize-imports && pnpm format:prettier",
  "trans": "pnpm trans:clean && pnpm trans:compile && pnpm trans:extract && pnpm trans:manage && pnpm trans:clean"
}
```
(Drop `NODE_OPTIONS=--openssl-legacy-provider` — Node 22 + Vite does not need it.)

`engines.node`: `">=22"`. Add `"packageManager": "pnpm@9"` (or whatever LTS version `mise.toml` pins; align both).

### Files deleted / added / modified

**Delete:** `config-overrides.js`, `yarn.lock`, `.yarn/`, `.yarnrc.yml`, `src/react-app-env.d.ts`.

**Add:** `vite.config.ts`, `pnpm-lock.yaml`, `.npmrc` (containing `auto-install-peers=true`).

**Modify:** `mise.toml` (Node 22 + pnpm), `tsconfig.json` (`target: es2017`, `types: ["vite/client"]`), `.github/workflows/deploy-to-s3.yml`.

## DevOps coordination

### Env vars rename — sync action

The env rename is the only part of this PR that cannot be code-only.

| Environment | Action |
|---|---|
| Local | PR ships updated `.env`, `.env.development`; pull + use. |
| Staging | PR ships updated `.env.staging` (already tracked in repo). No console action needed. |
| Production | PR ships updated `.env.production` (already tracked in repo). No console action needed. |
| CI (`deploy-to-s3.yml`) | No direct env injection; reads `.env.{mode}` files via `vite build --mode`, so PR-only. |

All four env files are tracked in the repo (only `.env.*.local` is gitignored). The PR contains the rename, no out-of-band coordination required.

### CI workflow (`.github/workflows/deploy-to-s3.yml`)

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile   # was: yarn install --immutable

- name: Build project
  run: pnpm build                        # was: yarn build
```

`mise-action` continues to set up Node + pnpm from `mise.toml`. `vite build --mode ${NODE_ENV}` reads `.env.{mode}` natively, matching current `env-cmd -f .env.${NODE_ENV:-production}` behaviour.

### Commit structure (within the single PR)

1. `chore: switch package manager from yarn 4 to pnpm` (lockfile + mise + .npmrc + workflow).
2. `chore: bump node 18 → 22`.
3. `refactor: remove react-hot-loader` (`src/index.tsx` + deps).
4. `refactor: rename REACT_APP_* env vars to VITE_*` (codemod, mechanical diff).
5. `refactor: replace dynamic page imports with import.meta.glob` (`LoadablePage`).
6. `feat: replace CRA with Vite build` (`vite.config.ts`, delete `config-overrides.js` / `react-app-env.d.ts`, modify `index.html`, update scripts).
7. `chore: update CI to use pnpm + vite build`.

Commits are split for review readability inside one big-bang PR; they do not all build standalone. Commits 1–3 (pnpm, Node 22, react-hot-loader removal) remain CRA-compatible. Commits 4–6 (env rename, `import.meta.glob`, Vite config) introduce Vite-only constructs and must land together. Commit 7 finalises CI.

## Pre-merge validation

There are no automated tests, so validation is manual.

| Check | How |
|---|---|
| dev server boots | `pnpm start`; load main routes; no console errors. |
| Production build | `pnpm build` produces `build/` without errors. |
| Bundle size | Compare `build/static/js/*.js` total against `develop`. Acceptable: ±20%. |
| antd theming | Visually verify primary color #000, button height 44 px. |
| Page lazy load | Navigate to ≥5 distinct pages: `HomePage`, `CartPage`, `MeetingPage`, `MemberPage`, `ProgramContentPage`. |
| Env vars injected | DevTools console: `import.meta.env.VITE_APP_ID` etc. resolve. |
| Staging deploy | Merge → auto-deploy to `static-dev.kolable.com` → smoke test. |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| antd 3 less incompatible with `less@4` | verified | high | Pin `less@^3.13.1` (already satisfied by current package.json). |
| `vite-plugin-style-import` missing peer dep `consola` | verified | medium | Explicitly install `consola`. |
| pnpm symlink layout breaks `lodestar-app-element` (git URL dep, src import) | medium | high | Pre-merge smoke test on lodestar-app-element components; fall back to `node-linker=hoisted` in `.npmrc` if needed. |
| React Compiler babel plugin behaves differently on Vite vs CRA | medium | medium | Verify a representative annotated context provider is still compiled; inspect build output. |
| `import.meta.glob` patterns miss an edge-case page | medium | medium | Two explicit glob patterns (folder + flat); test 5 representative pages; clear `Unknown page: X` error. |
| Runtime `process.env.NODE_ENV` references break | medium | low | Vite expands `process.env.NODE_ENV` automatically. |
| Third-party libs reading `process.env` at runtime throw `ReferenceError` | medium | low | `define: { 'process.env': {} }` as a fallback. |
| Browsers in production browserslist don't support Vite default ES target | low | low | browserslist is permissive; Vite's default `modules` target (ES2017+) is broadly supported. Add `@vitejs/plugin-legacy` if a real device fails. |
| `manualChunks` reshapes chunk graph → temporary cache miss | low | low | One-time effect post-deploy; recovers naturally. |

### Out-of-scope risks (acknowledged, not addressed)

- antd 3 / Chakra 1 / framer-motion 2 / react-bootstrap 1 / react-helmet 6 long-term staleness.
- React 17 EOL.
- react-router 5 future-proofing.

These are conscious deferrals — addressing them would multiply the migration's footprint.

## Rollback

Single-PR / squash-merge: a problem in staging or production is reversed by reverting the merge commit. CI rebuilds against the prior CRA setup automatically (env files revert with the merge, no console state to undo).

If only a single page or route fails post-deploy, the most likely cause is an `import.meta.glob` pattern miss; patching the pattern and redeploying is faster than a full revert.

## Open confirmation points before merge

- Confirm pnpm + git URL dep (`lodestar-app-element`) install cleanly without `node-linker=hoisted`.
- Confirm React Compiler annotations (`'use memo'`) on existing context providers still compile under `@vitejs/plugin-react`'s babel pipeline — inspect a build artefact for evidence.
