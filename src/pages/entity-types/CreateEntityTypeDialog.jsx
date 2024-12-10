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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

export const CreateEntityTypeDialog = ({ open, onOpenChange, onCreate }) => {
  const [newEntityType, setNewEntityType] = useState({
    value: '',
    label: '',
    status: 'ACTIVE',
    type: 'SYSTEM',
    data_type: 'STRING',
    allow_filtering: false,
    has_entities: true,
    allow_custom_entities: true,
    model_names: [],
    required: false,
    regex: '',
  })

  const handleSubmit = () => {
    // Remove empty regex before sending
    const submitData = { ...newEntityType }
    if (submitData.regex == null || submitData.regex === '') {
      delete submitData.regex
    }

    onCreate(submitData)
    // Reset form
    setNewEntityType({
      value: '',
      label: '',
      status: 'ACTIVE',
      type: 'SYSTEM',
      data_type: 'STRING',
      allow_filtering: false,
      has_entities: false,
      allow_custom_entities: false,
      model_names: [],
      required: false,
      regex: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Entity Type</DialogTitle>
          <DialogDescription>Define a new entity type for your system</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <Input
              id="value"
              value={newEntityType.value}
              onChange={e =>
                setNewEntityType(prev => ({
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
              value={newEntityType.label}
              onChange={e =>
                setNewEntityType(prev => ({
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
              value={newEntityType.status}
              onValueChange={value =>
                setNewEntityType(prev => ({
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
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={newEntityType.type}
              onValueChange={value =>
                setNewEntityType(prev => ({
                  ...prev,
                  type: value,
                }))
              }>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SYSTEM">System</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="data_type" className="text-right">
              Data Type
            </Label>
            <Select
              value={newEntityType.data_type}
              onValueChange={value =>
                setNewEntityType(prev => ({
                  ...prev,
                  data_type: value,
                }))
              }>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STRING">String</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="BOOLEAN">Boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model_names" className="text-right">
              Model Names
            </Label>
            <div className="col-span-3 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="userExtension"
                  checked={newEntityType.model_names.includes('UserExtension')}
                  onCheckedChange={checked =>
                    setNewEntityType(prev => ({
                      ...prev,
                      model_names: checked
                        ? [...prev.model_names, 'UserExtension']
                        : prev.model_names.filter(name => name !== 'UserExtension'),
                    }))
                  }
                />
                <Label htmlFor="userExtension">UserExtension</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="session"
                  checked={newEntityType.model_names.includes('Session')}
                  onCheckedChange={checked =>
                    setNewEntityType(prev => ({
                      ...prev,
                      model_names: checked
                        ? [...prev.model_names, 'Session']
                        : prev.model_names.filter(name => name !== 'Session'),
                    }))
                  }
                />
                <Label htmlFor="session">Session</Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="regex" className="text-right">
              Regex (Optional)
            </Label>
            <Input
              id="regex"
              value={newEntityType.regex}
              onChange={value =>
                setNewEntityType(prev => ({
                  ...prev,
                  regex: value,
                }))
              }
              placeholder="Optional regex validation"
              className="col-span-3"
            />
          </div>
          <TooltipProvider>
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 group">
                  <Checkbox
                    id="allow_filtering"
                    checked={newEntityType.allow_filtering}
                    onCheckedChange={checked =>
                      setNewEntityType(prev => ({
                        ...prev,
                        allow_filtering: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="allow_filtering"
                    className="cursor-pointer group-hover:text-primary transition-colors">
                    Allow Filtering
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Enables filtering options for this entity type</TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center space-x-2 group">
                  <Checkbox
                    id="has_entities"
                    checked={newEntityType.has_entities}
                    onCheckedChange={checked =>
                      setNewEntityType(prev => ({
                        ...prev,
                        has_entities: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="has_entities"
                    className="cursor-pointer group-hover:text-primary transition-colors">
                    Has Entities
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Indicates if this entity type can contain other entities
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 group">
                  <Checkbox
                    id="allow_custom_entities"
                    checked={newEntityType.allow_custom_entities}
                    onCheckedChange={checked =>
                      setNewEntityType(prev => ({
                        ...prev,
                        allow_custom_entities: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="allow_custom_entities"
                    className="cursor-pointer group-hover:text-primary transition-colors">
                    Allow Custom Entities
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Permits creation of custom entities within this type
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center space-x-2 group">
                  <Checkbox
                    id="required"
                    checked={newEntityType.required}
                    onCheckedChange={checked =>
                      setNewEntityType(prev => ({
                        ...prev,
                        required: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="required"
                    className="cursor-pointer group-hover:text-primary transition-colors">
                    Required
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Specifies if this entity type is mandatory</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </TooltipProvider>

          <Button onClick={handleSubmit}>Create Entity Type</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
