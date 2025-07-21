import React, { useEffect, useCallback, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Eye } from 'lucide-react'
import { getAllTenants } from '@/api/tenantApi'

import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'
import TenantCreateModal from './TenantCreateModal'


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>
      {pageNumbers.map(number => (
        <Button
          key={number}
          variant={currentPage === number ? 'default' : 'outline'}
          onClick={() => onPageChange(number)}>
          {number}
        </Button>
      ))}
      <Button variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  )
}

// Main Page
const TenantsPage = () => {
  const [tenants, setTenants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const navigate = useNavigate()

  const fetchTenants = useCallback(async () => {
    try {
      const data = await getAllTenants()
      setTenants(data)
    } catch (error) {
      console.error('❌ Failed to fetch tenants:', error)
    }
  }, [])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const filteredTenants = tenants.filter(
    tenant =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredTenants.length / rowsPerPage)

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Handle View
  const handleView = (tenantCode) => {
    const tenant = tenants.find(t => t.code === tenantCode)
    navigate(`/tenants/${tenantCode}`, { state: tenant })
  }

  // Handle Add Tenant
  const [createModalOpen, setCreateModalOpen] = useState(false)

const handleAddTenant = (newTenantFromAPI) => {
  setTenants(prev => [...prev, newTenantFromAPI])
}



  return (
    <Layout>
      <div className="p-6 w-full">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tenants</h2>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) 
              }}
              className="w-64"
            />

            <Select
              value={rowsPerPage.toString()}
              onValueChange={val => {
                setRowsPerPage(Number(val))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTenants.length > 0 ? (
                paginatedTenants.map((tenant, index) => (
                  <TableRow key={tenant.code || index}>
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{tenant.code}</TableCell>
                    <TableCell className="max-w-xs truncate">{tenant.description || 'N/A'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(tenant.code)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No tenants found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <TenantCreateModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        onAdd={handleAddTenant}
      />

      
    </Layout>
  )
}

export default TenantsPage
