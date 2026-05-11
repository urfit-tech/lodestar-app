# urfit-ui Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 `@urfit/ui` 新增 Phase 3 複合元件（Tabs、Menu、Collapse、Table、useDisclosure、Progress、CircularProgress），維持 Chakra v1 外觀。完成後可涵蓋 lodestar-app 約 97% 的 Chakra 使用。

**Architecture:** 沿用 Phase 1+2 已建立的 urfit-ui monorepo。複合元件大多用 React Context 維持 Chakra 的 compound component 模式（如 `<Tabs>` 透過 context 把 active tab 傳給 `<TabList>` 與 `<TabPanels>`）。Radix UI 提供大部分底層行為（Tabs、DropdownMenu、Collapsible、Progress）；CircularProgress 與 useDisclosure 是自製。

**Tech Stack:** 同 Phase 1+2。新增 Radix 依賴：`@radix-ui/react-tabs`、`@radix-ui/react-dropdown-menu`、`@radix-ui/react-collapsible`、`@radix-ui/react-progress`（由 shadcn add 自動加入，可能需要補裝獨立 package 取代 umbrella）。

---

## 檔案結構新增

```
packages/ui/src/components/
├── tabs.tsx               # Tabs + TabList + Tab + TabPanels + TabPanel + context
├── menu.tsx               # Menu + MenuButton + MenuList + MenuItem (dropdown-menu)
├── collapse.tsx           # Collapse (collapsible)
├── table.tsx              # Table + Thead + Tbody + Tr + Th + Td
├── progress.tsx           # Progress
├── circular-progress.tsx  # CircularProgress + CircularProgressLabel (SVG)
└── ...

packages/ui/src/hooks/
└── use-disclosure.ts      # useDisclosure hook

apps/storybook/stories/
├── tabs.stories.tsx
├── menu.stories.tsx
├── collapse.stories.tsx
├── table.stories.tsx
├── progress.stories.tsx
└── circular-progress.stories.tsx
```

注意：`packages/ui/src/hooks/` 目錄是新增的（Phase 1+2 沒有獨立 hook 目錄）。

---

## Task 1: Tabs + TabList + Tab + TabPanels + TabPanel

**Files:**
- Create: `apps/storybook/stories/tabs.stories.tsx`
- Create: `packages/ui/src/components/tabs.tsx`（shadcn add 後改寫）
- Modify: `packages/ui/src/index.ts`

**設計重點：** Chakra 的 Tabs 把 `<TabList>` 與 `<TabPanels>` 分開，內部用 context 配對 Tab 與 TabPanel 的順序。Radix Tabs 用 `value` 字串配對，更穩定。我們混合兩者：對外維持 Chakra 結構（TabList/TabPanels 包 Tab/TabPanel），內部用 Radix 的 Tabs.Root + 自動生成的 value（index-based）。

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/tabs.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@urfit/ui'

const meta: Meta = { title: 'Components/Tabs' }
export default meta

export const Default = () => (
  <Tabs>
    <TabList>
      <Tab>One</Tab>
      <Tab>Two</Tab>
      <Tab>Three</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>Content of tab one</TabPanel>
      <TabPanel>Content of tab two</TabPanel>
      <TabPanel>Content of tab three</TabPanel>
    </TabPanels>
  </Tabs>
)

export const WithDefaultIndex = () => (
  <Tabs defaultIndex={1}>
    <TabList>
      <Tab>One</Tab>
      <Tab>Two (active)</Tab>
      <Tab>Three</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>One panel</TabPanel>
      <TabPanel>Two panel</TabPanel>
      <TabPanel>Three panel</TabPanel>
    </TabPanels>
  </Tabs>
)

export const Disabled = () => (
  <Tabs>
    <TabList>
      <Tab>Active</Tab>
      <Tab isDisabled>Disabled</Tab>
      <Tab>Also active</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>First content</TabPanel>
      <TabPanel>Can't reach</TabPanel>
      <TabPanel>Third content</TabPanel>
    </TabPanels>
  </Tabs>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 tabs**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add tabs --yes
```

如果 shadcn 改用 `radix-ui` umbrella，補裝獨立套件：

```bash
pnpm add @radix-ui/react-tabs
```

**Step 3: 完整覆寫 tabs.tsx**

刪除 shadcn 產生的檔案後，建立 `packages/ui/src/components/tabs.tsx`：

```tsx
import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  registerTab: () => string
  registerPanel: () => string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

interface TabsProps {
  defaultIndex?: number
  index?: number
  onChange?: (index: number) => void
  children?: React.ReactNode
  className?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultIndex = 0, index, onChange, children, className }, ref) => {
    let tabCount = 0
    let panelCount = 0
    const registerTab = () => String(tabCount++)
    const registerPanel = () => String(panelCount++)

    const [internal, setInternal] = React.useState(defaultIndex)
    const current = index ?? internal
    const handleChange = (value: string) => {
      const next = parseInt(value, 10)
      if (index === undefined) setInternal(next)
      onChange?.(next)
    }

    return (
      <TabsContext.Provider value={{ registerTab, registerPanel }}>
        <TabsPrimitive.Root
          ref={ref}
          value={String(current)}
          onValueChange={handleChange}
          className={cn('w-full', className)}
        >
          {children}
        </TabsPrimitive.Root>
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = 'Tabs'

interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex h-10 items-center border-b border-[--border]', className)}
    {...props}
  />
))
TabList.displayName = 'TabList'

interface TabProps extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>, 'value'> {
  isDisabled?: boolean
}

const Tab = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabProps
>(({ className, isDisabled, disabled, ...props }, ref) => {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tab must be used inside <Tabs>')
  const value = React.useMemo(() => ctx.registerTab(), [])
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      disabled={isDisabled ?? disabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-4 h-10 text-sm font-medium text-[--muted-foreground] border-b-2 border-transparent transition-colors hover:text-[--foreground] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] disabled:pointer-events-none disabled:opacity-60 data-[state=active]:text-[--primary] data-[state=active]:border-[--primary]',
        className,
      )}
      {...props}
    />
  )
})
Tab.displayName = 'Tab'

interface TabPanelsProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabPanels = React.forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-2', className)} {...props} />
  ),
)
TabPanels.displayName = 'TabPanels'

interface TabPanelProps extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>, 'value'> {}

const TabPanel = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabPanelProps
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabPanel must be used inside <Tabs>')
  const value = React.useMemo(() => ctx.registerPanel(), [])
  return (
    <TabsPrimitive.Content
      ref={ref}
      value={value}
      className={cn('focus-visible:outline-none', className)}
      {...props}
    />
  )
})
TabPanel.displayName = 'TabPanel'

export {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  type TabsProps,
  type TabListProps,
  type TabProps,
  type TabPanelsProps,
  type TabPanelProps,
}
```

**重要 caveat：** `registerTab` / `registerPanel` 在 Tabs render 時被重置，依賴元件 render 順序。如果 Tab 列表是動態（例如 `.map()` 一個 array），每次 array 改變都會重新 register，邏輯仍然成立。但若有條件渲染（`{flag && <Tab>}`），可能會錯位——使用者要避免條件渲染 Tab/TabPanel。

- [ ] **Step 4: 更新 index.ts**

末尾**新增**：

```ts
export {
  Tabs, TabList, Tab, TabPanels, TabPanel,
  type TabsProps, type TabListProps, type TabProps, type TabPanelsProps, type TabPanelProps,
} from './components/tabs'
```

- [ ] **Step 5: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook pnpm-lock.yaml 2>/dev/null
git commit -m "feat(ui): add Tabs, TabList, Tab, TabPanels, TabPanel"
```

---

## Task 2: Menu + MenuButton + MenuList + MenuItem

**Files:**
- Create: `apps/storybook/stories/menu.stories.tsx`
- Create: `packages/ui/src/components/menu.tsx`
- Modify: `packages/ui/src/index.ts`

**設計：** 用 Radix DropdownMenu。MenuButton 是 Trigger（用 asChild 包 Button），MenuList 是 Content，MenuItem 是 Item。

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@urfit/ui'
import { ChevronDown } from 'lucide-react'

const meta: Meta = { title: 'Components/Menu' }
export default meta

export const Default = () => (
  <Menu>
    <MenuButton as={Button}>
      Actions <ChevronDown size={16} />
    </MenuButton>
    <MenuList>
      <MenuItem onClick={() => alert('Download')}>Download</MenuItem>
      <MenuItem onClick={() => alert('Create a Copy')}>Create a Copy</MenuItem>
      <MenuItem onClick={() => alert('Mark as Draft')}>Mark as Draft</MenuItem>
      <MenuItem onClick={() => alert('Delete')}>Delete</MenuItem>
    </MenuList>
  </Menu>
)

export const WithDisabledItem = () => (
  <Menu>
    <MenuButton as={Button}>
      Options <ChevronDown size={16} />
    </MenuButton>
    <MenuList>
      <MenuItem>Edit</MenuItem>
      <MenuItem disabled>Cannot do this</MenuItem>
      <MenuItem>Delete</MenuItem>
    </MenuList>
  </Menu>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 dropdown-menu**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add dropdown-menu --yes
pnpm add @radix-ui/react-dropdown-menu
```

- [ ] **Step 3: 刪除 shadcn 檔，建立 menu.tsx**

```bash
rm -f /Users/eddy/urfit/urfit-ui/packages/ui/src/components/dropdown-menu.tsx
```

建立 `packages/ui/src/components/menu.tsx`：

```tsx
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface MenuProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {}

function Menu(props: MenuProps) {
  return <DropdownMenuPrimitive.Root {...props} />
}
Menu.displayName = 'Menu'

interface MenuButtonProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {
  as?: React.ElementType
}

const MenuButton = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  MenuButtonProps
>(({ as, asChild, children, ...props }, ref) => {
  if (as) {
    const Comp = as
    return (
      <DropdownMenuPrimitive.Trigger asChild ref={ref} {...props}>
        <Comp>{children}</Comp>
      </DropdownMenuPrimitive.Trigger>
    )
  }
  return (
    <DropdownMenuPrimitive.Trigger ref={ref} asChild={asChild} {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  )
})
MenuButton.displayName = 'MenuButton'

interface MenuListProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {}

const MenuList = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  MenuListProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-[--border] bg-white p-1 shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
MenuList.displayName = 'MenuList'

interface MenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {}

const MenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  MenuItemProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'focus:bg-[--muted] focus:text-[--foreground]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  />
))
MenuItem.displayName = 'MenuItem'

export {
  Menu, MenuButton, MenuList, MenuItem,
  type MenuProps, type MenuButtonProps, type MenuListProps, type MenuItemProps,
}
```

- [ ] **Step 4: 更新 index.ts**

末尾**新增**：

```ts
export {
  Menu, MenuButton, MenuList, MenuItem,
  type MenuProps, type MenuButtonProps, type MenuListProps, type MenuItemProps,
} from './components/menu'
```

- [ ] **Step 5: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook pnpm-lock.yaml 2>/dev/null
git commit -m "feat(ui): add Menu, MenuButton, MenuList, MenuItem"
```

---

## Task 3: Collapse

**Files:**
- Create: `apps/storybook/stories/collapse.stories.tsx`
- Create: `packages/ui/src/components/collapse.tsx`
- Modify: `packages/ui/src/index.ts`

**設計：** Chakra 的 Collapse 是 `<Collapse in={isOpen}>` 包覆內容，with smooth height animation。Radix Collapsible 也有相同行為但 API 不同（Root + Content）。我們做一個簡化版：`<Collapse in>` 直接控制顯示。動畫用 Tailwind 的 `data-[state]` 屬性 + transition。

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Button, Collapse } from '@urfit/ui'
import { useState } from 'react'

const meta: Meta = { title: 'Components/Collapse' }
export default meta

export const Default = () => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
      <Collapse in={open}>
        <div style={{ padding: 16, marginTop: 8, background: '#EDF2F7', borderRadius: 4 }}>
          Hidden content revealed!
        </div>
      </Collapse>
    </div>
  )
}
```

- [ ] **Step 2: 用 shadcn CLI 新增 collapsible**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add collapsible --yes
pnpm add @radix-ui/react-collapsible
```

- [ ] **Step 3: 刪除 shadcn 檔，建立 collapse.tsx**

```bash
rm -f /Users/eddy/urfit/urfit-ui/packages/ui/src/components/collapsible.tsx
```

建立 `packages/ui/src/components/collapse.tsx`：

```tsx
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean
  animateOpacity?: boolean
}

const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  ({ className, in: isOpen = false, animateOpacity = true, children, ...props }, ref) => (
    <CollapsiblePrimitive.Root open={isOpen}>
      <CollapsiblePrimitive.Content
        ref={ref}
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up',
          animateOpacity && 'data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity',
          className,
        )}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  ),
)
Collapse.displayName = 'Collapse'

export { Collapse, type CollapseProps }
```

**注意：** `animate-collapsible-down` 與 `animate-collapsible-up` 是 Tailwind v4 內建（如果沒有的話需要在 `globals.css` 加 `@keyframes`）。Radix Collapsible 會自動暴露 `--radix-collapsible-content-height` CSS 變數，動畫會用到。若 build 後動畫不對，加進 `globals.css` 末尾：

```css
@keyframes collapsible-down {
  from { height: 0 }
  to { height: var(--radix-collapsible-content-height) }
}
@keyframes collapsible-up {
  from { height: var(--radix-collapsible-content-height) }
  to { height: 0 }
}
.animate-collapsible-down { animation: collapsible-down 0.2s ease-out }
.animate-collapsible-up { animation: collapsible-up 0.2s ease-out }
```

- [ ] **Step 4: 更新 index.ts**

末尾**新增**：

```ts
export { Collapse, type CollapseProps } from './components/collapse'
```

- [ ] **Step 5: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook pnpm-lock.yaml 2>/dev/null
git commit -m "feat(ui): add Collapse"
```

---

## Task 4: Table + Thead + Tbody + Tr + Th + Td

**Files:**
- Create: `apps/storybook/stories/table.stories.tsx`
- Create: `packages/ui/src/components/table.tsx`（shadcn add 後改寫）
- Modify: `packages/ui/src/index.ts`

**設計：** Table 元件全部是純樣式 wrapper（沒有 Radix）。Chakra v1 的 variants（simple、striped、unstyled）支援 — 我們只實作 simple 即可。

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Table, Thead, Tbody, Tr, Th, Td } from '@urfit/ui'

const meta: Meta = { title: 'Components/Table' }
export default meta

export const Default = () => (
  <Table>
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th>Age</Th>
        <Th isNumeric>Score</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>Alice</Td>
        <Td>25</Td>
        <Td isNumeric>92.5</Td>
      </Tr>
      <Tr>
        <Td>Bob</Td>
        <Td>30</Td>
        <Td isNumeric>87.3</Td>
      </Tr>
      <Tr>
        <Td>Carol</Td>
        <Td>28</Td>
        <Td isNumeric>95.1</Td>
      </Tr>
    </Tbody>
  </Table>
)

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <Table key={size} size={size}>
        <Thead>
          <Tr>
            <Th>Size: {size}</Th>
            <Th>Col 2</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Row 1</Td>
            <Td>data</Td>
          </Tr>
        </Tbody>
      </Table>
    ))}
  </div>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 table**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add table --yes
```

shadcn 的 table 元件只是樣式 wrapper（沒有 Radix）。

- [ ] **Step 3: 完整覆寫 table.tsx**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface TableContextValue {
  size: 'sm' | 'md' | 'lg'
}

const TableContext = React.createContext<TableContextValue>({ size: 'md' })

const tableSizeMap = {
  sm: { cellPadding: 'px-2 py-2 text-xs' },
  md: { cellPadding: 'px-4 py-3 text-sm' },
  lg: { cellPadding: 'px-6 py-4 text-md' },
} as const

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  size?: 'sm' | 'md' | 'lg'
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <TableContext.Provider value={{ size }}>
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom', className)}
          {...props}
        />
      </div>
    </TableContext.Provider>
  ),
)
Table.displayName = 'Table'

interface TheadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const Thead = React.forwardRef<HTMLTableSectionElement, TheadProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('border-b border-[--border]', className)} {...props} />
  ),
)
Thead.displayName = 'Thead'

interface TbodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const Tbody = React.forwardRef<HTMLTableSectionElement, TbodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
)
Tbody.displayName = 'Tbody'

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const Tr = React.forwardRef<HTMLTableRowElement, TrProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b border-[--border] transition-colors hover:bg-[--muted]', className)}
      {...props}
    />
  ),
)
Tr.displayName = 'Tr'

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  isNumeric?: boolean
}

const Th = React.forwardRef<HTMLTableCellElement, ThProps>(
  ({ className, isNumeric, ...props }, ref) => {
    const { size } = React.useContext(TableContext)
    return (
      <th
        ref={ref}
        className={cn(
          tableSizeMap[size].cellPadding,
          'text-left align-middle font-semibold text-[--muted-foreground] uppercase tracking-wider text-xs',
          isNumeric && 'text-right',
          className,
        )}
        {...props}
      />
    )
  },
)
Th.displayName = 'Th'

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isNumeric?: boolean
}

const Td = React.forwardRef<HTMLTableCellElement, TdProps>(
  ({ className, isNumeric, ...props }, ref) => {
    const { size } = React.useContext(TableContext)
    return (
      <td
        ref={ref}
        className={cn(
          tableSizeMap[size].cellPadding,
          'align-middle',
          isNumeric && 'text-right tabular-nums',
          className,
        )}
        {...props}
      />
    )
  },
)
Td.displayName = 'Td'

export {
  Table, Thead, Tbody, Tr, Th, Td,
  type TableProps, type TheadProps, type TbodyProps, type TrProps, type ThProps, type TdProps,
}
```

- [ ] **Step 4: 更新 index.ts**

末尾**新增**：

```ts
export {
  Table, Thead, Tbody, Tr, Th, Td,
  type TableProps, type TheadProps, type TbodyProps, type TrProps, type ThProps, type TdProps,
} from './components/table'
```

- [ ] **Step 5: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook pnpm-lock.yaml 2>/dev/null
git commit -m "feat(ui): add Table, Thead, Tbody, Tr, Th, Td"
```

---

## Task 5: useDisclosure hook

**Files:**
- Create: `packages/ui/src/hooks/use-disclosure.ts`
- Modify: `packages/ui/src/index.ts`

（無 Storybook story — hook 不需要視覺呈現）

- [ ] **Step 1: 建立 hooks 目錄**

```bash
mkdir -p /Users/eddy/urfit/urfit-ui/packages/ui/src/hooks
```

- [ ] **Step 2: 建立 use-disclosure.ts**

```ts
import * as React from 'react'

interface UseDisclosureOptions {
  defaultIsOpen?: boolean
  isOpen?: boolean
  onClose?: () => void
  onOpen?: () => void
}

interface UseDisclosureReturn {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
  getButtonProps: () => { 'aria-expanded': boolean; onClick: () => void }
  getDisclosureProps: () => { hidden: boolean }
}

function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const { defaultIsOpen = false, isOpen: controlledIsOpen, onClose: onCloseProp, onOpen: onOpenProp } = options
  const [internalIsOpen, setInternalIsOpen] = React.useState(defaultIsOpen)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const onOpen = React.useCallback(() => {
    if (!isControlled) setInternalIsOpen(true)
    onOpenProp?.()
  }, [isControlled, onOpenProp])

  const onClose = React.useCallback(() => {
    if (!isControlled) setInternalIsOpen(false)
    onCloseProp?.()
  }, [isControlled, onCloseProp])

  const onToggle = React.useCallback(() => {
    if (isOpen) onClose()
    else onOpen()
  }, [isOpen, onOpen, onClose])

  const getButtonProps = React.useCallback(
    () => ({ 'aria-expanded': isOpen, onClick: onToggle }),
    [isOpen, onToggle],
  )

  const getDisclosureProps = React.useCallback(
    () => ({ hidden: !isOpen }),
    [isOpen],
  )

  return { isOpen, onOpen, onClose, onToggle, getButtonProps, getDisclosureProps }
}

export { useDisclosure, type UseDisclosureOptions, type UseDisclosureReturn }
```

- [ ] **Step 3: 更新 index.ts**

末尾**新增**：

```ts
export { useDisclosure, type UseDisclosureOptions, type UseDisclosureReturn } from './hooks/use-disclosure'
```

- [ ] **Step 4: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add useDisclosure hook"
```

---

## Task 6: Progress

**Files:**
- Create: `apps/storybook/stories/progress.stories.tsx`
- Create: `packages/ui/src/components/progress.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Progress } from '@urfit/ui'

const meta: Meta = { title: 'Components/Progress' }
export default meta

export const Default = () => <Progress value={60} />

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
    <Progress size="xs" value={20} />
    <Progress size="sm" value={40} />
    <Progress size="md" value={60} />
    <Progress size="lg" value={80} />
  </div>
)

export const Indeterminate = () => <Progress isIndeterminate />
```

- [ ] **Step 2: 用 shadcn CLI 新增 progress**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add progress --yes
pnpm add @radix-ui/react-progress
```

- [ ] **Step 3: 完整覆寫 progress.tsx**

```tsx
import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-[--muted]',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'value'>,
    VariantProps<typeof progressVariants> {
  value?: number
  max?: number
  isIndeterminate?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, size, value = 0, max = 100, isIndeterminate, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={isIndeterminate ? null : value}
    max={max}
    className={cn(progressVariants({ size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 bg-[--primary] transition-all',
        isIndeterminate && 'animate-pulse',
      )}
      style={{ transform: isIndeterminate ? undefined : `translateX(-${100 - (value / max) * 100}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'

export { Progress, type ProgressProps }
```

- [ ] **Step 4: 更新 index.ts**

```ts
export { Progress, type ProgressProps } from './components/progress'
```

- [ ] **Step 5: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 6: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook pnpm-lock.yaml 2>/dev/null
git commit -m "feat(ui): add Progress"
```

---

## Task 7: CircularProgress + CircularProgressLabel

**Files:**
- Create: `apps/storybook/stories/circular-progress.stories.tsx`
- Create: `packages/ui/src/components/circular-progress.tsx`
- Modify: `packages/ui/src/index.ts`

**設計：** 純 SVG 元件，無 Radix。`<circle>` 配合 `stroke-dasharray` + `stroke-dashoffset` 做進度視覺。`<CircularProgressLabel>` 放在中間。

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { CircularProgress, CircularProgressLabel } from '@urfit/ui'

const meta: Meta = { title: 'Components/CircularProgress' }
export default meta

export const Default = () => <CircularProgress value={60} />

export const WithLabel = () => (
  <CircularProgress value={75}>
    <CircularProgressLabel>75%</CircularProgressLabel>
  </CircularProgress>
)

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <CircularProgress size="40px" value={25} />
    <CircularProgress size="60px" value={50} />
    <CircularProgress size="80px" value={75} />
    <CircularProgress size="100px" value={100} />
  </div>
)

export const Indeterminate = () => <CircularProgress isIndeterminate />
```

- [ ] **Step 2: 建立 circular-progress.tsx**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  min?: number
  size?: string | number
  thickness?: string | number
  color?: string
  trackColor?: string
  isIndeterminate?: boolean
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      max = 100,
      min = 0,
      size = '48px',
      thickness = '10px',
      color = 'var(--primary)',
      trackColor = '#EDF2F7',
      isIndeterminate = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const percent = isIndeterminate ? 25 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
    const sizeValue = typeof size === 'number' ? `${size}px` : size
    const thicknessValue = typeof thickness === 'number' ? `${thickness}px` : thickness

    const radius = 50 - parseFloat(thicknessValue) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : value}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: sizeValue, height: sizeValue }}
        {...props}
      >
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke={trackColor} strokeWidth={thicknessValue} />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thicknessValue}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={
              isIndeterminate
                ? { animation: 'urfit-circ-spin 1s linear infinite', transformOrigin: '50% 50%' }
                : { transition: 'stroke-dashoffset 0.3s' }
            }
          />
          <style>{`
            @keyframes urfit-circ-spin {
              from { transform: rotate(0deg) }
              to { transform: rotate(360deg) }
            }
          `}</style>
        </svg>
        {children && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: '0.875em' }}>
            {children}
          </div>
        )}
      </div>
    )
  },
)
CircularProgress.displayName = 'CircularProgress'

interface CircularProgressLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const CircularProgressLabel = React.forwardRef<HTMLDivElement, CircularProgressLabelProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('font-semibold', className)} {...props} />
  ),
)
CircularProgressLabel.displayName = 'CircularProgressLabel'

export {
  CircularProgress,
  CircularProgressLabel,
  type CircularProgressProps,
  type CircularProgressLabelProps,
}
```

- [ ] **Step 3: 更新 index.ts**

末尾**新增**：

```ts
export {
  CircularProgress, CircularProgressLabel,
  type CircularProgressProps, type CircularProgressLabelProps,
} from './components/circular-progress'
```

- [ ] **Step 4: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 5: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add CircularProgress and CircularProgressLabel"
```

---

## Task 8: 最終 Build 驗證

- [ ] **Step 1: 完整 build packages/ui**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm build
ls -lh dist/
```

Expected: `dist/index.js`、`dist/index.css`、`dist/index.d.ts` 都存在，size 比 Phase 2 大。

- [ ] **Step 2: 確認 index.ts 完整匯出**

`packages/ui/src/index.ts` 末尾應包含 Phase 3 所有 export（順序不重要）：

```ts
// Phase 3
export {
  Tabs, TabList, Tab, TabPanels, TabPanel,
  type TabsProps, type TabListProps, type TabProps, type TabPanelsProps, type TabPanelProps,
} from './components/tabs'
export {
  Menu, MenuButton, MenuList, MenuItem,
  type MenuProps, type MenuButtonProps, type MenuListProps, type MenuItemProps,
} from './components/menu'
export { Collapse, type CollapseProps } from './components/collapse'
export {
  Table, Thead, Tbody, Tr, Th, Td,
  type TableProps, type TheadProps, type TbodyProps, type TrProps, type ThProps, type TdProps,
} from './components/table'
export { useDisclosure, type UseDisclosureOptions, type UseDisclosureReturn } from './hooks/use-disclosure'
export { Progress, type ProgressProps } from './components/progress'
export {
  CircularProgress, CircularProgressLabel,
  type CircularProgressProps, type CircularProgressLabelProps,
} from './components/circular-progress'
```

- [ ] **Step 3: Storybook 完整 build**

```bash
cd /Users/eddy/urfit/urfit-ui/apps/storybook
pnpm build
rm -rf storybook-static
```

- [ ] **Step 4: Final commit（若有整理）**

```bash
cd /Users/eddy/urfit/urfit-ui
git status
# 若有未 commit 修改：
git add packages/ui apps/storybook
git commit -m "feat(ui): Phase 3 complete - composite components" 2>/dev/null || echo "no changes"
```

---

## 完成後的狀態

Phase 3 完成後，`@urfit/ui` 新增：
- **Tabs** + **TabList** + **Tab** + **TabPanels** + **TabPanel**
- **Menu** + **MenuButton** + **MenuList** + **MenuItem**
- **Collapse**
- **Table** + **Thead** + **Tbody** + **Tr** + **Th** + **Td**（含 size variant）
- **useDisclosure** hook
- **Progress**（含 size、indeterminate）
- **CircularProgress** + **CircularProgressLabel**（SVG）

加上 Phase 1 + 2，總計約 40+ 個元件，涵蓋 lodestar-app 約 **97%** 的 Chakra 使用次數。

**下一步**：Phase 4 收尾（Modal、Accordion、Tag、Badge、Link、Image、List、CloseButton），完成後可從 lodestar-app 移除 @chakra-ui 依賴。
