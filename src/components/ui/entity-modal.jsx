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

export const EntityModal = ({ isOpen, onClose, onSubmit, entityType }) => {
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    status: 'ACTIVE',
    type: 'SYSTEM',
    entity_type_id: entityType?.id || null,
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
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

  if (!entityType) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Entity for {entityType.label}</DialogTitle>
          <DialogDescription>Define a new entity under {entityType.label}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value*
            </Label>
            <Input
              id="value"
              name="value"
              placeholder="Enter unique value (e.g., en)"
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
              placeholder="Enter label (e.g., English)"
              value={formData.label}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Entity</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
