import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createOrganization, createNewOrganization } from '@/api/organizationApi'
import DynamicForm from '@/components/ui/DynamicForm'
import organizationFormJson from '@/forms/organizationForm.json'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const OrganizationCreateModal = ({
  open,
  setOpen,
  onAdd,
  initialData = {},
  mode = 'edit',
  selectedTenant = null,
}) => {
  const [formFields, setFormFields] = useState([])
  const [flatFields, setFlatFields] = useState([])
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { toast } = useToast()

  const flattenFields = (fields) => {
    return fields.flatMap((field) =>
      field.type === 'group' ? flattenFields(field.fields) : field
    )
  }

  useEffect(() => {
    if (!open) return

    const fields = organizationFormJson?.data || []
    const flattened = flattenFields(fields)

    setFormFields(fields)
    setFlatFields(flattened)

    const initialState = flattened.reduce((acc, field) => {
      acc[field.name] =
        initialData?.[field.name] ?? (field.type === 'chip' ? [] : '')
      return acc
    }, {})

    // Handle theming color fields
    if (initialData.theming?.primaryColor) {
      initialState['theming.primaryColor'] = initialData.theming.primaryColor
    }
    if (initialData.theming?.secondaryColor) {
      initialState['theming.secondaryColor'] = initialData.theming.secondaryColor
    }

    // Handle array fields
    if (Array.isArray(initialData.org_admin)) {
      initialState['org_admin'] = initialData.org_admin.join(', ')
    }
    if (Array.isArray(initialData.related_orgs)) {
      initialState['related_orgs'] = initialData.related_orgs.join(', ')
    }

    // Handle meta.tags
    if (initialData.meta?.tags) {
      initialState['meta.tags'] = Array.isArray(initialData.meta.tags)
        ? initialData.meta.tags.join(', ')
        : initialData.meta.tags
    }

    // Handle tenant_code for create mode
    if (mode === 'create' && selectedTenant) {
      initialState['tenant_code'] = selectedTenant
    }

    setFormData(initialState)
    setErrors({})
    setSubmitError('')
  }, [open])

  const validate = () => {
    const errs = {}
    flatFields.forEach((field) => {
      const value = formData[field.name]
      if (field.validators?.required && !value) {
        errs[field.name] =
          field.errorMessage?.required || 'This field is required'
      }
      if (field.validators?.pattern) {
        const regex = new RegExp(field.validators.pattern)
        if (!regex.test(value)) {
          errs[field.name] =
            field.errorMessage?.pattern || 'Invalid format'
        }
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    try {
      // Process tags
      const tags =
        typeof formData['meta.tags'] === 'string'
          ? formData['meta.tags']
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : []

      // Process comma-separated fields
      const processedRelatedOrgs =
        typeof formData['related_orgs'] === 'string'
          ? formData['related_orgs']
              .split(',')
              .map((x) => Number(x.trim()))
              .filter(Boolean)
          : []

      const processedDomains =
        typeof formData['domains'] === 'string'
          ? formData['domains']
              .split(',')
              .map((d) => d.trim())
              .filter(Boolean)
          : []

      // Prepare theming object
      const theming = {
        primaryColor: formData['theming.primaryColor'],
        ...(formData['theming.secondaryColor'] && {
          secondaryColor: formData['theming.secondaryColor'],
        }),
      }

      let payload = {}

      if (mode === 'edit') {
        payload = {
          name: formData.name,
          description: formData.description,
          theming,
          ...(processedRelatedOrgs.length > 0 && {
            related_orgs: processedRelatedOrgs,
          }),
        }
      } else {
        // Create mode
        payload = {
          name: formData.name,
          code: formData.code,
          description: formData.description,
          param: formData.param,
          tenant_code: formData.tenant_code,
          ...(processedDomains.length > 0 && { domains: processedDomains }),
          theming,
        }
      }

      // Remove empty values
      Object.keys(payload).forEach((key) => {
        const value = payload[key]
        if (
          value === '' ||
          value === null ||
          typeof value === 'undefined' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete payload[key]
        }
      })

      if (mode === 'edit') {
        await createOrganization(initialData.id, payload)
      } else {
        await createNewOrganization(payload)
      }

      toast &&
        toast({
          title: `Organization ${
            mode === 'edit' ? 'updated' : 'created'
          }`,
          description: `Organization ${
            mode === 'edit' ? 'updated' : 'created'
          } successfully`,
          variant: 'success',
        })

      onAdd(payload)
      setOpen(false)
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        `Failed to ${mode} organization`
      setSubmitError(errorMessage)

      toast &&
        toast({
          title: `Failed to ${mode} organization`,
          description: errorMessage,
          variant: 'destructive',
        })
    } finally {
      setLoading(false)
    }
  }

  // Filter out unwanted fields/groups before rendering
  const shouldRenderGroup = (group) => {
    if (mode === 'edit' && ['Meta', 'Related Organizations'].includes(group.label)) return false
    // Only remove Meta in create mode, keep Domains and Theming so they show up
    if (mode === 'create' && ['Meta'].includes(group.label)) return false
    return true
  }

  const renderGroupSection = (group) => {
    if (!shouldRenderGroup(group)) return null

    const filteredFields = group.fields.filter((field) => {
      if (mode === 'edit' && ['meta.tags', 'related_orgs'].includes(field.name)) return false
      // Only remove param and meta.tags in create mode, keep domains and theming so they show up
      if (mode === 'create' && ['meta.tags', 'param'].includes(field.name)) return false
      if (!field.showOnMode) return true
      return field.showOnMode.includes(mode)
    })
    if (filteredFields.length === 0) return null
    return (
      <div
        key={group.label}
        className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-700">{group.label}</h3>
        <DynamicForm
          fields={filteredFields}
          formData={formData}
          errors={errors}
          onChange={handleChange}
          mode={mode}
        />
        {/* Show a helper text for domains field in create mode */}
        {mode === 'create' && group.label === 'Domains' && (
          <div className="text-xs text-gray-500 mt-2">
            Enter domains separated by commas. Example: <code>dummy.com, example.com</code>
          </div>
        )}
      </div>
    )
  }

  if (!formFields.length) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <Loader2 className="animate-spin h-6 w-6 mb-2" />
            <span>Loading form...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {mode === 'edit' ? 'Edit Organization' : 'Create New Organization'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {formFields.map((field) =>
            field.type === 'group' ? renderGroupSection(field) : null
          )}

          {submitError && (
            <div className="text-red-600 text-sm mb-2">{submitError}</div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </div>
              ) : mode === 'edit' ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationCreateModal