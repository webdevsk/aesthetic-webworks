"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"

export interface ComboboxItem {
  value: string
  label: string
}

interface MultiComboboxProps {
  items: ComboboxItem[]
  selectedValues: string[]
  onSelect: (values: string[]) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function MultiCombobox({
  items,
  selectedValues,
  onSelect,
  placeholder = "Select items...",
  emptyText = "No items found.",
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter((item) => item !== value))
    } else {
      onSelect([...selectedValues, value])
    }
    setInputValue("")
  }

  const handleRemove = (value: string) => {
    onSelect(selectedValues.filter((item) => item !== value))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputValue && !items.find((item) => item.value === inputValue)) {
      e.preventDefault()
      handleSelect(inputValue)
    }
  }

  const allItems = React.useMemo(() => {
    const newItems =
      inputValue && !items.find((item) => item.value === inputValue)
        ? [{ value: inputValue, label: `Create "${inputValue}"` }]
        : []
    return [...items, ...newItems]
  }, [items, inputValue])

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search or create..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {allItems.map((item) => (
                <CommandItem key={item.value} value={item.value} onSelect={handleSelect}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedValues.includes(item.value) ? "opacity-100" : "opacity-0")}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedValues.map((value) => (
          <Badge key={value} variant="secondary">
            {value}
            <button
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRemove(value)
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => handleRemove(value)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {value}</span>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
