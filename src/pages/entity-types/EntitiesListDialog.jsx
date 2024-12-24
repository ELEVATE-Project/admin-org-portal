import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  fetchEntitiesByType,
  createEntity,
  updateEntity,
  deleteEntity,
} from '@/api/entityManagement'
import { toast } from '@/hooks/use-toast'
import { CreateEntityDialog } from './CreateEntityDialog'
import { EditEntityDialog } from './EditEntityDialog'

export const EntitiesListDialog = ({ open, onOpenChange, entityType }) => {
  const [entities, setEntities] = useState([])
  const [filteredEntities, setFilteredEntities] = useState([])
  const [isCreateEntityDialogOpen, setIsCreateEntityDialogOpen] = useState(false)
  const [isEditEntityDialogOpen, setIsEditEntityDialogOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch and filter entities
  useEffect(() => {
    if (open) {
      const loadEntities = async () => {
        try {
          const response = await fetchEntitiesByType(entityType.id)
          const fetchedEntities = response.result?.data || [
            // Hardcoded sample data
            {
              id: 1,
              value: 'admin',
              label: 'Administrator',
              status: 'ACTIVE',
              created_at: '2024-01-15',
            },
            {
              id: 2,
              value: 'user',
              label: 'Regular User',
              status: 'INACTIVE',
              created_at: '2024-02-20',
            },
            {
              id: 3,
              value: 'manager',
              label: 'Department Manager',
              status: 'PENDING',
              created_at: '2024-03-10',
            },
          ]
          setEntities(fetchedEntities)
          setFilteredEntities(fetchedEntities)
        } catch (error) {
          console.error('Failed to fetch entities', error)
          toast({
            title: 'Error',
            description: 'Failed to load entities',
            variant: 'destructive',
          })
        }
      }
      loadEntities()
    }
  }, [open, entityType])

  // Search and filter entities
  useEffect(() => {
    const filtered = entities.filter(
      entity =>
        console.log(entity) ||
        entity.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEntities(filtered)
  }, [searchTerm, entities])

  // Create entity handler
  const handleCreateEntity = async newEntity => {
    try {
      const entityToCreate = {
        ...newEntity,
        entity_type_id: entityType.id,
        type: 'SYSTEM',
      }

      const response = await createEntity(entityToCreate)
      const createdEntity = response.result

      setEntities(prev => [...prev, createdEntity])
      setIsCreateEntityDialogOpen(false)

      toast({
        description: 'Entity created successfully',
      })
    } catch (error) {
      console.error('Failed to create entity', error)
      toast({
        title: 'Error',
        description: 'Failed to create entity',
        variant: 'destructive',
      })
    }
  }

  // Edit entity handler
  const handleEditEntity = async updatedEntity => {
    try {
      const response = await updateEntity(selectedEntity.id, updatedEntity)

      setEntities(prev =>
        prev.map(entity => (entity.id === selectedEntity.id ? response.result[0] : entity)),
      )

      setIsEditEntityDialogOpen(false)
      setSelectedEntity(null)

      toast({
        description: 'Entity updated successfully',
      })
    } catch (error) {
      console.error('Failed to update entity', error)
      toast({
        title: 'Error',
        description: 'Failed to update entity',
        variant: 'destructive',
      })
    }
  }

  // Delete entity handler
  const handleDeleteEntity = async () => {
    try {
      await deleteEntity(selectedEntity.id)

      setEntities(prev => prev.filter(entity => entity.id !== selectedEntity.id))

      setIsDeleteAlertOpen(false)
      setSelectedEntity(null)

      toast({
        description: 'Entity deleted successfully',
      })
    } catch (error) {
      console.error('Failed to delete entity', error)
      toast({
        title: 'Error',
        description: 'Failed to delete entity',
        variant: 'destructive',
      })
    }
  }

  // Status color mapping
  const getStatusBadgeVariant = status => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'INACTIVE':
        return 'secondary'
      case 'PENDING':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Entities for {entityType.label}</DialogTitle>
            <DialogDescription>
              Manage and view entities of type {entityType.label}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 w-full max-w-md">
              <Search className="text-muted-foreground" />
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setIsCreateEntityDialogOpen(true)}
              className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Entity
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities.map(entity => (
                  <TableRow key={entity.id}>
                    <TableCell>{entity.id}</TableCell>
                    <TableCell>{entity.value}</TableCell>
                    <TableCell>{entity.label}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(entity.status)}>{entity.status}</Badge>
                    </TableCell>
                    <TableCell>{entity.created_at}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedEntity(entity)
                              setIsEditEntityDialogOpen(true)
                            }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedEntity(entity)
                              setIsDeleteAlertOpen(true)
                            }}
                            className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredEntities.length === 0 && (
            <div className="text-center text-muted-foreground py-4">No entities found</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Entity Dialog */}
      <CreateEntityDialog
        open={isCreateEntityDialogOpen}
        onOpenChange={setIsCreateEntityDialogOpen}
        onCreate={handleCreateEntity}
        entityType={entityType}
      />

      {/* Edit Entity Dialog */}
      {selectedEntity && (
        <EditEntityDialog
          open={isEditEntityDialogOpen}
          onOpenChange={setIsEditEntityDialogOpen}
          onEdit={handleEditEntity}
          entityType={entityType}
          initialEntity={selectedEntity}
        />
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the entity "{selectedEntity?.label}". This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntity}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
