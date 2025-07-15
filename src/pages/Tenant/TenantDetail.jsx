import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getTenantByCode } from '@/api/tenantApi'
import Layout from '@/components/Layout'
import TenantCreateModal from '@/pages/Tenant/TenantCreateModal'
import { Button } from '@/components/ui/button'

const TenantDetail = () => {
  const { code } = useParams()
  const location = useLocation()
  const [tenant, setTenant] = useState(location.state || null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const { result } = await getTenantByCode(code)
        console.log('🎯 Tenant Result:', result)
        if (result) setTenant(result)
      } catch (error) {
        console.error('❌ Failed to load tenant:', error)
      }
    }

    fetchTenant()
  }, [code])

  if (!tenant) {
    return (
      <Layout>
        <div className="text-center mt-20 text-red-500 text-lg font-medium">
          Tenant not found
        </div>
      </Layout>
    )
  }

  const { theming = {} } = tenant
  const primaryColor = theming.primaryColor || '#1E40AF'
  const secondaryColor = theming.secondaryColor || null

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Tenant Details</h1>
          <Button onClick={() => setEditOpen(true)}>Edit Tenant</Button>
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold border-b pb-1">Basic Information</h2>
          <div><strong>Name:</strong> {tenant.name}</div>
          <div><strong>Code:</strong> {tenant.code}</div>
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <span
              className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {tenant.status}
            </span>
          </div>
          <div><strong>Description:</strong> {tenant.description || 'N/A'}</div>

          {tenant.logo && (
            <div>
              <strong>Logo:</strong>
              <img src={tenant.logo} alt="Tenant Logo" className="h-12 mt-1 border rounded" />
            </div>
          )}
        </div>

        {/* Domains */}
        {tenant.domains?.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold border-b pb-1">Domains</h2>
            <ul className="list-disc ml-6 text-sm">
              {tenant.domains.map((d, i) => (
                <li key={i}>
                  {d.domain}{' '}
                  <span className={d.verified ? 'text-green-600' : 'text-red-600'}>
                    ({d.verified ? '✅ Verified' : '❌ Not Verified'})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Organizations */}
        {tenant.organizations?.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold border-b pb-1">Organizations</h2>
            <ul className="list-disc ml-6 text-sm">
              {tenant.organizations.map((org, i) => (
                <li key={i}>{org.name} ({org.code})</li>
              ))}
            </ul>
          </div>
        )}

        {/* Theming */}
        {(primaryColor || secondaryColor) && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold border-b pb-1">Theming</h2>
            <div className="flex flex-wrap gap-6">
              {primaryColor && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Primary:</span>
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <code className="text-xs">{primaryColor}</code>
                </div>
              )}
              {secondaryColor && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Secondary:</span>
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <code className="text-xs">{secondaryColor}</code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold border-b pb-1">Meta</h2>
          <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap break-words">
            {JSON.stringify(tenant.meta || {}, null, 2)}
          </pre>
        </div>

        {/* Timestamps */}
        <div className="text-sm text-gray-600 pt-2">
          <div><strong>Created At:</strong> {tenant.created_at ? new Date(tenant.created_at).toLocaleString('en-IN') : 'N/A'}</div>
          <div><strong>Updated At:</strong> {tenant.updated_at ? new Date(tenant.updated_at).toLocaleString('en-IN') : 'N/A'}</div>
        </div>
      </div>

      {/* Edit Tenant Modal */}
      <TenantCreateModal
        open={editOpen}
        setOpen={setEditOpen}
        mode="edit"
        initialData={tenant}
        onAdd={(updatedTenant) => {
          setTenant(updatedTenant)
          setEditOpen(false)
        }}
      />
    </Layout>
  )
}

export default TenantDetail
