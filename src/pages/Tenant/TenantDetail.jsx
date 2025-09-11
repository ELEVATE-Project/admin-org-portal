import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getTenantByCode } from '@/api/tenantApi'
import Layout from '@/components/Layout'
import TenantCreateModal from '@/pages/Tenant/TenantCreateModal'
import { Button } from '@/components/ui/button'
import { User, BadgeCheck, Palette, Globe, Users,FileText, XCircle } from 'lucide-react'

const TenantDetail = () => {
  const { code } = useParams()
  const location = useLocation()
  const [tenant, setTenant] = useState(location.state || null)
  const [editOpen, setEditOpen] = useState(false)

  const fetchTenant = async () => {
    try {
      const { result } = await getTenantByCode(code)
      if (result) {
         if (result.code !== code) {
           setTenant(prev => ({
             ...(prev || {}),
             _apiData: result
           }))
        } else {
          setTenant(result)
        }
      }
    } catch (error) {
      console.error('❌ Failed to load tenant:', error)
    }
  }

  useEffect(() => {
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

  const theming = tenant.theming || {}
   const primaryColor = theming.primaryColor || null
   const secondaryColor = theming.secondaryColor || null
   const hasTheming = Boolean(primaryColor || secondaryColor)
return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-md rounded-2xl mt-4 space-y-6">
        {/* Top Card: Name, Code, Status, Logo */}
        <div className="bg-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border">
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <div className="rounded-lg bg-gray-50 px-4 py-2 flex items-center gap-2 shadow-sm w-fit">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-lg">{tenant.name}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <div className="rounded-lg bg-gray-50 px-4 py-1 flex items-center gap-2 shadow-sm w-fit">
                <BadgeCheck className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Code:</span> {tenant.code}
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-1 flex items-center gap-2 shadow-sm w-fit">
                <Palette className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Status:</span>
                <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {tenant.status}
                </span>
              </div>
            </div>
          </div>
          {tenant.logo && (
            <div className="flex-shrink-0 flex justify-center md:justify-end">
              <img
                src={tenant.logo}
                alt="Tenant Logo"
                className="h-28 w-28 object-contain rounded-xl border-2 border-gray-200 bg-white shadow"
              />
            </div>
          )}
        </div>
        {/* Description */}
        <div className="bg-white rounded-2xl border p-6 min-h-[90px] shadow-sm">
          <div className="flex items-center gap-2 border-b pb-1 mb-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Description</h2>
          </div>
          <span className="text-base text-gray-700"> 
            {tenant.description || 'No description provided.'}
          </span>
        </div>

        {/* Domains */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-1 mb-2">
            <Globe className="w-5 h-5 text-gray-500" /> Domains
          </h2>
          {tenant.domains?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tenant.domains.map((d, i) => (
                <span key={i} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm
                  ${d.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {d.domain}
                  {d.verified ? <BadgeCheck className="w-3 h-3 text-gray-500" /> : <XCircle className="w-3 h-3 text-gray-500" />}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">No domains added.</span>
          )}
        </div>
        {/* Organizations */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-1 mb-2">
            <Users className="w-5 h-5 text-gray-500" /> Organizations
          </h2>
          {tenant.organizations?.length > 0 ? (
            <ul className="list-disc ml-6 text-sm">
              {tenant.organizations.map((org, i) => (
                <li key={i}>{org.name} ({org.code})</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400 text-sm">No organizations added.</span>
          )}
        </div>

        {/* Theming */}
        {hasTheming && (
          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-1 mb-2">
              <Palette className="w-5 h-5 text-gray-500" /> Theming
            </h2>
            <div className="flex flex-wrap gap-6">
              {primaryColor && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Primary:</span>
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: primaryColor }}></div>
                  <code className="text-xs">{primaryColor}</code>
                </div>
              )}
              {secondaryColor && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Secondary:</span>
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: secondaryColor }}></div>
                  <code className="text-xs">{secondaryColor}</code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Button at the bottom, centered */}
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => setEditOpen(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Edit Tenant
          </Button>
        </div>

        {/* Edit Tenant Modal */}
        <TenantCreateModal
          open={editOpen}
          setOpen={setEditOpen}
          mode="edit"
          initialData={{
            ...tenant,
            _realCode: tenant._apiData?.code || tenant.code
          }}
          onAdd={() => {
            fetchTenant()
            setEditOpen(false)
          }}
        />
      </div>
    </Layout>
  )
}

export default TenantDetail