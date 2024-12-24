import React, { useEffect, useState } from 'react'
//import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getMenteesList, deleteUserFromBoth, addOrgAdmin } from '../api/api'
import { Search, Trash2, Shield, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'

const AllUsersPage = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  //const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  const fetchAllUsers = async () => {
    try {
      setLoading(true)
      const response = await getMenteesList(limit, page, search)
      setUsers(response.data.result.data)
      setTotalUsers(response.data.result.count)
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users.',
        variant: 'destructive',
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [token, page, search])

  const deleteUser = async userId => {
    try {
      await deleteUserFromBoth(userId)
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      })
      fetchAllUsers()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      })
      console.error(err)
    }
  }

  const assignOrgAdmin = async (userEmail, orgId) => {
    try {
      await addOrgAdmin(userEmail, orgId)
      toast({
        title: 'Success',
        description: 'User assigned as Org Admin successfully!',
        variant: 'success',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error assigning Org Admin.',
        variant: 'destructive',
      })
      console.error(err)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Active Users</h1>
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.user_roles.map(role => (
                        <span
                          key={role.title}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-1">
                          {role.title}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>{user.organization.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            assignOrgAdmin(user.email, user.organization.organization_id)
                          }
                          className="p-2 rounded-lg hover:bg-gray-50"
                          title="Assign Org Admin">
                          <Shield className="h-5 w-5 text-green-600" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-gray-50"
                          title="Delete User">
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <span className="text-gray-500">No users found for the given criteria.</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between py-3 px-6">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {Math.ceil(totalUsers / limit)}
            </span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * limit >= totalUsers}
              className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AllUsersPage
