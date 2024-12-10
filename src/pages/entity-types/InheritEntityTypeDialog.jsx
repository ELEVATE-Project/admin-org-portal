import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { inheritEntityType } from '@/api/entityManagement'

export const InheritEntityTypeDialog = ({ open, onOpenChange, entityType, onInheritSuccess }) => {
  const [targetEntityTypeLabel, setTargetEntityTypeLabel] = useState('')

  const handleInherit = async () => {
    if (!targetEntityTypeLabel.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a target entity type label.',
        variant: 'destructive',
      })
      return
    }

    try {
      const requestBody = {
        entityTypeValue: entityType.value,
        entityTypeLabel: targetEntityTypeLabel,
      }

      console.log('Inherit Request Body:', requestBody) // Logging the request body

      // Ensure the request body is not empty
      const response = await inheritEntityType(requestBody)

      toast({
        title: 'Entity Type Inherited',
        description: `Successfully inherited ${entityType.label} to ${targetEntityTypeLabel}.`,
      })

      // Reset input and close dialog
      setTargetEntityTypeLabel('') // Explicitly clearing the input
      onOpenChange(false)

      // Optional: call success callback if provided
      onInheritSuccess?.(response.result)
    } catch (error) {
      console.error('Inheritance Error:', error) // Log any errors
      toast({
        title: 'Inheritance Failed',
        description:
          error.response.data.message || 'Unable to inherit entity type. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Reset input when dialog closes
  const handleOpenChange = isOpen => {
    if (!isOpen) {
      setTargetEntityTypeLabel('')
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inherit Entity Type</DialogTitle>
          <DialogDescription>
            Inherit the entity type "{entityType.label}" to a new target entity type.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entity-type-value" className="text-right">
              Source Entity Type
            </Label>
            <Input
              id="entity-type-value"
              value={entityType.value}
              disabled
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target-label" className="text-right">
              Target Label
            </Label>
            <Input
              id="target-label"
              value={targetEntityTypeLabel}
              onChange={e => setTargetEntityTypeLabel(e.target.value)}
              placeholder="Enter target entity type label"
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleInherit}>
            Inherit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
