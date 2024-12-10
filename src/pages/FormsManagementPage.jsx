import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Edit, Eye, Trash2, Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { fetchForms, fetchFormDetails, updateForm, createForm } from '@/api/form'
import Layout from '../components/Layout'

const FormsManagementPage = () => {
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [editedFormData, setEditedFormData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // New state for create form
  const [newFormType, setNewFormType] = useState('')
  const [newFormSubType, setNewFormSubType] = useState('')
  const [newFormData, setNewFormData] = useState('{}')

  useEffect(() => {
    const loadForms = async () => {
      try {
        setIsLoading(true)
        const response = await fetchForms()
        setForms(response.result || [])
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch forms',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadForms()
  }, [])

  const handleCreateForm = async () => {
    try {
      // Validate inputs
      if (!newFormType || !newFormSubType) {
        toast({
          title: 'Validation Error',
          description: 'Type and Sub Type are required',
          variant: 'destructive',
        })
        return
      }

      // Parse form data
      let parsedData = {}
      try {
        parsedData = JSON.parse(newFormData)
      } catch (error) {
        toast({
          title: 'Invalid JSON',
          description: 'Please provide a valid JSON for form data',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)
      const response = await createForm({
        type: newFormType,
        sub_type: newFormSubType,
        data: parsedData,
      })

      if (response.responseCode === 'OK') {
        toast({
          title: 'Success',
          description: 'Form created successfully',
        })

        // Refresh forms list
        const formsResponse = await fetchForms()
        setForms(formsResponse.result || [])

        // Reset create form fields and close dialog
        setNewFormType('')
        setNewFormSubType('')
        setNewFormData('{}')
        setIsCreateDialogOpen(false)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create form',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create form',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    const loadForms = async () => {
      try {
        setIsLoading(true)
        const response = await fetchForms()
        setForms(response.result || [])
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch forms',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadForms()
  }, [])

  const handleFormSelect = async form => {
    try {
      setIsLoading(true)
      const response = await fetchFormDetails(form.id)
      const details = response.result
      setSelectedForm(details)
      setEditedFormData(JSON.stringify(details.data, null, 2))
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to fetch form details for ID ${form.id}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormUpdate = async () => {
    if (!selectedForm) return

    try {
      const parsedData = JSON.parse(editedFormData)
      setIsLoading(true)

      const updateResponse = await updateForm(selectedForm.id, {
        type: selectedForm.type,
        sub_type: selectedForm.sub_type,
        data: parsedData,
      })

      if (updateResponse.responseCode === 'OK') {
        toast({
          title: 'Success',
          description: 'Form updated successfully',
        })

        // Refresh forms list
        const formsResponse = await fetchForms()
        setForms(formsResponse.result || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update form',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update form',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold ">Forms Management</h1>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 ml-auto">
            <Plus className="h-4 w-4" /> Create New Form
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Form Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Input
                    id="type"
                    value={newFormType}
                    onChange={e => setNewFormType(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter form type"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subType" className="text-right">
                    Sub Type
                  </Label>
                  <Input
                    id="subType"
                    value={newFormSubType}
                    onChange={e => setNewFormSubType(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter form sub type"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formData" className="text-right">
                    Form Data
                  </Label>
                  <Textarea
                    id="formData"
                    value={newFormData}
                    onChange={e => setNewFormData(e.target.value)}
                    className="col-span-3 min-h-[200px] font-mono"
                    placeholder="Enter form configuration JSON"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={handleCreateForm} disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Form'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Forms List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Available Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map(form => (
                    <TableRow
                      key={form.id}
                      onClick={() => handleFormSelect(form)}
                      className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{form.id}</TableCell>
                      <TableCell>{form.type}</TableCell>
                      <TableCell>{form.version}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-blue-500" />
                          <Edit className="h-4 w-4 text-green-500" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Form Details and Editing */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedForm ? `Form Details: ${selectedForm.type}` : 'Select a Form'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedForm ? (
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Form Details</TabsTrigger>
                    <TabsTrigger value="edit">Modify or View </TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold">Type:</p>
                            <p>{selectedForm.type}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Sub Type:</p>
                            <p>{selectedForm.sub_type}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Version:</p>
                            <p>{selectedForm.version}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Created At:</p>
                            <p>{new Date(selectedForm.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="edit">
                    <Card>
                      <CardContent className="pt-6">
                        <Textarea
                          value={editedFormData}
                          onChange={e => setEditedFormData(e.target.value)}
                          placeholder="Edit form configuration JSON"
                          className="min-h-[300px] font-mono"
                        />
                        <div className="flex justify-end mt-4">
                          <Button onClick={handleFormUpdate}>Update Form</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center text-muted-foreground">
                  Please select a form from the list
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default FormsManagementPage
