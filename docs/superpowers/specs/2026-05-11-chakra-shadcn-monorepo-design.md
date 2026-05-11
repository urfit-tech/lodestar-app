# Chakra v1 → shadcn UI 設計系統遷移 Spec

**日期**：2026-05-11  
**狀態**：已批准，待實作

---

## 目標

建立一個全新的私有 monorepo（`urfit-ui`），以 shadcn（最新版）為技術基礎，完全復刻 lodestar-app 中使用的 Chakra UI v1 元件外觀。最終目標是讓 lodestar-app 能完全移除 `@chakra-ui` 依賴。

**不在範圍內**：
- API 相容性（不需要和 Chakra 同名 props）
- Animation 相容性（不需要和 Chakra 相同動畫）
- 公開發布 npm（私有套件）

---

## §1 架構

### Monorepo 結構

```
urfit-ui/                               # 新 git repo
├── package.json                        # pnpm workspace root
├── pnpm-workspace.yaml
├── packages/
│   └── ui/                             # 元件套件
│       ├── package.json                # name: @urfit/ui
│       ├── tailwind.config.ts          # Chakra v1 token 對應
│       ├── vite.config.ts              # lib mode build
│       ├── src/
│       │   ├── tokens/
│       │   │   └── chakra-v1.css       # CSS 變數（顏色、圓角、陰影）
│       │   ├── components/             # shadcn 元件（逐批新增）
│       │   └── index.ts                # barrel export
│       └── dist/
│           ├── index.js                # ES module
│           └── index.css               # 預編譯 CSS（含所有 Tailwind utility）
└── apps/
    └── storybook/                      # Storybook 8 + Vite
```

### CSS 整合策略（方案 B）

- `packages/ui` 內部使用 **Tailwind CSS + shadcn** 開發
- build 時透過 Vite lib mode 將 Tailwind 編譯成靜態 CSS，輸出 `dist/index.css`
- **lodestar-app 不需要安裝 Tailwind**，只需在 `main.tsx` 加一行 import：
  ```ts
  import '@urfit/ui/dist/index.css'
  ```
- 未來若想遷移到方案 A（lodestar-app 也加 Tailwind），只需：移除上述 import、安裝 Tailwind、把 `packages/ui/src` 加入 `content` 路徑，元件本身不需變動

### lodestar-app 連結方式

開發期間透過 pnpm workspace 連結（不需發布到 npm）：

```yaml
# lodestar-app/pnpm-workspace.yaml（新增）
packages:
  - '../urfit-ui/packages/ui'
```

```json
// lodestar-app/package.json（新增 dependency）
"@urfit/ui": "workspace:*"
```

---

## §2 Chakra v1 → shadcn Token 映射

直接從 lodestar-app 的 `node_modules/@chakra-ui/react` 讀取真實 token 值，對應到 shadcn CSS variables 與 Tailwind config。

### CSS Variables（`chakra-v1.css`）

```css
:root {
  /* 主色（Chakra blue.500）*/
  --primary: #3182ce;
  --primary-foreground: #ffffff;

  /* 邊框（Chakra gray.200）*/
  --border: #E2E8F0;
  --input: #E2E8F0;

  /* 背景 */
  --background: #ffffff;
  --foreground: #1A202C;        /* gray.800 */

  /* Muted（Chakra gray.100）*/
  --muted: #EDF2F7;
  --muted-foreground: #718096;  /* gray.500 */

  /* Focus ring（Chakra shadows.outline）*/
  --ring: rgba(66, 153, 225, 0.6);

  /* 圓角（Chakra radii.md）*/
  --radius: 0.375rem;
}
```

### Tailwind Config 映射

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      borderRadius: {
        sm: '0.125rem',   // Chakra radii.sm
        DEFAULT: '0.25rem', // Chakra radii.base
        md: '0.375rem',   // Chakra radii.md
        lg: '0.5rem',     // Chakra radii.lg
        xl: '0.75rem',    // Chakra radii.xl
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        md: '1rem',       // 16px（Chakra 預設）
        lg: '1.125rem',
        xl: '1.25rem',
      },
      spacing: {
        // Chakra 與 Tailwind 預設 spacing 相同（4px base），不需覆蓋
      },
      colors: {
        blue: {
          50: '#ebf8ff', 100: '#bee3f8', 200: '#90cdf4',
          300: '#63b3ed', 400: '#4299e1', 500: '#3182ce',
          600: '#2b6cb0', 700: '#2c5282', 800: '#2a4365', 900: '#1A365D',
        },
        gray: {
          50: '#F7FAFC', 100: '#EDF2F7', 200: '#E2E8F0',
          300: '#CBD5E0', 400: '#A0AEC0', 500: '#718096',
          600: '#4A5568', 700: '#2D3748', 800: '#1A202C', 900: '#171923',
        },
      },
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
      },
    },
  },
}
```

---

## §3 元件範圍與分批計畫

每批完成後即可在 lodestar-app 替換對應 import，不需等待全部完成。

### Phase 1 — 核心 + Layout（涵蓋 ~60% 使用次數）

| 元件 | shadcn 對應 | 備註 |
|------|------------|------|
| Button, ButtonGroup | `button` | variant: solid/outline/ghost |
| IconButton | `button` + icon slot | |
| Skeleton, SkeletonText, SkeletonCircle | `skeleton` | |
| Spinner | 自製（CSS animation） | shadcn 無此元件 |
| Divider | `separator` | |
| Text, Heading | 自製 wrapper | 純語意標籤 + Chakra fontSize token |
| Box | 自製 wrapper | `<div>` + className pass-through |
| Flex | 自製 wrapper | `<div style={{display:'flex'}}>` |
| HStack | 自製 wrapper | `<div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>` 預設 gap=2（8px） |
| Stack | 自製 wrapper | 垂直排列版 |
| Spacer | 自製 wrapper | `<div style={{flex:1}}>` |
| Center | 自製 wrapper | flexbox center |
| Container | 自製 wrapper | max-width + margin auto |
| Icon | 重新匯出 **lucide-react** | 替換 @chakra-ui/icons；shadcn 預設圖示庫 |

**注意**：Box/Flex/HStack/Stack 不支援 Chakra style props（如 `mt="4"`）。lodestar-app 遷移時需將 style props 改為 `className` 或 inline style。

### Phase 2 — 表單元件（涵蓋 ~85% 使用次數）

| 元件 | shadcn 對應 |
|------|------------|
| Input, InputGroup, InputRightElement | `input` + 自製 group wrapper |
| Select | `select` |
| Textarea | `textarea` |
| FormControl, FormLabel, FormErrorMessage | `form` components |
| Checkbox, CheckboxGroup | `checkbox` |
| Radio, RadioGroup, useRadioGroup | `radio-group` |
| Switch | `switch` |
| useToast | shadcn **`sonner`**（shadcn 官方推薦的 toast 方案） |

### Phase 3 — 複合元件（涵蓋 ~97% 使用次數）

| 元件 | shadcn 對應 |
|------|------------|
| Tabs, TabList, Tab, TabPanels, TabPanel | `tabs` |
| Menu, MenuButton, MenuList, MenuItem | `dropdown-menu` |
| Collapse | `collapsible` |
| Table, Thead, Tbody, Tr, Th, Td | `table` |
| useDisclosure | 自製 hook（useState + 開/關/toggle） |
| Progress | `progress` |
| CircularProgress, CircularProgressLabel | 自製（SVG circle） |

### Phase 4 — 收尾（完成後可移除 @chakra-ui）

| 元件 | shadcn 對應 |
|------|------------|
| Modal, ModalHeader, ModalContent, ModalBody | `dialog` |
| Accordion + 子元件 | `accordion` |
| Tag, Badge | `badge` |
| Link | 自製 wrapper |
| Image | 自製 wrapper（native `<img>`） |
| OrderedList, ListItem | 自製 wrapper |
| CloseButton | `button` variant=ghost + X icon |

---

## §4 Storybook 設定

- **版本**：Storybook 8，builder 使用 Vite
- **位置**：`apps/storybook/`
- **Addon**：`@storybook/addon-essentials`（controls、actions、docs）
- 每個元件提供 stories，涵蓋 Default、各 variant、各 size
- `.storybook/preview.ts` import `chakra-v1.css` 確保 token 生效
- 視覺核對靠人工對照，不設定自動截圖測試

---

## §5 pnpm Scripts

```bash
# 開發
pnpm --filter @urfit/ui dev        # watch build（packages/ui）
pnpm --filter storybook dev        # Storybook localhost:6006
pnpm -r dev                        # 兩者同時啟動

# 建置
pnpm --filter @urfit/ui build      # 輸出 dist/index.js + dist/index.css
pnpm -r build                      # 全部建置
```

---

## §6 React 版本相容性

Radix UI（shadcn 底層）的 peer dependencies 支援 React 16.8 / 17 / 18 / 19，**lodestar-app 的 React 17 無需升級**即可使用本套件。

---

## §7 遷移策略（lodestar-app 端）

1. 在 lodestar-app 的 `pnpm-workspace.yaml` 新增 `urfit-ui/packages/ui` 路徑
2. `package.json` 新增 `"@urfit/ui": "workspace:*"`
3. `main.tsx` 加入 `import '@urfit/ui/dist/index.css'`
4. 按 Phase 1 → 4 順序，逐批替換 `from '@chakra-ui/react'` 為 `from '@urfit/ui'`
5. 每批替換後執行 lodestar-app dev server 驗證外觀
6. Phase 4 完成後移除 `@chakra-ui/*` 所有依賴
