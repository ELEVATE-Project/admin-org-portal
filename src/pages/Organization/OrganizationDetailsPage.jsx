import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { readOrganization } from '@/api/organizationApi'
import Layout from '@/components/Layout'
import OrganizationCreateModal from './OrganizationCreateModal'
import { Button } from '@/components/ui/button'
import { User, BadgeCheck, Palette, FileText } from 'lucide-react'
import { Loader2 } from 'lucide-react'

const OrganizationDetailsPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const [organization, setOrganization] = useState(location.state || null)
  const [editOpen, setEditOpen] = useState(false)
    const [loading, setLoading] = useState(true)

const fetchOrganization = async () => {
    setLoading(true)
    try {
       const data = await readOrganization(id)
       const org = data?.result ?? data
       if (org) {
         setOrganization(org)
       }
    } catch (error) {
      console.error('❌ Failed to load organization:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganization()
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
        </div>
      </Layout>
    )
  }

  if (!organization) {
    return (
      <Layout>
        <div className="text-center mt-20 text-red-500 text-lg font-medium">
          Organization not found
        </div>
      </Layout>
    )
  }


  const theming = organization.theming || {};
  const primaryColor = theming.primaryColor || '#1E40AF'
  const secondaryColor = theming.secondaryColor || null

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 shadow-md rounded-2xl mt-6 space-y-4">
        {/* Name & Code */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="rounded-lg bg-white px-4 py-2 flex items-center gap-2 shadow-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-lg">{organization.name}</span>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="rounded-lg bg-white px-4 py-2 flex items-center gap-2 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Code:</span> {organization.code}
            </div>
          </div>
        </div>

        {/* Tenant Code & Status */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="rounded-lg bg-white px-4 py-2 flex items-center gap-2 shadow-sm">
              <Palette className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Tenant Code:</span> {organization.tenant_code || 'N/A'}
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="rounded-lg bg-white px-4 py-2 flex items-center gap-2 shadow-sm">
              <Palette className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Status:</span>
              <span
                className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                  organization.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {organization.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-1 mb-2">
              <FileText className="w-5 h-5 text-gray-500" /> Description
            </h2>
            <span className="text-base text-gray-700 w-full">
              {organization.description || 'No description provided.'}
            </span>
          </div>
        {/* Theming */}
        {(primaryColor || secondaryColor) && (
          <div className="bg-white rounded-2xl border p-5 shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-1 mb-2">
              <Palette className="w-5 h-5 text-gray-500" /> Theming
            </h2>
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

        {/* Edit Button at the bottom, centered */}
        <div className="flex justify-center mt-2 mb-2">
          <Button className="w-fit" onClick={() => setEditOpen(true)}>
            Edit Organization
          </Button>
        </div>

        {/* Edit Organization Modal */}
        <OrganizationCreateModal
          open={editOpen}
          setOpen={setEditOpen}
          mode="edit"
          initialData={organization}
          onAdd={() => {
            fetchOrganization()
            setEditOpen(false)
          }}
        />
      </div>
    </Layout>
  )
}

export default OrganizationDetailsPage