import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog'
import { Input } from './input'
import { Label } from './label'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

export const EntityTypeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    status: 'ACTIVE',
    type: 'SYSTEM',
    data_type: 'STRING',
    allow_filtering: true,
    has_entities: true,
    allow_custom_entities: true,
    model_names: [],
    required: false,
    regex: '',
  })

  const modelNameOptions = ['UserExtension', 'Session']

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleModelNameChange = selectedValues => {
    setFormData(prev => ({
      ...prev,
      model_names: selectedValues,
    }))
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.value || !formData.label) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Entity Type</DialogTitle>
          <DialogDescription>Define a new entity type for your system</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value*
            </Label>
            <Input
              id="value"
              name="value"
              placeholder="Enter unique value (e.g., ln)"
              value={formData.value}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label*
            </Label>
            <Input
              id="label"
              name="label"
              placeholder="Enter label (e.g., Languages)"
              value={formData.label}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Model Names</Label>
            <Select onValueChange={handleModelNameChange} multiple>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select model names" />
              </SelectTrigger>
              <SelectContent>
                {modelNameOptions.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="required" className="text-right">
              Required
            </Label>
            <Select
              value={formData.required.toString()}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, required: value === 'true' }))
              }>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Entity Type</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
