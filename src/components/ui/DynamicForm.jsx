import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const DynamicForm = ({ fields, formData, errors, onChange }) => {
  const renderField = field => {
    const { name, label, type, placeHolder, options = [] } = field
    const value = formData[name] || ''

    const commonClasses = 'space-y-1 w-full'

    switch (type) {
      case 'text':
      case 'textarea':
        return (
          <div key={name} className={commonClasses}>
            <Label htmlFor={name}>{label}</Label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                placeholder={placeHolder}
                value={value}
                onChange={e => onChange(name, e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
              />
            ) : (
              <Input
                id={name}
                placeholder={placeHolder}
                value={value}
                onChange={e => onChange(name, e.target.value)}
              />
            )}
            {errors[name] && (
              <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
            )}
          </div>
        )

      case 'color':
  return (
    <div key={name} className={commonClasses}>
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-4">
        <Input
          id={name}
          type="color"
          value={value || ''}
          onChange={e => onChange(name, e.target.value)}
          className="w-16 h-10 p-1 border rounded"
        />
        <span className="text-sm font-mono text-gray-600">
          {value || 'No color selected'}
        </span>
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      )}
    </div>
  )


      case 'select':
        return (
          <div key={name} className={commonClasses}>
            <Label htmlFor={name}>{label}</Label>
            <Select onValueChange={val => onChange(name, val)} value={value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt, i) => (
                  <SelectItem key={i} value={opt.value || opt}>
                    {opt.label || opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[name] && (
              <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
            )}
          </div>
        )

      case 'chip':
        return (
          <div key={name} className={`${commonClasses} md:col-span-2`}>
            <Label>{label}</Label>
            <div className="flex flex-wrap gap-2">
              {options.map((opt, i) => {
                const selected = Array.isArray(value)
                  ? value.includes(opt.value || opt)
                  : false
                return (
                  <Button
                    key={i}
                    type="button"
                    size="sm"
                    variant={selected ? 'default' : 'outline'}
                    onClick={() => {
                      let newValues = Array.isArray(value) ? [...value] : []
                      if (selected) {
                        newValues = newValues.filter(
                          v => v !== (opt.value || opt)
                        )
                      } else {
                        newValues.push(opt.value || opt)
                      }
                      onChange(name, newValues)
                    }}
                  >
                    {opt.label || opt}
                  </Button>
                )
              })}
            </div>
            {errors[name] && (
              <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const primaryColorField = fields.find(f => f.name === 'theme.primaryColor')
  const secondaryColorField = fields.find(f => f.name === 'theme.secondaryColor')
  const otherFields = fields.filter(
    f => f.name !== 'theme.primaryColor' && f.name !== 'theme.secondaryColor'
  )

  return (
    <>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {otherFields.map(renderField)}

        {primaryColorField && renderField(primaryColorField)}
      </form>

      {secondaryColorField && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="secondaryColor">
            <AccordionTrigger className="text-base font-medium">
              Add Secondary Color
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField(secondaryColorField)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  )
}

export default DynamicForm
