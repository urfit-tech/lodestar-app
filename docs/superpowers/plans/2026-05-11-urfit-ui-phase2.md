# urfit-ui Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 `@urfit/ui` 新增 Phase 2 表單元件（Input、Textarea、FormControl、Checkbox、Radio、Switch、Select、useToast），維持 Chakra v1 外觀。

**Architecture:** 沿用 Phase 1 已建立的 urfit-ui monorepo（`/Users/eddy/urfit/urfit-ui/`）。所有元件加進 `packages/ui/src/components/`，並透過 `src/index.ts` 匯出。shadcn 元件直接用 `pnpm dlx shadcn@latest add <name>` 帶入（CLI 偵測已在 Phase 1 修復），再改寫成 Chakra v1 樣式。複合元件（如 FormControl、CheckboxGroup）用 React Context 實作 Chakra 的層級 prop 傳遞行為。

**Tech Stack:** 同 Phase 1（pnpm 9、Storybook 10、Vite 8、Tailwind v4、Radix UI、lucide-react 1.x）。新增依賴：`sonner`（toast）、`@radix-ui/react-checkbox`、`@radix-ui/react-radio-group`、`@radix-ui/react-switch`、`@radix-ui/react-select`、`@radix-ui/react-label`（由 shadcn add 自動加入）。

---

## 檔案結構新增

```
packages/ui/src/components/
├── input.tsx              # Input + InputGroup + InputRightElement + InputLeftElement
├── textarea.tsx           # Textarea
├── form-control.tsx       # FormControl + FormLabel + FormErrorMessage + form context
├── checkbox.tsx           # Checkbox + CheckboxGroup
├── radio.tsx              # Radio + RadioGroup + useRadioGroup
├── switch.tsx             # Switch
├── select.tsx             # Select
└── toast.tsx              # Toaster + useToast hook (wraps sonner)

apps/storybook/stories/
├── input.stories.tsx
├── textarea.stories.tsx
├── form-control.stories.tsx
├── checkbox.stories.tsx
├── radio.stories.tsx
├── switch.stories.tsx
├── select.stories.tsx
└── toast.stories.tsx
```

**注意：** apps/storybook 的 `preview.ts` 需要 mount `<Toaster />` 才能讓 useToast 在 Storybook 裡運作（Task 8 處理）。

---

## Task 1: Input + InputGroup + InputRightElement + InputLeftElement

**Files:**
- Create: `apps/storybook/stories/input.stories.tsx`
- Create: `packages/ui/src/components/input.tsx`（shadcn add 後完整覆寫）
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/input.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@urfit/ui'
import { Search, Mail } from 'lucide-react'

const meta: Meta = { title: 'Components/Input' }
export default meta

export const Default = () => <Input placeholder="Enter text" />

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 300 }}>
    <Input size="sm" placeholder="Small (sm)" />
    <Input size="md" placeholder="Medium (md)" />
    <Input size="lg" placeholder="Large (lg)" />
  </div>
)

export const Disabled = () => <Input disabled placeholder="Disabled" />

export const Invalid = () => <Input aria-invalid placeholder="Invalid state" />

export const WithLeftElement = () => (
  <InputGroup>
    <InputLeftElement>
      <Search size={16} />
    </InputLeftElement>
    <Input placeholder="Search..." />
  </InputGroup>
)

export const WithRightElement = () => (
  <InputGroup>
    <Input placeholder="Email" type="email" />
    <InputRightElement>
      <Mail size={16} />
    </InputRightElement>
  </InputGroup>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 input**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add input --yes
```

會建立 `src/components/input.tsx`（扁平結構）。

- [ ] **Step 3: 完整覆寫 input.tsx**

將 `packages/ui/src/components/input.tsx` 內容替換成：

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-[--input] bg-white px-3 text-sm transition-colors placeholder:text-[--muted-foreground] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:border-[--primary] disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-[#E53E3E] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-[#E53E3E]',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10',
        lg: 'h-12 text-md',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('relative w-full', className)} {...props}>
      {children}
    </div>
  ),
)
InputGroup.displayName = 'InputGroup'

const elementStyle = cva(
  'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-[--muted-foreground] pointer-events-none',
  {
    variants: {
      side: {
        left: 'left-3',
        right: 'right-3',
      },
    },
  },
)

interface InputElementProps extends React.HTMLAttributes<HTMLDivElement> {}

const InputLeftElement = React.forwardRef<HTMLDivElement, InputElementProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(elementStyle({ side: 'left' }), className)} {...props} />
  ),
)
InputLeftElement.displayName = 'InputLeftElement'

const InputRightElement = React.forwardRef<HTMLDivElement, InputElementProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(elementStyle({ side: 'right' }), className)} {...props} />
  ),
)
InputRightElement.displayName = 'InputRightElement'

export { Input, InputGroup, InputLeftElement, InputRightElement }
```

**注意：** 當 `InputGroup` 內含 `InputLeftElement`，使用者要自行給 `Input` 加 `pl-10` className；同理右側給 `pr-10`。這是簡化版（Chakra 的 InputGroup 用 context 自動偵測，我們不做）。lodestar-app 遷移時記得手動補。

- [ ] **Step 4: 更新 index.ts**

在 `packages/ui/src/index.ts` 末尾**新增**：

```ts
export { Input, InputGroup, InputLeftElement, InputRightElement, type InputProps } from './components/input'
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
git add .
git commit -m "feat(ui): add Input with InputGroup, InputLeftElement, InputRightElement"
```

---

## Task 2: Textarea

**Files:**
- Create: `apps/storybook/stories/textarea.stories.tsx`
- Create: `packages/ui/src/components/textarea.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/textarea.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Textarea } from '@urfit/ui'

const meta: Meta = { title: 'Components/Textarea' }
export default meta

export const Default = () => <Textarea placeholder="Enter description" />

export const WithRows = () => <Textarea rows={6} placeholder="6 rows" />

export const Disabled = () => <Textarea disabled placeholder="Disabled" />

export const Invalid = () => <Textarea aria-invalid placeholder="Invalid state" />
```

- [ ] **Step 2: 用 shadcn CLI 新增 textarea**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add textarea --yes
```

- [ ] **Step 3: 完整覆寫 textarea.tsx**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-[--input] bg-white px-3 py-2 text-sm transition-colors placeholder:text-[--muted-foreground] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:border-[--primary] disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-[#E53E3E] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-[#E53E3E]',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

- [ ] **Step 4: 更新 index.ts**

```ts
export { Textarea, type TextareaProps } from './components/textarea'
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
git add .
git commit -m "feat(ui): add Textarea"
```

---

## Task 3: FormControl + FormLabel + FormErrorMessage + FormHelperText

**Files:**
- Create: `apps/storybook/stories/form-control.stories.tsx`
- Create: `packages/ui/src/components/form-control.tsx`
- Modify: `packages/ui/src/index.ts`

**設計重點：** Chakra 的 FormControl 用 React Context 把 `isInvalid`、`isRequired`、`isDisabled` 傳遞給子元件。我們用同樣的模式，但只關心三個欄位：
- `isInvalid` → 影響子元件的 aria-invalid 屬性與 error message 顯示
- `isRequired` → 在 label 後加 `*`
- `isDisabled` → 把 disabled 傳給 Input/Textarea/etc

- [ ] **Step 1: 先寫 Story**

建立 `apps/storybook/stories/form-control.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@urfit/ui'

const meta: Meta = { title: 'Components/FormControl' }
export default meta

export const Default = () => (
  <FormControl>
    <FormLabel>Email</FormLabel>
    <Input type="email" placeholder="you@example.com" />
    <FormHelperText>We'll never share your email.</FormHelperText>
  </FormControl>
)

export const Required = () => (
  <FormControl isRequired>
    <FormLabel>Username</FormLabel>
    <Input placeholder="Username" />
  </FormControl>
)

export const Invalid = () => (
  <FormControl isInvalid>
    <FormLabel>Email</FormLabel>
    <Input type="email" value="not-an-email" onChange={() => {}} />
    <FormErrorMessage>Invalid email address.</FormErrorMessage>
  </FormControl>
)

export const Disabled = () => (
  <FormControl isDisabled>
    <FormLabel>Disabled field</FormLabel>
    <Input placeholder="Can't type here" />
  </FormControl>
)
```

- [ ] **Step 2: 建立 form-control.tsx**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface FormControlContextValue {
  isInvalid: boolean
  isRequired: boolean
  isDisabled: boolean
  id?: string
}

const FormControlContext = React.createContext<FormControlContextValue | null>(null)

function useFormControl() {
  return React.useContext(FormControlContext)
}

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  isInvalid?: boolean
  isRequired?: boolean
  isDisabled?: boolean
  id?: string
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, isInvalid = false, isRequired = false, isDisabled = false, id, children, ...props }, ref) => {
    const ctx = React.useMemo(() => ({ isInvalid, isRequired, isDisabled, id }), [isInvalid, isRequired, isDisabled, id])
    return (
      <FormControlContext.Provider value={ctx}>
        <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
          {children}
        </div>
      </FormControlContext.Provider>
    )
  },
)
FormControl.displayName = 'FormControl'

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useFormControl()
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-[--foreground]',
          ctx?.isDisabled && 'opacity-60',
          className,
        )}
        {...props}
      >
        {children}
        {ctx?.isRequired && <span className="ml-1 text-[#E53E3E]">*</span>}
      </label>
    )
  },
)
FormLabel.displayName = 'FormLabel'

interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormErrorMessage = React.forwardRef<HTMLParagraphElement, FormErrorMessageProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useFormControl()
    if (!ctx?.isInvalid) return null
    return (
      <p
        ref={ref}
        className={cn('text-xs text-[#E53E3E]', className)}
        {...props}
      >
        {children}
      </p>
    )
  },
)
FormErrorMessage.displayName = 'FormErrorMessage'

interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormHelperText = React.forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  ({ className, ...props }, ref) => {
    const ctx = useFormControl()
    if (ctx?.isInvalid) return null  // helper text 與 error message 互斥
    return (
      <p
        ref={ref}
        className={cn('text-xs text-[--muted-foreground]', className)}
        {...props}
      />
    )
  },
)
FormHelperText.displayName = 'FormHelperText'

export {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  useFormControl,
  type FormControlProps,
  type FormLabelProps,
  type FormErrorMessageProps,
  type FormHelperTextProps,
}
```

**注意：** 當 `isInvalid` 為 true 時，`FormHelperText` 會回傳 `null`（與 `FormErrorMessage` 互斥），這是 Chakra 的行為。

- [ ] **Step 3: 更新 index.ts**

```ts
export {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  useFormControl,
  type FormControlProps,
  type FormLabelProps,
  type FormErrorMessageProps,
  type FormHelperTextProps,
} from './components/form-control'
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
git add .
git commit -m "feat(ui): add FormControl with FormLabel, FormErrorMessage, FormHelperText"
```

---

## Task 4: Checkbox + CheckboxGroup

**Files:**
- Create: `apps/storybook/stories/checkbox.stories.tsx`
- Create: `packages/ui/src/components/checkbox.tsx`（shadcn add 後改寫）
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Checkbox, CheckboxGroup } from '@urfit/ui'
import { useState } from 'react'

const meta: Meta = { title: 'Components/Checkbox' }
export default meta

export const Default = () => <Checkbox>Subscribe</Checkbox>

export const Checked = () => <Checkbox defaultChecked>Pre-checked</Checkbox>

export const Disabled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Checkbox disabled>Disabled</Checkbox>
    <Checkbox disabled defaultChecked>Disabled checked</Checkbox>
  </div>
)

export const Group = () => {
  const [values, setValues] = useState<string[]>(['apple'])
  return (
    <CheckboxGroup value={values} onChange={setValues}>
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
      <Checkbox value="grape">Grape</Checkbox>
    </CheckboxGroup>
  )
}
```

- [ ] **Step 2: 用 shadcn CLI 新增 checkbox**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add checkbox --yes
```

- [ ] **Step 3: 完整覆寫 checkbox.tsx**

```tsx
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxGroupContextValue {
  value?: string[]
  onChange?: (value: string[]) => void
  isDisabled?: boolean
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null)

interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'value' | 'onCheckedChange'> {
  value?: string
  children?: React.ReactNode
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, children, value, checked, onCheckedChange, disabled, ...props }, ref) => {
  const group = React.useContext(CheckboxGroupContext)
  const isInGroup = group !== null && value !== undefined

  const isChecked = isInGroup ? (group.value ?? []).includes(value) : checked
  const isDisabled = disabled ?? group?.isDisabled

  const handleChange = (next: boolean) => {
    if (isInGroup) {
      const current = group.value ?? []
      const updated = next ? [...current, value!] : current.filter((v) => v !== value)
      group.onChange?.(updated)
    } else {
      onCheckedChange?.(next)
    }
  }

  return (
    <label className={cn('inline-flex items-center gap-2 text-sm', isDisabled && 'opacity-60', className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={isDisabled}
        className="peer h-4 w-4 shrink-0 rounded-sm border border-[--input] bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-[--primary] data-[state=checked]:border-[--primary] data-[state=checked]:text-white"
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="h-3 w-3" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children && <span>{children}</span>}
    </label>
  )
})
Checkbox.displayName = 'Checkbox'

interface CheckboxGroupProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  isDisabled?: boolean
  children: React.ReactNode
  className?: string
}

function CheckboxGroup({
  value,
  defaultValue,
  onChange,
  isDisabled,
  children,
  className,
}: CheckboxGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? [])
  const current = value ?? internal
  const handleChange = (next: string[]) => {
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }
  return (
    <CheckboxGroupContext.Provider value={{ value: current, onChange: handleChange, isDisabled }}>
      <div className={cn('flex flex-col gap-2', className)}>{children}</div>
    </CheckboxGroupContext.Provider>
  )
}

export { Checkbox, CheckboxGroup, type CheckboxProps, type CheckboxGroupProps }
```

- [ ] **Step 4: 更新 index.ts**

```ts
export { Checkbox, CheckboxGroup, type CheckboxProps, type CheckboxGroupProps } from './components/checkbox'
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
git add .
git commit -m "feat(ui): add Checkbox and CheckboxGroup"
```

---

## Task 5: Radio + RadioGroup + useRadioGroup

**Files:**
- Create: `apps/storybook/stories/radio.stories.tsx`
- Create: `packages/ui/src/components/radio.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Radio, RadioGroup } from '@urfit/ui'
import { useState } from 'react'

const meta: Meta = { title: 'Components/Radio' }
export default meta

export const Default = () => {
  const [value, setValue] = useState('apple')
  return (
    <RadioGroup value={value} onChange={setValue}>
      <Radio value="apple">Apple</Radio>
      <Radio value="orange">Orange</Radio>
      <Radio value="grape">Grape</Radio>
    </RadioGroup>
  )
}

export const Disabled = () => (
  <RadioGroup defaultValue="apple" isDisabled>
    <Radio value="apple">Apple</Radio>
    <Radio value="orange">Orange</Radio>
  </RadioGroup>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 radio-group**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add radio-group --yes
```

- [ ] **Step 3: 完整覆寫 radio.tsx**

注意 shadcn 預設檔名是 `radio-group.tsx`，我們把內容寫到 `radio.tsx`，然後刪掉 `radio-group.tsx`：

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
rm -f src/components/radio-group.tsx
```

然後建立 `packages/ui/src/components/radio.tsx`：

```tsx
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'onValueChange'> {
  onChange?: (value: string) => void
  isDisabled?: boolean
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, onChange, isDisabled, disabled, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('flex flex-col gap-2', className)}
    onValueChange={onChange}
    disabled={isDisabled ?? disabled}
    {...props}
  />
))
RadioGroup.displayName = 'RadioGroup'

interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  children?: React.ReactNode
}

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(({ className, children, ...props }, ref) => (
  <label className="inline-flex items-center gap-2 text-sm">
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-[--input] bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-[--primary]',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-[--primary]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
    {children && <span>{children}</span>}
  </label>
))
Radio.displayName = 'Radio'

// Chakra-style useRadioGroup hook（簡化版：只回傳 value、onChange、getRadioProps）
interface UseRadioGroupOptions {
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
}

interface UseRadioGroupReturn {
  value: string | undefined
  setValue: (value: string) => void
  getRadioProps: (props: { value: string }) => { value: string }
  getRootProps: () => { value: string | undefined; onChange: (value: string) => void }
}

function useRadioGroup({ defaultValue, value, onChange }: UseRadioGroupOptions = {}): UseRadioGroupReturn {
  const [internal, setInternal] = React.useState(defaultValue)
  const current = value ?? internal
  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }
  return {
    value: current,
    setValue: handleChange,
    getRadioProps: ({ value }) => ({ value }),
    getRootProps: () => ({ value: current, onChange: handleChange }),
  }
}

export { Radio, RadioGroup, useRadioGroup, type RadioProps, type RadioGroupProps }
```

- [ ] **Step 4: 更新 index.ts**

```ts
export { Radio, RadioGroup, useRadioGroup, type RadioProps, type RadioGroupProps } from './components/radio'
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
git add .
git commit -m "feat(ui): add Radio, RadioGroup, useRadioGroup"
```

---

## Task 6: Switch

**Files:**
- Create: `apps/storybook/stories/switch.stories.tsx`
- Create: `packages/ui/src/components/switch.tsx`（shadcn add 後改寫）
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Switch } from '@urfit/ui'

const meta: Meta = { title: 'Components/Switch' }
export default meta

export const Default = () => <Switch />

export const Checked = () => <Switch defaultChecked />

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Switch disabled />
    <Switch disabled defaultChecked />
  </div>
)
```

- [ ] **Step 2: 用 shadcn CLI 新增 switch**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add switch --yes
```

- [ ] **Step 3: 完整覆寫 switch.tsx**

```tsx
import * as SwitchPrimitive from '@radix-ui/react-switch'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:bg-[--primary] data-[state=unchecked]:bg-[--muted]',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'

export { Switch, type SwitchProps }
```

- [ ] **Step 4: 更新 index.ts**

```ts
export { Switch, type SwitchProps } from './components/switch'
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
git add .
git commit -m "feat(ui): add Switch"
```

---

## Task 7: Select

**Files:**
- Create: `apps/storybook/stories/select.stories.tsx`
- Create: `packages/ui/src/components/select.tsx`
- Modify: `packages/ui/src/index.ts`

**設計決策：** Chakra v1 的 `<Select>` 是 native HTML `<select>` 套上樣式（不是 Radix combobox）。為求外觀與行為一致，我們也用 native `<select>`，**不** 用 shadcn 的 Select（Radix-based）。

- [ ] **Step 1: 先寫 Story**

```tsx
import type { Meta } from '@storybook/react-vite'
import { Select } from '@urfit/ui'

const meta: Meta = { title: 'Components/Select' }
export default meta

export const Default = () => (
  <Select placeholder="Select an option">
    <option value="apple">Apple</option>
    <option value="orange">Orange</option>
    <option value="grape">Grape</option>
  </Select>
)

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
    <Select size="sm">
      <option>Small</option>
    </Select>
    <Select size="md">
      <option>Medium</option>
    </Select>
    <Select size="lg">
      <option>Large</option>
    </Select>
  </div>
)

export const Disabled = () => (
  <Select disabled>
    <option>Cannot select</option>
  </Select>
)
```

- [ ] **Step 2: 建立 select.tsx（native HTML，不用 shadcn）**

```tsx
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const selectVariants = cva(
  'appearance-none w-full rounded-md border border-[--input] bg-white pl-3 pr-8 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:border-[--primary] disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-[#E53E3E]',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10',
        lg: 'h-12 text-md',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, placeholder, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(selectVariants({ size, className }))}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[--muted-foreground]"
      />
    </div>
  ),
)
Select.displayName = 'Select'

export { Select }
```

- [ ] **Step 3: 更新 index.ts**

```ts
export { Select, type SelectProps } from './components/select'
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
git add .
git commit -m "feat(ui): add Select (native HTML)"
```

---

## Task 8: useToast (sonner)

**Files:**
- Create: `apps/storybook/stories/toast.stories.tsx`
- Create: `packages/ui/src/components/toast.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `apps/storybook/.storybook/preview.ts`（加入 `<Toaster />` global decorator）

**設計：** Chakra 的 useToast 是 imperative API：`const toast = useToast(); toast({ title, status, duration })`。sonner 也是 imperative，所以我們直接做一個 wrapper。`<Toaster />` 元件需要被 mount 一次（通常在 App root），lodestar-app 後續整合時要加。

- [ ] **Step 1: 安裝 sonner**

shadcn 的 sonner 元件會自動加 sonner 為 dep：

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm dlx shadcn@latest add sonner --yes
```

這會建立 `src/components/sonner.tsx`，並把 `sonner` 加進 dependencies。

- [ ] **Step 2: 完整覆寫 toast.tsx（從 sonner.tsx 改寫）**

刪除 shadcn 產生的 sonner.tsx，建立 `packages/ui/src/components/toast.tsx`：

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
rm -f src/components/sonner.tsx
```

```tsx
import * as React from 'react'
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

interface ToasterProps extends React.ComponentProps<typeof SonnerToaster> {}

function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          color: '#1A202C',
          border: '1px solid #E2E8F0',
          borderRadius: '0.375rem',
        },
      }}
      {...props}
    />
  )
}

type ToastStatus = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  status?: ToastStatus
  duration?: number
  isClosable?: boolean
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
}

function useToast() {
  return React.useCallback((options: ToastOptions) => {
    const { title, description, status = 'info', duration = 5000 } = options
    const message = title ?? ''
    const opts = { description, duration }
    switch (status) {
      case 'success':
        return sonnerToast.success(message, opts)
      case 'error':
        return sonnerToast.error(message, opts)
      case 'warning':
        return sonnerToast.warning(message, opts)
      case 'loading':
        return sonnerToast.loading(message, opts)
      case 'info':
      default:
        return sonnerToast(message, opts)
    }
  }, [])
}

export { Toaster, useToast, sonnerToast as toast, type ToastOptions, type ToastStatus }
```

- [ ] **Step 3: 更新 index.ts**

```ts
export { Toaster, useToast, toast, type ToastOptions, type ToastStatus } from './components/toast'
```

- [ ] **Step 4: 在 Storybook preview.ts 加入 Toaster decorator**

修改 `apps/storybook/.storybook/preview.ts`：

```ts
import type { Preview } from '@storybook/react-vite'
import { Toaster } from '@urfit/ui'
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
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
}

export default preview
```

**注意：** 這個檔案副檔名要改成 `.tsx` 因為包含 JSX。重新命名：

```bash
cd /Users/eddy/urfit/urfit-ui/apps/storybook/.storybook
mv preview.ts preview.tsx
```

- [ ] **Step 5: 寫 Story**

建立 `apps/storybook/stories/toast.stories.tsx`：

```tsx
import type { Meta } from '@storybook/react-vite'
import { Button, useToast } from '@urfit/ui'

const meta: Meta = { title: 'Components/Toast' }
export default meta

function ToastDemo({ status }: { status: 'success' | 'error' | 'warning' | 'info' }) {
  const toast = useToast()
  return (
    <Button onClick={() => toast({ title: `${status} toast`, description: 'This is a message', status })}>
      Show {status} toast
    </Button>
  )
}

export const Success = () => <ToastDemo status="success" />
export const Error = () => <ToastDemo status="error" />
export const Warning = () => <ToastDemo status="warning" />
export const Info = () => <ToastDemo status="info" />
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
git add .
git commit -m "feat(ui): add useToast wrapping sonner"
```

---

## Task 9: 最終 Build 驗證

- [ ] **Step 1: 完整 build packages/ui**

```bash
cd /Users/eddy/urfit/urfit-ui/packages/ui
pnpm build
ls -lh dist/
```

Expected: `dist/index.js`, `dist/index.css`, `dist/index.d.ts` 都存在，且 size 比 Phase 1 大（加入了表單元件）。

- [ ] **Step 2: 確認 index.ts 完整匯出 Phase 1 + Phase 2 所有元件**

`packages/ui/src/index.ts` 完整內容應為：

```ts
import './styles/globals.css'

// Phase 1
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

// Phase 2
export { Input, InputGroup, InputLeftElement, InputRightElement, type InputProps } from './components/input'
export { Textarea, type TextareaProps } from './components/textarea'
export {
  FormControl, FormLabel, FormErrorMessage, FormHelperText, useFormControl,
  type FormControlProps, type FormLabelProps, type FormErrorMessageProps, type FormHelperTextProps,
} from './components/form-control'
export { Checkbox, CheckboxGroup, type CheckboxProps, type CheckboxGroupProps } from './components/checkbox'
export { Radio, RadioGroup, useRadioGroup, type RadioProps, type RadioGroupProps } from './components/radio'
export { Switch, type SwitchProps } from './components/switch'
export { Select, type SelectProps } from './components/select'
export { Toaster, useToast, toast, type ToastOptions, type ToastStatus } from './components/toast'
```

- [ ] **Step 3: Storybook 完整 build**

```bash
cd /Users/eddy/urfit/urfit-ui/apps/storybook
pnpm build
rm -rf storybook-static
```

- [ ] **Step 4: Final commit（如果有 index.ts 整理修改）**

```bash
cd /Users/eddy/urfit/urfit-ui
git add .
git diff --cached --stat
git commit -m "feat(ui): Phase 2 complete - form components" 2>/dev/null || echo "no changes to commit"
```

---

## 完成後的狀態

Phase 2 完成後，`@urfit/ui` 新增：
- **Input** + **InputGroup** + **InputLeftElement** + **InputRightElement**（含 sm/md/lg、aria-invalid 樣式）
- **Textarea**
- **FormControl** + **FormLabel** + **FormErrorMessage** + **FormHelperText** + **useFormControl** hook（context-based）
- **Checkbox** + **CheckboxGroup**（context-based group state）
- **Radio** + **RadioGroup** + **useRadioGroup** hook
- **Switch**
- **Select**（native HTML，Chakra v1 style）
- **Toaster** + **useToast** + **toast**（包裝 sonner）

加上 Phase 1，總計約 30+ 個元件，涵蓋 lodestar-app 約 85% 的 Chakra 使用次數。

**下一步**：Phase 3（複合元件：Tabs、Menu、Collapse、Table、useDisclosure、Progress、CircularProgress）。
