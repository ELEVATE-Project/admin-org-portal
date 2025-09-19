import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { readOrganization } from '@/api/organizationApi'
import Layout from '@/components/Layout'
import OrganizationCreateModal from './OrganizationCreateModal'
import { Button } from '@/components/ui/button'
import { User, BadgeCheck, Palette, FileText, Users, Settings, ArrowRight } from 'lucide-react'
import { Loader2 } from 'lucide-react'

const OrganizationDetailsPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
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
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-md rounded-2xl mt-6 space-y-6">
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

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Management Card */}
          <div className="group bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors duration-300">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Role Management</h3>
                <p className="text-gray-500">Manage user roles and permissions</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/organizations/${id}/roles`)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              Manage Roles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Edit Organization Card */}
          <div className="group bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors duration-300">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Organization Settings</h3>
                <p className="text-gray-500">Edit organization details and settings</p>
              </div>
            </div>
            <Button 
              onClick={() => setEditOpen(true)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <Settings className="w-5 h-5 mr-2" />
              Edit Organization
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
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