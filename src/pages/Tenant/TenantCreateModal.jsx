import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createOrUpdateTenant, updateTenant, addTenantDomain, removeTenantDomain } from '@/api/tenantApi'
import DynamicForm from '@/components/ui/DynamicForm'
import tenantFormJson from '@/forms/tenantCreateForm.json'
import { Loader2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const TenantCreateModal = ({ open, setOpen, onAdd, initialData = {}, mode = 'create' }) => {
  const [formFields, setFormFields] = useState([])
  const [flatFields, setFlatFields] = useState([])
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState([])
  const [domainInput, setDomainInput] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [removeLoadingDomain, setRemoveLoadingDomain] = useState('')
  const { toast } = useToast ? useToast() : { toast: () => {} }

  const flattenFields = (fields) => {
    return fields.flatMap(field => field.type === 'group' ? flattenFields(field.fields) : field)
  }

  useEffect(() => {
    if (!open) return

    const fields = tenantFormJson?.data || []
    const flattened = flattenFields(fields)

    setFormFields(fields)
    setFlatFields(flattened)

    const initialState = flattened.reduce((acc, field) => {
      acc[field.name] =
        initialData?.[field.name] ??
        (field.type === 'chip' ? [] : '')
      return acc
    }, {})

    // Patch nested fields like theming, meta.tags
    if (initialData.theming?.primaryColor) {
      initialState['theme.primaryColor'] = initialData.theming.primaryColor
    }
    if (initialData.theming?.secondaryColor) {
      initialState['theme.secondaryColor'] = initialData.theming.secondaryColor
    }
    if (Array.isArray(initialData.meta?.tags)) {
      initialState['meta.tags'] = initialData.meta.tags.join(', ')
    }
    setDomains(
      Array.isArray(initialData.domains)
        ? initialData.domains.map(d => (typeof d === 'string' ? d : d.domain))
        : []
    )
    setDomainInput('')

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

  const handleAddDomain = async () => {
    const newDomain = domainInput.trim()
    if (!newDomain || domains.includes(newDomain)) return
    if (mode === 'edit') {
      setAddLoading(true)
      try {
        await addTenantDomain(initialData.code, [newDomain])
        setDomains(prev => [...prev, newDomain])
        setDomainInput('')
        toast && toast({ title: 'Domain added', description: `${newDomain} added successfully`, variant: 'success' })
      } catch (err) {
        toast && toast({ title: 'Failed to add domain', description: err.message || 'Check console for details', variant: 'destructive' })
        console.error(err)
      } finally {
        setAddLoading(false)
      }
    } else {
      setDomains(prev => [...prev, newDomain])
      setDomainInput('')
    }
  }
  const handleRemoveDomain = async (domain) => {
    if (mode === 'edit') {
      setRemoveLoadingDomain(domain)
      try {
        await removeTenantDomain(initialData.code, [domain])
        setDomains(prev => prev.filter(d => d !== domain))
        toast && toast({ title: 'Domain removed', description: `${domain} removed successfully`, variant: 'success' })
      } catch (err) {
        toast && toast({ title: 'Failed to remove domain', description: err.message || 'Check console for details', variant: 'destructive' })
        console.error(err)
      } finally {
        setRemoveLoadingDomain('')
      }
    } else {
      setDomains(prev => prev.filter(d => d !== domain))
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      const tags = typeof formData['meta.tags'] === 'string'
        ? formData['meta.tags'].split(',').map(t => t.trim()).filter(Boolean)
        : []

      const theming = {
        primaryColor: formData['theme.primaryColor'],
        ...(formData['theme.secondaryColor'] && {
          secondaryColor: formData['theme.secondaryColor'],
        }),
      }

      const payload = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        logo: formData.logo || '',
        theming,
        meta: { tags },
        domains: mode === 'edit' ? undefined : domains,
      }

      if (mode === 'edit') {
        await updateTenant(initialData.code, payload)
      } else {
        await createOrUpdateTenant(payload)
      }

      onAdd(payload)
      setOpen(false)
    } catch (err) {
      console.error(`❌ Failed to ${mode} tenant:`, err)
      alert(`Failed to ${mode} tenant. Check console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const renderGroupSection = (group) => {
    const domainField = group.fields.find(f => f.name === 'domain')

    return (
      <div
        key={group.label}
        className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-700">{group.label}</h3>
        <DynamicForm
          fields={group.fields.filter(f => f.name !== 'domain')}
          formData={formData}
          errors={errors}
          onChange={handleChange}
          mode={mode}
        />
        {domainField && (
          <div className="space-y-1 w-full">
            <label htmlFor="domain" className="font-medium text-gray-700">Domains</label>
            <div className="flex gap-2 items-center">
              <input
                id="domain"
                aria-label="Add domain"
                value={domainInput}
                onChange={e => setDomainInput(e.target.value)}
                placeholder={domainField.placeHolder}
                className="border rounded px-3 py-2 text-sm flex-1"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddDomain() } }}
              />
              <Button
                type="button"
                onClick={handleAddDomain}
                aria-label="Add domain"
                disabled={!domainInput.trim() || domains.includes(domainInput.trim()) || addLoading}
              >
                {addLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add'}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {domains.map(domain => (
                <span
                  key={domain}
                  className="inline-flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                >
                  {domain}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove domain ${domain}`}
                    className="ml-1 p-0.5 text-gray-500 hover:text-red-600"
                    onClick={() => handleRemoveDomain(domain)}
                    disabled={removeLoadingDomain === domain}
                  >
                    {removeLoadingDomain === domain ? <Loader2 className="animate-spin h-3 w-3" /> : <X className="h-3 w-3" />}
                  </Button>
                </span>
              ))}
            </div>
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
            {mode === 'edit' ? 'Edit Tenant' : 'Create New Tenant'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {formFields.map(field =>
            field.type === 'group' ? renderGroupSection(field) : null
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
              ) : (
                mode === 'edit' ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TenantCreateModal
