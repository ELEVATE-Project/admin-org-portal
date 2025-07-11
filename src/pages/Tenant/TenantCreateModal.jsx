import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createOrUpdateTenant } from '@/api/tenantApi'
import DynamicForm from '@/components/ui/DynamicForm'
import tenantFormJson from '@/forms/tenantCreateForm.json'
import { Loader2 } from 'lucide-react'

const TenantCreateModal = ({ open, setOpen, onAdd }) => {
  const [formFields, setFormFields] = useState([])
  const [flatFields, setFlatFields] = useState([])
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Helper: flatten fields from group structure
  const flattenFields = (fields) => {
    return fields.flatMap(field => {
      if (field.type === 'group' && Array.isArray(field.fields)) {
        return flattenFields(field.fields)
      }
      return field
    })
  }

  useEffect(() => {
    if (!open) return
    const fields = tenantFormJson?.data || []

    const flattened = flattenFields(fields)
    setFormFields(fields) // for rendering
    setFlatFields(flattened) // for validation/init

    const initialState = flattened.reduce((acc, field) => {
      acc[field.name] = field.type === 'chip' ? [] : ''
      return acc
    }, {})
    setFormData(initialState)
    setErrors({})
  }, [open])

  const validate = () => {
    const errs = {}
    flatFields.forEach(field => {
      const value = formData[field.name]
      if (field.validators?.required && !value) {
        errs[field.name] = field.errorMessage?.required || 'This field is required'
      }
      if (field.validators?.pattern) {
        const regex = new RegExp(field.validators.pattern)
        if (!regex.test(value)) {
          errs[field.name] = field.errorMessage?.pattern || 'Invalid format'
        }
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      const tags =
        typeof formData['meta.tags'] === 'string'
          ? formData['meta.tags'].split(',').map(tag => tag.trim())
          : []

      const theming = {
         primaryColor: formData['theme.primaryColor']
       }
       if (formData['theme.secondaryColor']) {
         theming.secondaryColor = formData['theme.secondaryColor']
      }

      const tenantData = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        logo: formData.logo || '',
        theming: {
          primaryColor: formData['theme.primaryColor'],
          secondaryColor: formData['theme.secondaryColor'],
        },
        meta: { tags },
        domains: [
          formData.domain?.trim() ||
            `https://${formData.code}.shikshalokam.org`,
        ],
      }

      const result = await createOrUpdateTenant(tenantData)
      onAdd(result)
      setOpen(false)
    } catch (error) {
      console.error('❌ Failed to create tenant:', error)
      alert('Failed to create tenant. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const renderGroupSection = (group) => (
    <div
      key={group.label}
      className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-700">{group.label}</h3>
      <DynamicForm
        fields={group.fields}
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />
    </div>
  )

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
            Create New Tenant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {formFields.map(field =>
            field.type === 'group'
              ? renderGroupSection(field)
              : null // skip ungrouped
          )}

          {/* Footer Actions */}
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
                  Creating...
                </div>
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

export default TenantCreateModal
