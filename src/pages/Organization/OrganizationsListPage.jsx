import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { getAllTenants } from '@/api/tenantApi'
import { getOrganizationsByTenant } from '@/api/organizationApi'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrganizationCreateModal from './OrganizationCreateModal'

const OrganizationsListPage = () => {
  const [tenants, setTenants] = useState([])
  const [selectedTenant, setSelectedTenant] = useState('')
  const [organizations, setOrganizations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const navigate = useNavigate()
  const rowsPerPage = 10

  useEffect(() => {
    const fetchTenantsAndSelectFirst = async () => {
      const tenantsList = await getAllTenants()
      setTenants(tenantsList)

      if (tenantsList.length > 0) {
        const firstTenantCode = tenantsList[0].code
        setSelectedTenant(firstTenantCode)
        fetchOrganizations(firstTenantCode, 1)
      }
    }

    fetchTenantsAndSelectFirst()
  }, [])

   const fetchOrganizations = async (tenantCode, page = 1) => {
     try {
       const res = await getOrganizationsByTenant({ tenantCode, page, limit: rowsPerPage })
       const list = Array.isArray(res?.result) ? res.result : []
       const totalCount = Number(res?.meta?.totalCount) || 0
       setOrganizations(list)
       setTotalPages(Math.max(1, Math.ceil(totalCount / rowsPerPage)))
     } catch (err) {
       console.error('❌ Failed to fetch orgs:', err)
       setOrganizations([])
       setTotalPages(1)
     }
   }

  const handleViewOrganization = (orgId) => {
    navigate(`/organizations/${orgId}`)
  }

  useEffect(() => {
    if (selectedTenant) {
      fetchOrganizations(selectedTenant, currentPage)
    }
  }, [selectedTenant, currentPage])

  const handleTenantChange = (tenantCode) => {
    setSelectedTenant(tenantCode)
    setCurrentPage(1)
  }

  const handleAddOrganization = () => {
    setCreateOpen(true)
  }

  const handleOrganizationCreated = () => {
    // Refresh the organizations list
    if (selectedTenant) {
      fetchOrganizations(selectedTenant, currentPage)
    }
    setCreateOpen(false)
  }

  const getSelectedTenantName = () => {
    const tenant = tenants.find(t => t.code === selectedTenant)
    return tenant ? tenant.name : 'Unknown Tenant'
  }

  return (
    <Layout>
      
      <div className="p-6 w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Organizations by Tenant</h2>
          {selectedTenant && (
            <Button 
              onClick={handleAddOrganization} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Organization
            </Button>
          )}
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Tenant to view its Organizations
            </label>
            <Select value={selectedTenant} onValueChange={handleTenantChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t.code} value={t.code}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        {selectedTenant && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.length ? (
                  organizations.map((org) => (
                    <TableRow key={org.code}>
                      <TableCell>{org.name}</TableCell>
                      <TableCell>{org.code}</TableCell>
                      <TableCell className="max-w-xs truncate">{org.description || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrganization(org.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No organizations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                 disabled={currentPage <= 1}
                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              <span className="px-2 py-1 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Create Organization Modal */}
        <OrganizationCreateModal
          open={createOpen}
          setOpen={setCreateOpen}
          mode="create"
          selectedTenant={selectedTenant}
          onAdd={handleOrganizationCreated}
        />
      </div>
    </Layout>
  )
}

export default OrganizationsListPage