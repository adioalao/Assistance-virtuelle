"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomSelectFilterProps {
  placeholder?: string
  options: { label: string; value: string }[]
  value?: string
  onChange: (value: string) => void
}

export function CustomSelectFilter({
  placeholder = "...",
  options,
  value,
  onChange,
}: CustomSelectFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
        <SelectItem value="">Tout</SelectItem>
      </SelectContent>
    </Select>
  )
}