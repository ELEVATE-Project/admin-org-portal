import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { createRole, updateRole } from '@/api/roleApi'
import DynamicForm from '@/components/ui/DynamicForm'
import roleFormJson from '@/forms/roleForm.json'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const RoleCreateModal = ({ 
  open, 
  setOpen, 
  mode = 'create', 
  organizationId, 
  initialData = null, 
  onAdd 
}) => {
  const [formFields, setFormFields] = useState([])
  const [flatFields, setFlatFields] = useState([])
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { toast } = useToast ? useToast() : { toast: () => {} }

  const flattenFields = (fields) => {
    return fields.flatMap((field) =>
      field.type === 'group' ? flattenFields(field.fields) : field
    )
  }

  useEffect(() => {
    if (!open) return

    const fields = roleFormJson?.data || []
    const flattened = flattenFields(fields)

    setFormFields(fields)
    setFlatFields(flattened)

    const initialState = flattened.reduce((acc, field) => {
      acc[field.name] = initialData?.[field.name] ?? 
        (field.defaultValue !== undefined ? field.defaultValue : '')
      return acc
    }, {})

    // Handle nested translations
    if (initialData?.translations) {
      Object.keys(initialData.translations).forEach(lang => {
        if (initialData.translations[lang]?.title) {
          initialState[`translations.${lang}.title`] = initialData.translations[lang].title
        }
      })
    }

    // Handle entity types
    if (initialData?.meta?.entityTypes && initialData.meta.entityTypes.length > 0) {
      const firstEntityType = initialData.meta.entityTypes[0]
      initialState['entityTypeId'] = firstEntityType.entityTypeId || ''
      initialState['entityType'] = firstEntityType.entityType || ''
    }

    // Set organization_id and tenant_code
    initialState['organization_id'] = organizationId
    initialState['tenant_code'] = initialData?.tenant_code || 'default'

    setFormData(initialState)
    setErrors({})
    setSubmitError('')
  }, [open, initialData, organizationId])

  const validate = () => {
    const errs = {}
    flatFields.forEach((field) => {
      const value = formData[field.name]
      if (field.validators?.required && !value) {
        errs[field.name] =
          field.errorMessage?.required || 'This field is required'
      }
      if (field.validators?.pattern && value !== '' && value != null) {
        const regex = new RegExp(field.validators.pattern)
        if (!regex.test(String(value))) {
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
      // Build translations object
      const translations = {}
      const translationFields = flatFields.filter(f => f.name.startsWith('translations.'))
      
      translationFields.forEach(field => {
        const value = formData[field.name]
        if (value && value.trim()) {
          const [, lang, prop] = field.name.split('.')
          if (!translations[lang]) translations[lang] = {}
          translations[lang][prop] = value.trim()
        }
      })

      // Build meta object with entityTypes
      const meta = {}
      if (formData.entityTypeId && formData.entityType) {
        meta.entityTypes = [{
          entityTypeId: formData.entityTypeId,
          entityType: formData.entityType
        }]
      }

      let payload = {
        title: formData.title,
        label: formData.label,
        user_type: parseInt(formData.user_type) || 0,
        status: formData.status || 'ACTIVE',
        visibility: formData.visibility || 'PUBLIC',
        organization_id: parseInt(organizationId),
        tenant_code: formData.tenant_code || 'default'
      }

      // Add translations if any exist
      if (Object.keys(translations).length > 0) {
        payload.translations = translations
      }

      // Add meta if entityTypes exist
      if (Object.keys(meta).length > 0) {
        payload.meta = meta
      }

      // For edit mode, include the ID
      if (mode === 'edit' && initialData?.id) {
        payload.id = initialData.id.toString()
      }

      // Note: Create mode doesn't need an ID - the server will generate it

      let response
      if (mode === 'edit') {
        response = await updateRole(initialData.id, payload)
      } else {
        response = await createRole(payload)
      }
      
      const roleData = response?.result || response
      
      toast && toast({
        title: `Role ${mode === 'edit' ? 'updated' : 'created'}`,
        description: `Role ${mode === 'edit' ? 'updated' : 'created'} successfully`,
        variant: 'success',
      })

      onAdd(roleData)
      setOpen(false)
    } catch (error) {
      console.error(`❌ Failed to ${mode} role:`, error)
      const errorMessage = error?.response?.data?.message || error.message || `Failed to ${mode} role`
      setSubmitError(errorMessage)
      
      toast && toast({
        title: `Failed to ${mode} role`,
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderGroupSection = (group) => {
    return (
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
          mode={mode}
        />
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
            {mode === 'edit' ? 'Edit Role' : 'Create New Role'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info Section - Always visible */}
          {formFields
            .filter(field => field.type === 'group' && field.label === 'Basic Info')
            .map(field => renderGroupSection(field))}

          {/* Advanced Sections in Accordion - Initially hidden */}
          <Accordion type="multiple" className="w-full">
            {formFields
              .filter(field => 
                field.type === 'group' && 
                ['Entity Types', 'Translations'].includes(field.label)
              )
              .map(field => (
                <AccordionItem key={field.label} value={field.label.toLowerCase().replace(' ', '-')}>
                  <AccordionTrigger className="text-base font-medium">
                    {field.label}
                    {field.label === 'Entity Types' && (
                      <span className="text-sm text-gray-500 ml-2">(Optional)</span>
                    )}
                    {field.label === 'Translations' && (
                      <span className="text-sm text-gray-500 ml-2">(Optional)</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
                      <DynamicForm
                        fields={field.fields}
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        mode={mode}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>

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
                'Update Role'
              ) : (
                'Create Role'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoleCreateModal