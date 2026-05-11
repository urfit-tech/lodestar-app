# urfit-ui Phase 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 `@urfit/ui` 新增 Phase 4 收尾元件（Modal、Accordion、Tag、Badge、Link、Image、List、CloseButton）。完成後 lodestar-app 可完全移除 `@chakra-ui/*` 依賴。

**Architecture:** 沿用 Phase 1+2+3 已建立的 urfit-ui monorepo。Modal、Accordion 用 Radix Dialog/Accordion；其他都是純樣式 wrapper。Modal 採用 Chakra v1 的 compound 結構（ModalOverlay + ModalContent 在 Modal 內部分離），透過 children 接收子元件。

**Tech Stack:** 同 Phase 1-3。新增 Radix 依賴：`@radix-ui/react-dialog`、`@radix-ui/react-accordion`。

---

## 檔案結構新增

```
packages/ui/src/components/
├── modal.tsx              # Modal + ModalOverlay + ModalContent + ModalHeader + ModalBody + ModalFooter + ModalCloseButton
├── accordion.tsx          # Accordion + AccordionItem + AccordionButton + AccordionPanel + AccordionIcon
├── tag.tsx                # Tag (with variants)
├── badge.tsx              # Badge
├── link.tsx               # Link (anchor wrapper)
├── image.tsx              # Image (native img wrapper)
├── list.tsx               # List + OrderedList + UnorderedList + ListItem
└── close-button.tsx       # CloseButton (X icon)

apps/storybook/stories/
├── modal.stories.tsx
├── accordion.stories.tsx
├── tag.stories.tsx
├── badge.stories.tsx
├── link.stories.tsx
├── image.stories.tsx
├── list.stories.tsx
└── close-button.stories.tsx
```

---

## Task 1: Modal family

**Files:**
- Create: `apps/storybook/stories/modal.stories.tsx`
- Create: `packages/ui/src/components/modal.tsx`（shadcn add dialog 後改寫）
- Modify: `packages/ui/src/index.ts`

**設計：** Chakra v1 的 Modal 用 compound：`<Modal>` 是根，內含 `<ModalOverlay>` + `<ModalContent>`（內含 Header/Body/Footer/CloseButton）。Radix Dialog 結構不同（Root + Trigger + Portal + Overlay + Content），我們用 Radix Dialog 作底層，但對外維持 Chakra 結構。

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import {
  Button,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  useDisclosure,
} from '@urfit/ui'

const meta: Meta = { title: 'Components/Modal' }
export default meta

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Modal body content goes here.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const WithLongContent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open Long Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Long Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} style={{ marginBottom: 8 }}>
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
```

- [ ] **Step 2: 用 shadcn CLI 新增 dialog**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add dialog --yes
pnpm add @radix-ui/react-dialog
```

- [ ] **Step 3: 刪除 shadcn 檔，建立 modal.tsx**

```bash
rm -f /Users/eddy/urfit/urfit-ui/packages/ui/src/components/dialog.tsx
```

建立 `packages/ui/src/components/modal.tsx`：

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen?: boolean
  onClose?: () => void
  children: React.ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      {children}
    </DialogPrimitive.Root>
  )
}

interface ModalOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
))
ModalOverlay.displayName = 'ModalOverlay'

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg rounded-md',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
ModalContent.displayName = 'ModalContent'

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cn('text-lg font-semibold text-[--foreground]', className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  ),
)
ModalHeader.displayName = 'ModalHeader'

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-[--foreground] py-2', className)} {...props} />
  ),
)
ModalBody.displayName = 'ModalBody'

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex justify-end gap-2 pt-2', className)}
      {...props}
    />
  ),
)
ModalFooter.displayName = 'ModalFooter'

interface ModalCloseButtonProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

const ModalCloseButton = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  ModalCloseButtonProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    aria-label="Close"
    className={cn(
      'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-[--muted-foreground] transition-colors hover:bg-[--muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]',
      className,
    )}
    {...props}
  >
    <X size={16} />
  </DialogPrimitive.Close>
))
ModalCloseButton.displayName = 'ModalCloseButton'

export {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  type ModalProps, type ModalOverlayProps, type ModalContentProps,
  type ModalHeaderProps, type ModalBodyProps, type ModalFooterProps, type ModalCloseButtonProps,
}
```

- [ ] **Step 4: 更新 index.ts**

末尾**新增**：

```ts
export {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  type ModalProps, type ModalOverlayProps, type ModalContentProps,
  type ModalHeaderProps, type ModalBodyProps, type ModalFooterProps, type ModalCloseButtonProps,
} from './components/modal'
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
git commit -m "feat(ui): add Modal family"
```

---

## Task 2: Accordion family

**Files:**
- Create: `apps/storybook/stories/accordion.stories.tsx`
- Create: `packages/ui/src/components/accordion.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@urfit/ui'

const meta: Meta = { title: 'Components/Accordion' }
export default meta

export const Default = () => (
  <Accordion>
    <AccordionItem value="one">
      <AccordionButton>
        Section 1
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>Content for section 1</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="two">
      <AccordionButton>
        Section 2
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>Content for section 2</AccordionPanel>
    </AccordionItem>
  </Accordion>
)

export const AllowMultiple = () => (
  <Accordion allowMultiple>
    <AccordionItem value="one">
      <AccordionButton>
        First (try opening this and another)
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>First content</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="two">
      <AccordionButton>
        Second
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>Second content</AccordionPanel>
    </AccordionItem>
  </Accordion>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 accordion**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add accordion --yes
pnpm add @radix-ui/react-accordion
```

- [ ] **Step 3: 完整覆寫 accordion.tsx**

```tsx
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface AccordionProps {
  allowMultiple?: boolean
  defaultIndex?: string | string[]
  className?: string
  children?: React.ReactNode
}

function Accordion({ allowMultiple, defaultIndex, className, children }: AccordionProps) {
  if (allowMultiple) {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={Array.isArray(defaultIndex) ? defaultIndex : defaultIndex ? [defaultIndex] : undefined}
        className={cn('w-full', className)}
      >
        {children}
      </AccordionPrimitive.Root>
    )
  }
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={Array.isArray(defaultIndex) ? defaultIndex[0] : defaultIndex}
      className={cn('w-full', className)}
    >
      {children}
    </AccordionPrimitive.Root>
  )
}

interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-[--border]', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

interface AccordionButtonProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {}

const AccordionButton = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionButtonProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-3 px-2 text-sm font-medium text-left transition-all hover:bg-[--muted] [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionButton.displayName = 'AccordionButton'

interface AccordionPanelProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

const AccordionPanel = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionPanelProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm',
      'data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up',
      className,
    )}
    {...props}
  >
    <div className="py-3 px-2">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionPanel.displayName = 'AccordionPanel'

interface AccordionIconProps extends React.SVGAttributes<SVGSVGElement> {}

function AccordionIcon({ className, ...props }: AccordionIconProps) {
  return (
    <ChevronDown
      className={cn('h-4 w-4 shrink-0 text-[--muted-foreground] transition-transform duration-200', className)}
      {...props}
    />
  )
}

export {
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  type AccordionProps, type AccordionItemProps, type AccordionButtonProps, type AccordionPanelProps,
}
```

**注意：** Radix Accordion 的 `Content` 使用 `--radix-accordion-content-height` 變數，而我們在 Phase 3 為 Collapsible 寫的 `animate-collapsible-down` 用的是 `--radix-collapsible-content-height`。為相容，需要在 `globals.css` **新增** accordion 專用 keyframes，或修改既有 keyframes。

修改 `packages/ui/src/styles/globals.css`，在末尾**新增**：

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

.animate-collapsible-down,
[data-state=open].data-\[state\=open\]\:animate-collapsible-down {
  /* Both collapsible and accordion will fall through to their primitive's CSS variable */
}
```

**簡化方案：** 把 accordion.tsx 內的 `data-[state=open]:animate-collapsible-down` 改成 `data-[state=open]:animate-accordion-down`，並加對應的 keyframes：

```css
.animate-accordion-down { animation: accordion-down 0.2s ease-out; }
.animate-accordion-up { animation: accordion-up 0.2s ease-out; }
```

**最終實作：** 在 accordion.tsx 改用 `animate-accordion-down`/`animate-accordion-up`，在 globals.css 加對應 keyframes + utility classes：

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

.animate-accordion-down {
  animation: accordion-down 0.2s ease-out;
}

.animate-accordion-up {
  animation: accordion-up 0.2s ease-out;
}
```

並修改 accordion.tsx 的 AccordionPanel className：

```tsx
'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
```

- [ ] **Step 4: 更新 index.ts**

末尾**新增**：

```ts
export {
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  type AccordionProps, type AccordionItemProps, type AccordionButtonProps, type AccordionPanelProps,
} from './components/accordion'
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
git commit -m "feat(ui): add Accordion family"
```

---

## Task 3: Tag + Badge

**Files:**
- Create: `apps/storybook/stories/tag.stories.tsx`
- Create: `apps/storybook/stories/badge.stories.tsx`
- Create: `packages/ui/src/components/tag.tsx`
- Create: `packages/ui/src/components/badge.tsx`（shadcn add 後改寫）
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 寫兩個 stories**

`apps/storybook/stories/tag.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Tag } from '@urfit/ui'

const meta: Meta = { title: 'Components/Tag' }
export default meta

export const Default = () => <Tag>Default</Tag>

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <Tag size="sm">Small</Tag>
    <Tag size="md">Medium</Tag>
    <Tag size="lg">Large</Tag>
  </div>
)

export const ColorSchemes = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Tag colorScheme="gray">Gray</Tag>
    <Tag colorScheme="blue">Blue</Tag>
    <Tag colorScheme="green">Green</Tag>
    <Tag colorScheme="red">Red</Tag>
    <Tag colorScheme="yellow">Yellow</Tag>
  </div>
)
```

`apps/storybook/stories/badge.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Badge } from '@urfit/ui'

const meta: Meta = { title: 'Components/Badge' }
export default meta

export const Default = () => <Badge>Default</Badge>

export const Variants = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Badge variant="solid">Solid</Badge>
    <Badge variant="subtle">Subtle</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
)

export const ColorSchemes = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Badge colorScheme="gray">Gray</Badge>
    <Badge colorScheme="blue">Blue</Badge>
    <Badge colorScheme="green">Green</Badge>
    <Badge colorScheme="red">Red</Badge>
  </div>
)
```

- [ ] **Step 2: 建立 tag.tsx（手寫，無 shadcn）**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const tagVariants = cva(
  'inline-flex items-center rounded-md font-medium',
  {
    variants: {
      size: {
        sm: 'h-5 px-1.5 text-xs',
        md: 'h-6 px-2 text-xs',
        lg: 'h-8 px-3 text-sm',
      },
      colorScheme: {
        gray: 'bg-[#EDF2F7] text-[#2D3748]',
        blue: 'bg-[#bee3f8] text-[#1A365D]',
        green: 'bg-[#C6F6D5] text-[#1C4532]',
        red: 'bg-[#FED7D7] text-[#742A2A]',
        yellow: 'bg-[#FEFCBF] text-[#5F370E]',
      },
    },
    defaultVariants: { size: 'md', colorScheme: 'gray' },
  },
)

interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, size, colorScheme, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagVariants({ size, colorScheme }), className)}
      {...props}
    />
  ),
)
Tag.displayName = 'Tag'

export { Tag, tagVariants, type TagProps }
```

- [ ] **Step 3: 用 shadcn CLI 新增 badge**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add badge --yes
```

- [ ] **Step 4: 完整覆寫 badge.tsx**

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        solid: '',
        subtle: '',
        outline: 'bg-transparent border',
      },
      colorScheme: {
        gray: '',
        blue: '',
        green: '',
        red: '',
      },
    },
    compoundVariants: [
      { variant: 'solid', colorScheme: 'gray', class: 'bg-[#4A5568] text-white' },
      { variant: 'solid', colorScheme: 'blue', class: 'bg-[#3182ce] text-white' },
      { variant: 'solid', colorScheme: 'green', class: 'bg-[#38A169] text-white' },
      { variant: 'solid', colorScheme: 'red', class: 'bg-[#E53E3E] text-white' },
      { variant: 'subtle', colorScheme: 'gray', class: 'bg-[#EDF2F7] text-[#2D3748]' },
      { variant: 'subtle', colorScheme: 'blue', class: 'bg-[#bee3f8] text-[#1A365D]' },
      { variant: 'subtle', colorScheme: 'green', class: 'bg-[#C6F6D5] text-[#1C4532]' },
      { variant: 'subtle', colorScheme: 'red', class: 'bg-[#FED7D7] text-[#742A2A]' },
      { variant: 'outline', colorScheme: 'gray', class: 'border-[#4A5568] text-[#4A5568]' },
      { variant: 'outline', colorScheme: 'blue', class: 'border-[#3182ce] text-[#3182ce]' },
      { variant: 'outline', colorScheme: 'green', class: 'border-[#38A169] text-[#38A169]' },
      { variant: 'outline', colorScheme: 'red', class: 'border-[#E53E3E] text-[#E53E3E]' },
    ],
    defaultVariants: { variant: 'subtle', colorScheme: 'gray' },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, colorScheme, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, colorScheme }), className)}
      {...props}
    />
  ),
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants, type BadgeProps }
```

- [ ] **Step 5: 更新 index.ts**

末尾**新增**：

```ts
export { Tag, tagVariants, type TagProps } from './components/tag'
export { Badge, badgeVariants, type BadgeProps } from './components/badge'
```

- [ ] **Step 6: Build 並驗證**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static
```

- [ ] **Step 7: Commit**

```bash
cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add Tag and Badge"
```

---

## Task 4: Link

**Files:**
- Create: `apps/storybook/stories/link.stories.tsx`
- Create: `packages/ui/src/components/link.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Link } from '@urfit/ui'

const meta: Meta = { title: 'Components/Link' }
export default meta

export const Default = () => <Link href="https://example.com">External link</Link>

export const External = () => <Link href="https://example.com" isExternal>Opens new tab</Link>

export const AsButton = () => <Link onClick={() => alert('clicked')}>Click me (button style)</Link>
```

- [ ] **Step 2: 建立 link.tsx**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isExternal?: boolean
  as?: React.ElementType
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, isExternal, as: Tag = 'a', children, ...props }, ref) => {
    const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <Tag
        ref={ref}
        className={cn(
          'text-[--primary] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:rounded-sm',
          className,
        )}
        {...externalProps}
        {...props}
      >
        {children}
      </Tag>
    )
  },
)
Link.displayName = 'Link'

export { Link, type LinkProps }
```

- [ ] **Step 3: 更新 index.ts**

末尾**新增**：

```ts
export { Link, type LinkProps } from './components/link'
```

- [ ] **Step 4: Build + Commit**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static

cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add Link"
```

---

## Task 5: Image

**Files:**
- Create: `apps/storybook/stories/image.stories.tsx`
- Create: `packages/ui/src/components/image.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Image } from '@urfit/ui'

const meta: Meta = { title: 'Components/Image' }
export default meta

export const Default = () => (
  <Image
    src="https://placehold.co/200x150"
    alt="Placeholder"
    boxSize="200px"
  />
)

export const Rounded = () => (
  <Image
    src="https://placehold.co/100x100"
    alt="Avatar"
    boxSize="100px"
    borderRadius="full"
  />
)

export const WithFallback = () => (
  <Image
    src="https://nonexistent.invalid/missing.jpg"
    alt="Missing"
    fallbackSrc="https://placehold.co/200x150?text=Fallback"
    boxSize="200px"
  />
)
```

- [ ] **Step 2: 建立 image.tsx**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'crossOrigin'> {
  boxSize?: string | number
  borderRadius?: string
  fallbackSrc?: string
  objectFit?: React.CSSProperties['objectFit']
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin']
}

const radiusMap: Record<string, string> = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, boxSize, borderRadius, fallbackSrc, objectFit, src, style, onError, ...props }, ref) => {
    const [currentSrc, setCurrentSrc] = React.useState(src)
    const [hasErrored, setHasErrored] = React.useState(false)

    React.useEffect(() => {
      setCurrentSrc(src)
      setHasErrored(false)
    }, [src])

    const sizeValue = typeof boxSize === 'number' ? `${boxSize}px` : boxSize
    const radiusValue = borderRadius ? (radiusMap[borderRadius] ?? borderRadius) : undefined

    return (
      <img
        ref={ref}
        src={currentSrc}
        className={cn('inline-block max-w-full', className)}
        style={{
          width: sizeValue,
          height: sizeValue,
          borderRadius: radiusValue,
          objectFit,
          ...style,
        }}
        onError={(e) => {
          if (fallbackSrc && !hasErrored) {
            setHasErrored(true)
            setCurrentSrc(fallbackSrc)
          }
          onError?.(e)
        }}
        {...props}
      />
    )
  },
)
Image.displayName = 'Image'

export { Image, type ImageProps }
```

- [ ] **Step 3: 更新 index.ts**

末尾**新增**：

```ts
export { Image, type ImageProps } from './components/image'
```

- [ ] **Step 4: Build + Commit**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static

cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add Image"
```

---

## Task 6: List family

**Files:**
- Create: `apps/storybook/stories/list.stories.tsx`
- Create: `packages/ui/src/components/list.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { List, OrderedList, UnorderedList, ListItem } from '@urfit/ui'

const meta: Meta = { title: 'Components/List' }
export default meta

export const Unordered = () => (
  <UnorderedList>
    <ListItem>Apple</ListItem>
    <ListItem>Orange</ListItem>
    <ListItem>Grape</ListItem>
  </UnorderedList>
)

export const Ordered = () => (
  <OrderedList>
    <ListItem>First step</ListItem>
    <ListItem>Second step</ListItem>
    <ListItem>Third step</ListItem>
  </OrderedList>
)

export const Plain = () => (
  <List spacing={2}>
    <ListItem>Item without bullet</ListItem>
    <ListItem>Another item</ListItem>
  </List>
)
```

- [ ] **Step 2: 建立 list.tsx**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  spacing?: number
  as?: React.ElementType
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, spacing, as: Tag = 'ul', style, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn('list-none', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing !== undefined ? `${spacing * 0.25}rem` : undefined,
        ...style,
      }}
      {...props}
    />
  ),
)
List.displayName = 'List'

interface OrderedListProps extends Omit<ListProps, 'as'> {}

const OrderedList = React.forwardRef<HTMLUListElement, OrderedListProps>(
  ({ className, spacing, style, ...props }, ref) => (
    <ol
      ref={ref as React.Ref<HTMLOListElement>}
      className={cn('list-decimal pl-6', className)}
      style={{
        gap: spacing !== undefined ? `${spacing * 0.25}rem` : undefined,
        display: spacing !== undefined ? 'flex' : undefined,
        flexDirection: spacing !== undefined ? 'column' : undefined,
        ...style,
      }}
      {...(props as React.HTMLAttributes<HTMLOListElement>)}
    />
  ),
)
OrderedList.displayName = 'OrderedList'

interface UnorderedListProps extends Omit<ListProps, 'as'> {}

const UnorderedList = React.forwardRef<HTMLUListElement, UnorderedListProps>(
  ({ className, spacing, style, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('list-disc pl-6', className)}
      style={{
        gap: spacing !== undefined ? `${spacing * 0.25}rem` : undefined,
        display: spacing !== undefined ? 'flex' : undefined,
        flexDirection: spacing !== undefined ? 'column' : undefined,
        ...style,
      }}
      {...props}
    />
  ),
)
UnorderedList.displayName = 'UnorderedList'

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={className} {...props} />
  ),
)
ListItem.displayName = 'ListItem'

export {
  List, OrderedList, UnorderedList, ListItem,
  type ListProps, type OrderedListProps, type UnorderedListProps, type ListItemProps,
}
```

- [ ] **Step 3: 更新 index.ts**

末尾**新增**：

```ts
export {
  List, OrderedList, UnorderedList, ListItem,
  type ListProps, type OrderedListProps, type UnorderedListProps, type ListItemProps,
} from './components/list'
```

- [ ] **Step 4: Build + Commit**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static

cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add List, OrderedList, UnorderedList, ListItem"
```

---

## Task 7: CloseButton

**Files:**
- Create: `apps/storybook/stories/close-button.stories.tsx`
- Create: `packages/ui/src/components/close-button.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { CloseButton } from '@urfit/ui'

const meta: Meta = { title: 'Components/CloseButton' }
export default meta

export const Default = () => <CloseButton onClick={() => alert('close')} />

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <CloseButton size="sm" />
    <CloseButton size="md" />
    <CloseButton size="lg" />
  </div>
)

export const Disabled = () => <CloseButton disabled />
```

- [ ] **Step 2: 建立 close-button.tsx**

```tsx
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { container: 'h-6 w-6', icon: 12 },
  md: { container: 'h-8 w-8', icon: 16 },
  lg: { container: 'h-10 w-10', icon: 20 },
} as const

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Close"
      className={cn(
        'inline-flex items-center justify-center rounded-md text-[--muted-foreground] transition-colors hover:bg-[--muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] disabled:pointer-events-none disabled:opacity-50',
        sizeMap[size].container,
        className,
      )}
      {...props}
    >
      <X size={sizeMap[size].icon} />
    </button>
  ),
)
CloseButton.displayName = 'CloseButton'

export { CloseButton, type CloseButtonProps }
```

- [ ] **Step 3: 更新 index.ts**

末尾**新增**：

```ts
export { CloseButton, type CloseButtonProps } from './components/close-button'
```

- [ ] **Step 4: Build + Commit**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui && pnpm build
cd /Users/eddy/urfit/urfit-ui/apps/storybook && pnpm build
rm -rf /Users/eddy/urfit/urfit-ui/apps/storybook/storybook-static

cd /Users/eddy/urfit/urfit-ui
git add packages/ui apps/storybook
git commit -m "feat(ui): add CloseButton"
```

---

## Task 8: 最終 Build 驗證

- [ ] **Step 1: 完整 build packages/ui**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm build
ls -lh dist/
```

- [ ] **Step 2: 確認 index.ts 完整匯出**

`packages/ui/src/index.ts` 應該匯出所有 Phase 1-4 的元件。

- [ ] **Step 3: Storybook 完整 build**

```bash
cd /Users/eddy/urfit/urfit-ui/apps/storybook
pnpm build
rm -rf storybook-static
```

- [ ] **Step 4: 清理 test-icons.ts（Phase 1 殘留）**

```bash
cd /Users/eddy/urfit/urfit-ui
rm -f packages/ui/test-icons.ts
git status  # 應該乾淨或只剩此檔的刪除
git add -A 2>/dev/null
git commit -m "chore: remove test-icons.ts leftover" 2>/dev/null || echo "no changes"
```

- [ ] **Step 5: 顯示完整 commit log**

```bash
cd /Users/eddy/urfit/urfit-ui
git log --oneline
```

---

## 完成後的狀態

Phase 4 完成後，`@urfit/ui` 新增：
- **Modal** + **ModalOverlay** + **ModalContent** + **ModalHeader** + **ModalBody** + **ModalFooter** + **ModalCloseButton**
- **Accordion** + **AccordionItem** + **AccordionButton** + **AccordionPanel** + **AccordionIcon**
- **Tag**（5 個 colorScheme）
- **Badge**（3 個 variant × 4 個 colorScheme）
- **Link**（含 isExternal）
- **Image**（含 fallbackSrc）
- **List** + **OrderedList** + **UnorderedList** + **ListItem**
- **CloseButton**

加總 Phase 1-4，`@urfit/ui` 涵蓋 **lodestar-app 全部使用過的 Chakra UI 元件**，達成 100% API 覆蓋率。

**下一步**：在 lodestar-app 端執行遷移，逐批把 `from '@chakra-ui/react'` 改成 `from '@urfit/ui'`，全部完成後即可移除 `@chakra-ui/*` 依賴。這個整合工作會在另一個獨立的 plan 處理。
