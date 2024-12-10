import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const CreateEntityDialog = ({ open, onOpenChange, onCreate, entityType }) => {
  const [newEntity, setNewEntity] = useState({
    value: '',
    label: '',
    status: 'ACTIVE',
  })

  const handleSubmit = () => {
    onCreate(newEntity)
    setNewEntity({ value: '', label: '', status: 'ACTIVE' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Entity for {entityType.label}</DialogTitle>
          <DialogDescription>Add a new entity to the {entityType.label} type</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <Input
              id="value"
              value={newEntity.value}
              onChange={e =>
                setNewEntity(prev => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              placeholder="Unique identifier"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={newEntity.label}
              onChange={e =>
                setNewEntity(prev => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              placeholder="Display name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={newEntity.status}
              onValueChange={value =>
                setNewEntity(prev => ({
                  ...prev,
                  status: value,
                }))
              }>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Create Entity</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
