import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTenantByCode, createOrUpdateTenant } from '@/api/tenantApi'
import Layout from '@/components/Layout'
import tenantFormJson from '@/forms/tenantCreateForm.json'
import DynamicForm from '@/components/ui/DynamicForm'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const EditTenant = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [flatFields, setFlatFields] = useState([])
  const [formGroups, setFormGroups] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Flatten form structure
  const flattenFields = (fields) => {
    return fields.flatMap(field => {
      if (field.type === 'group') {
        return flattenFields(field.fields)
      }
      return field
    })
  }

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const { result } = await getTenantByCode(code)
        if (result) {
          const config = tenantFormJson?.data || []
          const flattened = flattenFields(config)

          const initialState = flattened.reduce((acc, field) => {
            const key = field.name
            switch (key) {
              case 'theme.primaryColor':
                acc[key] = result.theming?.primaryColor || ''
                break
              case 'theme.secondaryColor':
                acc[key] = result.theming?.secondaryColor || ''
                break
              case 'meta.tags':
                acc[key] = result.meta?.tags?.join(', ') || ''
                break
              case 'domain':
                acc[key] = result.domains?.[0] || ''
                break
              default:
                acc[key] = result[key] || ''
            }
            return acc
          }, {})

          setFormData(initialState)
          setFlatFields(flattened)
          setFormGroups(config)
        }
      } catch (err) {
        console.error('Failed to load tenant:', err)
      } finally {
        setInitializing(false)
      }
    }

    loadTenant()
  }, [code])

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    flatFields.forEach(field => {
      const value = formData[field.name]
      if (field.validators?.required && !value) {
        errs[field.name] = field.errorMessage?.required || 'This field is required'
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
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
        primaryColor: formData['theme.primaryColor'],
      }
      if (formData['theme.secondaryColor']) {
        theming.secondaryColor = formData['theme.secondaryColor']
      }

      const tenantData = {
        name: formData.name,
        code, // fixed; do not update
        description: formData.description,
        logo: formData.logo || '',
        theming,
        meta: { tags },
        domains: [formData.domain?.trim()],
      }

      await createOrUpdateTenant(tenantData)
      navigate(`/tenant/${code}`)
    } catch (err) {
      console.error('❌ Failed to update tenant:', err)
      alert('Update failed. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
          <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading tenant data...
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Tenant: {code}</h1>
        </div>

        {formGroups.map((group, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-700">{group.label}</h3>
            <DynamicForm
              fields={group.fields.map(field => ({
                ...field,
                disabled: field.name === 'code',
              }))}
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Updating...
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default EditTenant
