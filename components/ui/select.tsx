'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType>({ value: '', onValueChange: () => {} })

// Collect <option> elements from the children tree — resolves SelectItem/SelectValue into native <option>s
function collectOptions(children: React.ReactNode): React.ReactNode[] {
  const opts: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    // Native <option> — keep as-is
    if (child.type === 'option') {
      opts.push(child)
      return
    }
    // SelectItem → create a native <option>
    if (child.type === SelectItem) {
      const p = child.props as { value: string; children: React.ReactNode }
      opts.push(<option key={p.value} value={p.value}>{p.children}</option>)
      return
    }
    // SelectValue → create a disabled placeholder <option>
    if (child.type === SelectValue) {
      const p = child.props as { placeholder?: string }
      if (p.placeholder) {
        opts.push(<option key="__placeholder" value="" disabled>{p.placeholder}</option>)
      }
      return
    }
    // Walk into wrappers (SelectContent, SelectGroup, fragments, etc.)
    const props = child.props as { children?: React.ReactNode }
    if (props.children) {
      opts.push(...collectOptions(props.children))
    }
  })
  return opts
}

// Extract className from the SelectTrigger child
function extractTriggerClassName(children: React.ReactNode): string {
  let cls = ''
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === 'SelectTrigger'
    ) {
      cls = (child.props as { className?: string }).className || ''
    }
  })
  return cls
}

function Select({ value, defaultValue = '', onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value ?? internalValue
  const handleChange = React.useCallback(
    (v: string) => {
      if (onValueChange) onValueChange(v)
      else setInternalValue(v)
    },
    [onValueChange],
  )

  const options = collectOptions(children)
  const triggerClassName = extractTriggerClassName(children)

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <select
        className={cn('select select-bordered w-full', triggerClassName)}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options}
      </select>
    </SelectContext.Provider>
  )
}

// Marker component — rendering is handled by Select
const SelectTrigger = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { children?: React.ReactNode }
>(({ children }, _ref) => {
  return <>{children}</>
})
SelectTrigger.displayName = 'SelectTrigger'

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  if (!value && placeholder) {
    return <option value="" disabled>{placeholder}</option>
  }
  return null
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}

function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SelectLabel({ children }: { children: React.ReactNode }) {
  return <option disabled>{children}</option>
}

function SelectSeparator() {
  return null
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
