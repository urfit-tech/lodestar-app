# urfit-ui Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 `urfit-ui` monorepo，完成 Chakra v1 token 映射設定，實作 Phase 1 核心元件（Button、Skeleton、Spinner、Divider、Text/Heading、Layout wrappers、Icon），輸出可供 lodestar-app 使用的 `@urfit/ui` 套件。

**Architecture:** 新 git repo 位於 `/Users/eddy/urfit/urfit-ui/`，使用 pnpm workspaces。`packages/ui` 以 shadcn（Tailwind v4 CSS-first）開發元件，透過 Vite lib mode 編譯成 `dist/index.js` + `dist/index.css`。`apps/storybook` 用 Storybook 8 + Vite 提供視覺驗證環境。Chakra v1 design tokens 透過 CSS `@theme` directive 覆寫 shadcn 預設值。

**Tech Stack:** pnpm 11、Node 22、shadcn latest（Tailwind v4.3）、`@tailwindcss/vite` 4.3、Vite 8、Storybook 10.3（v10 核心 addon 內建，無 addon-essentials）、lucide-react 1.x、TypeScript 5、React 17 peer

---

## 檔案結構總覽

```
/Users/eddy/urfit/urfit-ui/
├── package.json                            # workspace root（private）
├── pnpm-workspace.yaml
├── .gitignore
├── packages/
│   └── ui/
│       ├── package.json                    # name: @urfit/ui
│       ├── tsconfig.json
│       ├── tsconfig.build.json
│       ├── vite.config.ts
│       ├── components.json                 # shadcn config
│       └── src/
│           ├── styles/
│           │   └── globals.css             # @theme Chakra v1 tokens + shadcn vars
│           ├── lib/
│           │   └── utils.ts                # cn() helper（shadcn 產生）
│           ├── components/
│           │   ├── button.tsx              # shadcn button + Chakra variants
│           │   ├── button-group.tsx        # 自製 ButtonGroup wrapper
│           │   ├── icon-button.tsx         # 自製 IconButton wrapper
│           │   ├── skeleton.tsx            # shadcn skeleton（含 SkeletonText/Circle）
│           │   ├── spinner.tsx             # 自製 CSS spinner
│           │   ├── separator.tsx           # shadcn separator（Divider）
│           │   ├── typography.tsx          # Text, Heading wrappers
│           │   ├── layout.tsx              # Box, Flex, HStack, Stack, Spacer, Center, Container
│           │   └── icon.tsx                # lucide-react re-export + Icon wrapper
│           └── index.ts                    # barrel export
└── apps/
    └── storybook/
        ├── package.json
        ├── .storybook/
        │   ├── main.ts
        │   └── preview.ts
        └── stories/
            ├── button.stories.tsx
            ├── skeleton.stories.tsx
            ├── spinner.stories.tsx
            ├── separator.stories.tsx
            ├── typography.stories.tsx
            ├── layout.stories.tsx
            └── icon.stories.tsx
```

---

## Task 0: 初始化 urfit-ui monorepo

**Files:**
- Create: `/Users/eddy/urfit/urfit-ui/package.json`
- Create: `/Users/eddy/urfit/urfit-ui/pnpm-workspace.yaml`
- Create: `/Users/eddy/urfit/urfit-ui/.gitignore`

- [ ] **Step 1: 建立目錄並初始化 git**

```bash
mkdir -p /Users/eddy/urfit/urfit-ui
cd /Users/eddy/urfit/urfit-ui
git init
```

Expected: `Initialized empty Git repository in /Users/eddy/urfit/urfit-ui/.git/`

- [ ] **Step 2: 建立 workspace root package.json**

建立 `/Users/eddy/urfit/urfit-ui/package.json`：

```json
{
  "name": "urfit-ui",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm --filter @urfit/ui build"
  },
  "engines": {
    "node": ">=22",
    "pnpm": ">=11"
  }
}
```

- [ ] **Step 3: 建立 pnpm-workspace.yaml**

建立 `/Users/eddy/urfit/urfit-ui/pnpm-workspace.yaml`：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

- [ ] **Step 4: 建立 .gitignore**

建立 `/Users/eddy/urfit/urfit-ui/.gitignore`：

```
node_modules/
dist/
.turbo/
*.local
.DS_Store
storybook-static/
```

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "chore: initialize urfit-ui monorepo"
```

---

## Task 1: 建立 packages/ui 骨架

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/tsconfig.build.json`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: 建立目錄**

```bash
mkdir -p /Users/eddy/urfit/urfit-ui/packages/ui/src/styles
mkdir -p /Users/eddy/urfit/urfit-ui/packages/ui/src/lib
mkdir -p /Users/eddy/urfit/urfit-ui/packages/ui/src/components
```

- [ ] **Step 2: 建立 packages/ui/package.json**

```json
{
  "name": "@urfit/ui",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./dist/index.css": "./dist/index.css"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "vite build --watch",
    "build": "tsc -p tsconfig.build.json --noEmit && vite build",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  },
  "dependencies": {
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.14.0",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@vitejs/plugin-react": "^6.0.1",
    "tailwindcss": "^4.3.0",
    "typescript": "^5.8.0",
    "vite": "^8.0.0",
    "vite-plugin-dts": "^5.0.0"
  }
}
```

- [ ] **Step 3: 建立 tsconfig.json**

建立 `packages/ui/tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 建立 tsconfig.build.json**

建立 `packages/ui/tsconfig.build.json`：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5: 建立空白 src/index.ts**

建立 `packages/ui/src/index.ts`：

```ts
// Phase 1 exports will be added here
```

- [ ] **Step 6: 安裝依賴**

```bash
cd /Users/eddy/urfit/urfit-ui
pnpm install
```

Expected: `node_modules` 建立，無錯誤

- [ ] **Step 7: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "chore: scaffold packages/ui with TypeScript config"
```

---

## Task 2: shadcn init + Chakra v1 token CSS

**Files:**
- Create: `packages/ui/components.json`
- Create: `packages/ui/src/lib/utils.ts`
- Create: `packages/ui/src/styles/globals.css`

- [ ] **Step 1: 在 packages/ui 執行 shadcn init**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest init
```

當 CLI 詢問時選擇：
- Style：**New York**（較接近 Chakra 風格）
- Base color：**Neutral**
- CSS variables：**Yes**

這會產生 `components.json` 和 `src/lib/utils.ts`，並修改 `src/styles/globals.css`。

- [ ] **Step 2: 確認 components.json 內容**

`packages/ui/components.json` 應該看起來像：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "ui": "@/components"
  }
}
```

若 `"config": ""` 不是空字串（代表 CLI 用了 Tailwind v3），改成空字串。

- [ ] **Step 3: 用 Chakra v1 token 覆寫 globals.css**

將 `packages/ui/src/styles/globals.css` 完整替換成：

```css
@import "tailwindcss";

@theme {
  /* ── Chakra v1 Color Palette ── */
  --color-blue-50: #ebf8ff;
  --color-blue-100: #bee3f8;
  --color-blue-200: #90cdf4;
  --color-blue-300: #63b3ed;
  --color-blue-400: #4299e1;
  --color-blue-500: #3182ce;
  --color-blue-600: #2b6cb0;
  --color-blue-700: #2c5282;
  --color-blue-800: #2a4365;
  --color-blue-900: #1A365D;

  --color-gray-50: #F7FAFC;
  --color-gray-100: #EDF2F7;
  --color-gray-200: #E2E8F0;
  --color-gray-300: #CBD5E0;
  --color-gray-400: #A0AEC0;
  --color-gray-500: #718096;
  --color-gray-600: #4A5568;
  --color-gray-700: #2D3748;
  --color-gray-800: #1A202C;
  --color-gray-900: #171923;

  /* ── Chakra v1 Border Radius ── */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-DEFAULT: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* ── Chakra v1 Font Sizes ── */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* ── Chakra v1 Shadows ── */
  --shadow-xs: 0 0 0 1px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-outline: 0 0 0 3px rgba(66, 153, 225, 0.6);
}

/* ── shadcn CSS Variables（Chakra v1 對應值）── */
:root {
  --background: #ffffff;
  --foreground: #1A202C;          /* gray.800 */

  --card: #ffffff;
  --card-foreground: #1A202C;

  --popover: #ffffff;
  --popover-foreground: #1A202C;

  --primary: #3182ce;             /* blue.500 */
  --primary-foreground: #ffffff;

  --secondary: #EDF2F7;           /* gray.100 */
  --secondary-foreground: #1A202C;

  --muted: #EDF2F7;               /* gray.100 */
  --muted-foreground: #718096;    /* gray.500 */

  --accent: #EDF2F7;
  --accent-foreground: #1A202C;

  --destructive: #E53E3E;         /* Chakra red.500 */
  --destructive-foreground: #ffffff;

  --border: #E2E8F0;              /* gray.200 */
  --input: #E2E8F0;
  --ring: rgba(66, 153, 225, 0.6); /* Chakra focus ring */

  --radius: 0.375rem;             /* Chakra radii.md */
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat: add shadcn init and Chakra v1 token CSS"
```

---

## Task 3: Vite lib mode build pipeline

**Files:**
- Create: `packages/ui/vite.config.ts`

- [ ] **Step 1: 建立 vite.config.ts**

建立 `packages/ui/vite.config.ts`：

```ts
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    dts({
      include: ['src'],
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UrfitUI',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: 'index.css',
      },
    },
    cssCodeSplit: false,
  },
})
```

- [ ] **Step 2: 執行 build 確認成功**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm build
```

Expected：
```
dist/index.js     (可能很小，因為 index.ts 目前是空的)
dist/index.css    (含 Tailwind base styles)
dist/index.d.ts
```

若有 TypeScript 或 vite 錯誤，根據訊息修正後再試。

- [ ] **Step 3: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "chore: configure Vite lib mode build"
```

---

## Task 4: 設定 Storybook 10

**Files:**
- Create: `apps/storybook/package.json`
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.ts`

**Storybook v10 重要改變：**
- `@storybook/addon-essentials` 已移除 — 核心 addon（actions、controls、viewport、backgrounds、toolbars 等）內建於 storybook core
- 只需三個主要套件：`storybook`、`@storybook/react-vite`、`@storybook/addon-docs`（可選）
- main.ts 的 `addons` array 可留空（核心 addon 自動載入）

- [ ] **Step 1: 建立 apps/storybook 目錄**

```bash
mkdir -p /Users/eddy/urfit/urfit-ui/apps/storybook/.storybook
mkdir -p /Users/eddy/urfit/urfit-ui/apps/storybook/stories
```

- [ ] **Step 2: 建立 apps/storybook/package.json**

```json
{
  "name": "storybook",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
  },
  "dependencies": {
    "@urfit/ui": "workspace:*",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "devDependencies": {
    "@storybook/addon-docs": "^10.3.0",
    "@storybook/react-vite": "^10.3.0",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@vitejs/plugin-react": "^6.0.1",
    "storybook": "^10.3.0",
    "vite": "^8.0.0"
  }
}
```

- [ ] **Step 3: 建立 .storybook/main.ts**

建立 `apps/storybook/.storybook/main.ts`：

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

- [ ] **Step 4: 建立 .storybook/preview.ts**

建立 `apps/storybook/.storybook/preview.ts`：

```ts
import type { Preview } from '@storybook/react-vite'
import '@urfit/ui/dist/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

- [ ] **Step 5: 安裝 Storybook 依賴**

```bash
cd /Users/eddy/urfit/urfit-ui
pnpm install
```

- [ ] **Step 6: 確認 Storybook 能啟動**

先建立一個暫時 story 確認設定正確。建立 `apps/storybook/stories/placeholder.stories.tsx`：

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Setup/Placeholder',
}
export default meta

export const Ready: StoryObj = {
  render: () => <div style={{ padding: 16 }}>Storybook is working ✓</div>,
}
```

```bash
cd /Users/eddy/urfit/urfit-ui/apps/storybook
pnpm dev
```

在瀏覽器開啟 `http://localhost:6006`，確認看到 "Storybook is working ✓"。確認後 Ctrl+C 停止。

- [ ] **Step 7: 刪除暫時 story 並 commit**

```bash
rm /Users/eddy/urfit/urfit-ui/apps/storybook/stories/placeholder.stories.tsx
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "chore: set up Storybook 10 with Vite"
```

---

## Task 5: Button、ButtonGroup、IconButton

**Files:**
- Create: `apps/storybook/stories/button.stories.tsx`
- Create: `packages/ui/src/components/button.tsx` （由 shadcn 產生，再修改）
- Create: `packages/ui/src/components/button-group.tsx`
- Create: `packages/ui/src/components/icon-button.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story（TDD 視覺測試）**

建立 `apps/storybook/stories/button.stories.tsx`：

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, ButtonGroup, IconButton } from '@urfit/ui'
import { SearchIcon } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
}
export default meta
type Story = StoryObj<typeof Button>

export const Solid: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button>Button</Button>
      <Button colorScheme="blue">Blue</Button>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => <Button isLoading>Loading</Button>,
}

export const Group: Story = {
  render: () => (
    <ButtonGroup>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <IconButton aria-label="search" icon={<SearchIcon size={16} />} />
  ),
}
```

- [ ] **Step 2: 確認 Story 在 Storybook 中顯示錯誤（元件尚不存在）**

```bash
cd /Users/eddy/urfit/urfit-ui/apps/storybook
pnpm dev
```

在瀏覽器應看到 import 錯誤（`@urfit/ui` 未 export `Button`）。確認後 Ctrl+C 停止。

- [ ] **Step 3: 用 shadcn CLI 新增 Button**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add button
```

這會建立 `src/components/button.tsx`（或 `src/components/ui/button.tsx`）。若放在 `ui/` 子目錄，將其移到 `src/components/button.tsx`：

```bash
mv src/components/ui/button.tsx src/components/button.tsx
rmdir src/components/ui 2>/dev/null || true
```

- [ ] **Step 4: 修改 button.tsx 加入 Chakra v1 相容的 variant**

將 `packages/ui/src/components/button.tsx` 內容完整替換成：

```tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        solid:
          'bg-[--primary] text-white hover:bg-[#2b6cb0] active:bg-[#2c5282]',
        outline:
          'border border-[--primary] text-[--primary] bg-transparent hover:bg-[#ebf8ff]',
        ghost:
          'bg-transparent text-[--foreground] hover:bg-[--muted]',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-[--radius-sm]',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  colorScheme?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 5: 建立 button-group.tsx**

建立 `packages/ui/src/components/button-group.tsx`：

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  isAttached?: boolean
  spacing?: number
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, isAttached = false, spacing = 2, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex',
        isAttached
          ? '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none'
          : '',
        !isAttached && `gap-${spacing}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
```

- [ ] **Step 6: 建立 icon-button.tsx**

建立 `packages/ui/src/components/icon-button.tsx`：

```tsx
import * as React from 'react'
import { Button, type ButtonProps } from '@/components/button'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  'aria-label': string
  icon: React.ReactElement
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', ...props }, ref) => (
    <Button
      ref={ref}
      size="icon"
      className={cn(
        size === 'sm' && 'h-8 w-8',
        size === 'lg' && 'h-12 w-12',
        className,
      )}
      {...props}
    >
      {icon}
    </Button>
  ),
)
IconButton.displayName = 'IconButton'

export { IconButton }
```

- [ ] **Step 7: 更新 index.ts**

將 `packages/ui/src/index.ts` 替換成：

```ts
export { Button, buttonVariants, type ButtonProps } from './components/button'
export { ButtonGroup, type ButtonGroupProps } from './components/button-group'
export { IconButton, type IconButtonProps } from './components/icon-button'
```

- [ ] **Step 8: 先 build packages/ui，再啟動 Storybook 驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook
pnpm dev
```

在 `http://localhost:6006` 的 Components/Button 下確認：
- Solid variant：藍色實心背景，白色文字
- Outline variant：藍色邊框，藍色文字
- Ghost variant：無背景，hover 顯示灰色
- Loading：顯示旋轉 icon
- Group：三個按鈕並排
- WithIcon：方形 icon button

與 Chakra v1 Button 外觀比對後 Ctrl+C。

- [ ] **Step 9: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add Button, ButtonGroup, IconButton"
```

---

## Task 6: Skeleton、SkeletonText、SkeletonCircle

**Files:**
- Create: `apps/storybook/stories/skeleton.stories.tsx`
- Create: `packages/ui/src/components/skeleton.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/skeleton.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Skeleton, SkeletonCircle, SkeletonText } from '@urfit/ui'

const meta: Meta = { title: 'Components/Skeleton' }
export default meta

export const Basic = () => <Skeleton className="h-4 w-48" />

export const TextLines = () => (
  <div style={{ width: 300 }}>
    <SkeletonText noOfLines={4} spacing={3} />
  </div>
)

export const Circle = () => <SkeletonCircle size={12} />

export const Card = () => (
  <div style={{ display: 'flex', gap: 12, padding: 16 }}>
    <SkeletonCircle size={10} />
    <div style={{ flex: 1 }}>
      <SkeletonText noOfLines={2} spacing={3} />
    </div>
  </div>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 skeleton**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add skeleton
```

若產生在 `src/components/ui/skeleton.tsx`，移動：

```bash
mv src/components/ui/skeleton.tsx src/components/skeleton.tsx
rmdir src/components/ui 2>/dev/null || true
```

- [ ] **Step 3: 修改 skeleton.tsx 加入 SkeletonText 和 SkeletonCircle**

將 `packages/ui/src/components/skeleton.tsx` 完整替換成：

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[--muted]', className)}
      {...props}
    />
  )
}

interface SkeletonTextProps {
  noOfLines?: number
  spacing?: number
  className?: string
}

function SkeletonText({ noOfLines = 3, spacing = 2, className }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col', className)} style={{ gap: `${spacing * 0.25}rem` }}>
      {Array.from({ length: noOfLines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === noOfLines - 1 ? '80%' : '100%' }}
        />
      ))}
    </div>
  )
}

interface SkeletonCircleProps {
  size?: number
  className?: string
}

function SkeletonCircle({ size = 10, className }: SkeletonCircleProps) {
  const px = size * 4
  return (
    <Skeleton
      className={cn('rounded-full', className)}
      style={{ width: px, height: px }}
    />
  )
}

export { Skeleton, SkeletonText, SkeletonCircle }
```

- [ ] **Step 4: 更新 index.ts**

在 `packages/ui/src/index.ts` 末尾加入：

```ts
export { Skeleton, SkeletonText, SkeletonCircle } from './components/skeleton'
```

- [ ] **Step 5: Build 並在 Storybook 驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm dev
```

確認：Skeleton 呈現灰色脈動動畫，SkeletonText 顯示多行，SkeletonCircle 呈圓形。Ctrl+C 停止。

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add Skeleton, SkeletonText, SkeletonCircle"
```

---

## Task 7: Spinner

**Files:**
- Create: `apps/storybook/stories/spinner.stories.tsx`
- Create: `packages/ui/src/components/spinner.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/spinner.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Spinner } from '@urfit/ui'

const meta: Meta = { title: 'Components/Spinner' }
export default meta

export const Default = () => <Spinner />

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Spinner size="xs" />
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </div>
)

export const Colors = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Spinner color="#3182ce" />
    <Spinner color="#718096" />
    <Spinner color="#E53E3E" />
  </div>
)
```

- [ ] **Step 2: 建立 spinner.tsx（自製，shadcn 無此元件）**

建立 `packages/ui/src/components/spinner.tsx`：

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const

type SpinnerSize = keyof typeof sizeMap

interface SpinnerProps {
  size?: SpinnerSize
  color?: string
  thickness?: number
  emptyColor?: string
  className?: string
  label?: string
}

function Spinner({
  size = 'md',
  color = 'var(--primary)',
  thickness = 2,
  emptyColor = 'transparent',
  className,
  label = 'Loading...',
}: SpinnerProps) {
  const px = sizeMap[size]
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block', className)}
      style={{
        width: px,
        height: px,
        borderWidth: thickness,
        borderStyle: 'solid',
        borderColor: emptyColor,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'urfit-spin 0.65s linear infinite',
      }}
    >
      <style>{`
        @keyframes urfit-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Spinner, type SpinnerProps }
```

- [ ] **Step 3: 更新 index.ts**

在 `packages/ui/src/index.ts` 末尾加入：

```ts
export { Spinner, type SpinnerProps } from './components/spinner'
```

- [ ] **Step 4: Build 並在 Storybook 驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm dev
```

確認：Spinner 呈藍色旋轉圓圈，五種尺寸從 12px 到 40px 依序增大。Ctrl+C 停止。

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add Spinner"
```

---

## Task 8: Divider（Separator）

**Files:**
- Create: `apps/storybook/stories/separator.stories.tsx`
- Create: `packages/ui/src/components/separator.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/separator.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Divider } from '@urfit/ui'

const meta: Meta = { title: 'Components/Divider' }
export default meta

export const Horizontal = () => (
  <div style={{ padding: 16 }}>
    <p>Above</p>
    <Divider my={4} />
    <p>Below</p>
  </div>
)

export const Vertical = () => (
  <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
    <span>Left</span>
    <Divider orientation="vertical" mx={4} />
    <span>Right</span>
  </div>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 separator**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add separator
```

若在 `src/components/ui/separator.tsx`，移動到 `src/components/separator.tsx`。

- [ ] **Step 3: 修改 separator.tsx，加入 Divider alias 及 margin props**

將 `packages/ui/src/components/separator.tsx` 完整替換成：

```tsx
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  mx?: number
  my?: number
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  ({ className, orientation = 'horizontal', decorative = true, mx, my, style, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-[--border]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      style={{
        marginLeft: mx ? `${mx * 0.25}rem` : undefined,
        marginRight: mx ? `${mx * 0.25}rem` : undefined,
        marginTop: my ? `${my * 0.25}rem` : undefined,
        marginBottom: my ? `${my * 0.25}rem` : undefined,
        ...style,
      }}
      {...props}
    />
  ),
)
Separator.displayName = SeparatorPrimitive.Root.displayName

const Divider = Separator

export { Separator, Divider }
```

- [ ] **Step 4: 更新 index.ts**

```ts
export { Separator, Divider } from './components/separator'
```

- [ ] **Step 5: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm dev
```

確認：水平線顯示為 1px 灰色線，垂直線顯示正確。Ctrl+C。

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add Divider (Separator)"
```

---

## Task 9: Text、Heading

**Files:**
- Create: `apps/storybook/stories/typography.stories.tsx`
- Create: `packages/ui/src/components/typography.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/typography.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Heading, Text } from '@urfit/ui'

const meta: Meta = { title: 'Components/Typography' }
export default meta

export const TextSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Text fontSize="xs">Extra Small (xs)</Text>
    <Text fontSize="sm">Small (sm)</Text>
    <Text fontSize="md">Medium / Base (md)</Text>
    <Text fontSize="lg">Large (lg)</Text>
    <Text fontSize="xl">Extra Large (xl)</Text>
  </div>
)

export const HeadingSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Heading as="h1" size="4xl">Heading 4xl</Heading>
    <Heading as="h2" size="3xl">Heading 3xl</Heading>
    <Heading as="h3" size="2xl">Heading 2xl</Heading>
    <Heading as="h4" size="xl">Heading xl</Heading>
  </div>
)
```

- [ ] **Step 2: 建立 typography.tsx**

建立 `packages/ui/src/components/typography.tsx`：

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const fontSizeMap: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  fontSize?: keyof typeof fontSizeMap | string
  as?: React.ElementType
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, fontSize = 'md', as: Tag = 'p', ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(fontSizeMap[fontSize] ?? '', className)}
      {...props}
    />
  ),
)
Text.displayName = 'Text'

const headingSizeMap: Record<string, string> = {
  xs: 'text-xs font-semibold',
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-lg font-semibold',
  xl: 'text-xl font-semibold',
  '2xl': 'text-2xl font-semibold',
  '3xl': 'text-3xl font-bold',
  '4xl': 'text-4xl font-bold',
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: keyof typeof headingSizeMap | string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size = '2xl', as: Tag = 'h2', ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(headingSizeMap[size] ?? '', className)}
      {...props}
    />
  ),
)
Heading.displayName = 'Heading'

export { Text, Heading, type TextProps, type HeadingProps }
```

- [ ] **Step 3: 更新 index.ts**

```ts
export { Text, Heading, type TextProps, type HeadingProps } from './components/typography'
```

- [ ] **Step 4: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm dev
```

確認字體大小與 Chakra v1 相同。Ctrl+C。

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add Text and Heading"
```

---

## Task 10: Layout Wrappers（Box、Flex、HStack、Stack、Spacer、Center、Container）

**Files:**
- Create: `apps/storybook/stories/layout.stories.tsx`
- Create: `packages/ui/src/components/layout.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/layout.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Box, Center, Container, Flex, HStack, Spacer, Stack } from '@urfit/ui'

const meta: Meta = { title: 'Components/Layout' }
export default meta

const Block = ({ color = '#cbd5e0', label = '' }) => (
  <div style={{ background: color, padding: '8px 16px', borderRadius: 4, fontSize: 12 }}>{label || '■'}</div>
)

export const BoxExample = () => (
  <Box p={4} bg="#ebf8ff" borderRadius="md">Box with padding and background</Box>
)

export const FlexExample = () => (
  <Flex gap={2} align="center">
    <Block label="A" />
    <Block label="B" color="#bee3f8" />
    <Block label="C" color="#90cdf4" />
  </Flex>
)

export const HStackExample = () => (
  <HStack spacing={4}>
    <Block label="1" />
    <Block label="2" color="#bee3f8" />
    <Block label="3" color="#90cdf4" />
  </HStack>
)

export const StackExample = () => (
  <Stack spacing={3}>
    <Block label="Top" />
    <Block label="Middle" color="#bee3f8" />
    <Block label="Bottom" color="#90cdf4" />
  </Stack>
)

export const SpacerExample = () => (
  <Flex>
    <Block label="Left" />
    <Spacer />
    <Block label="Right" color="#bee3f8" />
  </Flex>
)

export const CenterExample = () => (
  <Center style={{ height: 100, border: '1px solid #e2e8f0' }}>
    Centered Content
  </Center>
)

export const ContainerExample = () => (
  <Container maxW="lg" style={{ border: '1px dashed #cbd5e0', padding: 16 }}>
    Container with maxW=lg
  </Container>
)
```

- [ ] **Step 2: 建立 layout.tsx**

建立 `packages/ui/src/components/layout.tsx`：

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const maxWMap: Record<string, string> = {
  xs: '20rem',
  sm: '24rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  full: '100%',
  container: '1280px',
}

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  p?: number
  px?: number
  py?: number
  m?: number
  mx?: number
  my?: number
  bg?: string
  borderRadius?: string
  as?: React.ElementType
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, p, px, py, m, mx, my, bg, borderRadius, as: Tag = 'div', style, ...props }, ref) => (
    <Tag
      ref={ref}
      className={className}
      style={{
        padding: p !== undefined ? `${p * 0.25}rem` : undefined,
        paddingLeft: px !== undefined ? `${px * 0.25}rem` : undefined,
        paddingRight: px !== undefined ? `${px * 0.25}rem` : undefined,
        paddingTop: py !== undefined ? `${py * 0.25}rem` : undefined,
        paddingBottom: py !== undefined ? `${py * 0.25}rem` : undefined,
        margin: m !== undefined ? `${m * 0.25}rem` : undefined,
        marginLeft: mx !== undefined ? `${mx * 0.25}rem` : undefined,
        marginRight: mx !== undefined ? `${mx * 0.25}rem` : undefined,
        marginTop: my !== undefined ? `${my * 0.25}rem` : undefined,
        marginBottom: my !== undefined ? `${my * 0.25}rem` : undefined,
        backgroundColor: bg,
        borderRadius,
        ...style,
      }}
      {...props}
    />
  ),
)
Box.displayName = 'Box'

interface FlexProps extends BoxProps {
  direction?: React.CSSProperties['flexDirection']
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
  wrap?: React.CSSProperties['flexWrap']
  gap?: number
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ direction, align, justify, wrap, gap, style, ...props }, ref) => (
    <Box
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        gap: gap !== undefined ? `${gap * 0.25}rem` : undefined,
        ...style,
      }}
      {...props}
    />
  ),
)
Flex.displayName = 'Flex'

interface HStackProps extends BoxProps {
  spacing?: number
  align?: React.CSSProperties['alignItems']
}

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ spacing = 2, align = 'center', style, ...props }, ref) => (
    <Box
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: align,
        gap: `${spacing * 0.25}rem`,
        ...style,
      }}
      {...props}
    />
  ),
)
HStack.displayName = 'HStack'

interface StackProps extends BoxProps {
  spacing?: number
  align?: React.CSSProperties['alignItems']
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ spacing = 2, align, style, ...props }, ref) => (
    <Box
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        gap: `${spacing * 0.25}rem`,
        ...style,
      }}
      {...props}
    />
  ),
)
Stack.displayName = 'Stack'

const Spacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} style={{ flex: 1 }} {...props} />,
)
Spacer.displayName = 'Spacer'

const Center = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ style, ...props }, ref) => (
    <Box
      ref={ref}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
      {...props}
    />
  ),
)
Center.displayName = 'Center'

interface ContainerProps extends BoxProps {
  maxW?: string
  centerContent?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxW = 'container', centerContent, style, ...props }, ref) => (
    <Box
      ref={ref}
      style={{
        width: '100%',
        maxWidth: maxWMap[maxW] ?? maxW,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: centerContent ? 'flex' : undefined,
        flexDirection: centerContent ? 'column' : undefined,
        alignItems: centerContent ? 'center' : undefined,
        ...style,
      }}
      {...props}
    />
  ),
)
Container.displayName = 'Container'

export {
  Box,
  Flex,
  HStack,
  Stack,
  Spacer,
  Center,
  Container,
  type BoxProps,
  type FlexProps,
  type HStackProps,
  type StackProps,
  type ContainerProps,
}
```

- [ ] **Step 3: 更新 index.ts**

```ts
export {
  Box, Flex, HStack, Stack, Spacer, Center, Container,
  type BoxProps, type FlexProps, type HStackProps, type StackProps, type ContainerProps,
} from './components/layout'
```

- [ ] **Step 4: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm dev
```

確認 Storybook 中各 layout 元件渲染正確，spacing 與 Chakra v1 相同（1 unit = 4px）。Ctrl+C。

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add layout wrappers (Box, Flex, HStack, Stack, Spacer, Center, Container)"
```

---

## Task 11: Icon（lucide-react wrapper）

**Files:**
- Create: `apps/storybook/stories/icon.stories.tsx`
- Create: `packages/ui/src/components/icon.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/icon.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Icon } from '@urfit/ui'
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Lock,
  Paperclip,
  Search,
  Settings,
  X,
} from 'lucide-react'

const meta: Meta = { title: 'Components/Icon' }
export default meta

export const CommonIcons = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
    <Icon as={Search} boxSize={5} />
    <Icon as={Settings} boxSize={5} />
    <Icon as={ChevronDown} boxSize={5} />
    <Icon as={ChevronRight} boxSize={5} />
    <Icon as={Lock} boxSize={5} />
    <Icon as={CheckCircle} boxSize={5} color="#38A169" />
    <Icon as={AlertCircle} boxSize={5} color="#E53E3E" />
    <Icon as={Paperclip} boxSize={5} />
    <Icon as={X} boxSize={5} />
  </div>
)
```

- [ ] **Step 2: 建立 icon.tsx**

建立 `packages/ui/src/components/icon.tsx`：

```tsx
import { type LucideIcon, type LucideProps } from 'lucide-react'
import * as React from 'react'

interface IconProps extends LucideProps {
  as: LucideIcon
  boxSize?: number
}

function Icon({ as: IconComponent, boxSize, color, style, ...props }: IconProps) {
  const size = boxSize ? boxSize * 4 : undefined
  return (
    <IconComponent
      size={size}
      color={color}
      style={style}
      {...props}
    />
  )
}

export { Icon, type IconProps }
```

- [ ] **Step 3: 更新 index.ts**

```ts
export { Icon, type IconProps } from './components/icon'
```

同時重新匯出 lodestar-app 常用的 lucide-react icon，對應 `@chakra-ui/icons`。注意：lucide-react 不帶 `Icon` 後綴，需要用 `as` 別名；且新版 lucide-react 部分 icon 改名（`AlertTriangle` → `TriangleAlert`，`HelpCircle` → `CircleHelp`）：

```ts
export {
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Paperclip as AttachmentIcon,
  TriangleAlert as WarningIcon,
  Eye as ViewIcon,
  CircleHelp as QuestionIcon,
  X as CloseIcon,
} from 'lucide-react'
```

若 build 時發現 `TriangleAlert` 或 `CircleHelp` 不存在，執行 `pnpm dlx lucide-react@latest` 確認正確的 icon 名稱。

- [ ] **Step 4: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm dev
```

確認所有 icon 正確顯示，`boxSize={5}` = 20px。Ctrl+C。

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): add Icon wrapper and lucide-react icon re-exports"
```

---

## Task 12: 最終 Build 驗證 + lodestar-app 連結測試

**Files:**
- Modify: `/Users/eddy/urfit/lodestar-app/pnpm-workspace.yaml`（驗證連結用，完成後可回復）

- [ ] **Step 1: 完整 build packages/ui**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm build
```

確認 `dist/` 下有：
- `dist/index.js`（所有 Phase 1 元件）
- `dist/index.css`（含 Chakra v1 token CSS variables）
- `dist/index.d.ts`（TypeScript 型別）

- [ ] **Step 2: 確認 index.ts 包含所有匯出**

`packages/ui/src/index.ts` 完整內容應為：

```ts
export { Button, buttonVariants, type ButtonProps } from './components/button'
export { ButtonGroup, type ButtonGroupProps } from './components/button-group'
export { IconButton, type IconButtonProps } from './components/icon-button'
export { Skeleton, SkeletonText, SkeletonCircle } from './components/skeleton'
export { Spinner, type SpinnerProps } from './components/spinner'
export { Separator, Divider } from './components/separator'
export { Text, Heading, type TextProps, type HeadingProps } from './components/typography'
export {
  Box, Flex, HStack, Stack, Spacer, Center, Container,
  type BoxProps, type FlexProps, type HStackProps, type StackProps, type ContainerProps,
} from './components/layout'
export { Icon, type IconProps } from './components/icon'
export {
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Paperclip as AttachmentIcon,
  TriangleAlert as WarningIcon,
  Eye as ViewIcon,
  CircleHelp as QuestionIcon,
  X as CloseIcon,
} from 'lucide-react'
```

- [ ] **Step 3: 測試 lodestar-app 能 import（可選，非必要）**

若想立即驗證整合，在 `/Users/eddy/urfit/lodestar-app/pnpm-workspace.yaml` 加入：

```yaml
packages:
  - '...'              # 原有的 packages
  - '../urfit-ui/packages/ui'
```

在 lodestar-app 的 `package.json` 的 `dependencies` 加：

```json
"@urfit/ui": "workspace:*"
```

執行：

```bash
cd /Users/eddy/urfit/lodestar-app
pnpm install
```

然後在任一 `.tsx` 檔案試著 import：

```ts
import { Button } from '@urfit/ui'
```

確認 TypeScript 不報錯即可。驗證完畢後，lodestar-app 的正式整合留待 Phase 2-4 計畫完成後進行。

- [ ] **Step 4: Final commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git commit -m "feat(ui): Phase 1 complete - core components + layout wrappers"
```

---

## 完成後的狀態

Phase 1 完成後，`@urfit/ui` 提供：
- **Button**、**ButtonGroup**、**IconButton**（含 isLoading、variant、size）
- **Skeleton**、**SkeletonText**、**SkeletonCircle**（animate-pulse）
- **Spinner**（5 尺寸，CSS animation）
- **Divider / Separator**（水平、垂直）
- **Text**、**Heading**（Chakra v1 fontSize scale）
- **Box**、**Flex**、**HStack**、**Stack**、**Spacer**、**Center**、**Container**（spacing scale 相容）
- **Icon**（lucide-react wrapper + 常用 icon re-export）

所有元件的外觀 token 來自 Chakra v1 實際值，React 17 相容。

**下一步**：參照本計畫格式，建立 `2026-05-11-urfit-ui-phase2.md`，涵蓋 Phase 2（表單元件）。
