import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

export function MultiSelect({ options, value, onChange, placeholder = 'Select options' }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left flex-wrap max-h-[48px] overflow-hidden text-ellipsis"
          title={value.join(', ')} // Adds a tooltip for visibility of all selections
        >
          {value.length === 0 ? placeholder : value.join(', ')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 max-h-56 overflow-y-auto">
        {options.map(option => (
          <div key={option} className="flex items-center space-x-2 p-1">
            <Checkbox
              id={option}
              checked={value.includes(option)}
              onCheckedChange={checked => {
                if (checked) {
                  onChange([...value, option])
                } else {
                  onChange(value.filter(v => v !== option))
                }
              }}
            />
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option}
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
