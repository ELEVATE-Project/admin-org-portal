import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  getMenteesList,
  listOrganizations,
  triggerPeriodicViewRefresh,
  triggerPeriodicViewRefreshUser,
  createOrg,
  deactivateOrg,
} from '../api/api'
import {
  Users,
  Building2,
  BarChart3,
  ArrowUpRight,
  ArrowDown,
  Plus,
  Search,
  ShieldMinus,
  RefreshCw,
  UserCog,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
/* import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table' */
import { Alert, AlertDescription } from '@/components/ui/alert'
/* import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' */
import { toast } from '@/hooks/use-toast'
import OrganizationsList from '@/components/OrganizationsList'

const DashboardPage = () => {
  // Declare state variables
  const [user, setUser] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [createOrgOpen, setCreateOrgOpen] = useState(false)
  const [listOrgOpen, setListOrgOpen] = useState(false)
  const [newOrganization, setNewOrganization] = useState({
    name: '',
    code: '',
    description: '',
    domains: '',
    admin_email: '',
  })
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'default',
  })
  const [organizations, setOrganizations] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showRowsPerPageSelector, setShowRowsPerPageSelector] = useState(false) // Added this state
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const token = localStorage.getItem('access_token')
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!token) {
      navigate('/login')
    } else {
      setUser(userData)
      fetchTotalUsers()
      fetchOrganizations()
    }
  }, [navigate, token])

  const fetchTotalUsers = async () => {
    try {
      const response = await getMenteesList(1) // Use the getMenteesList function

      setTotalUsers(response.data.result.count)
    } catch (err) {
      showNotification('Failed to fetch total users.', 'error')
    }
  }

  const fetchOrganizations = async () => {
    try {
      const res = await listOrganizations()
      setOrganizations(res.result.data)
    } catch (err) {
      console.log(err)
      showNotification('Failed to fetch organizations.', 'error')
    }
  }

  const showNotification = (message, type = 'default') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'default' }), 5000)
  }

  const refreshDatabaseViews = async () => {
    setIsRefreshing(true)
    try {
      // Make both API calls concurrently
      await Promise.all([triggerPeriodicViewRefresh(), triggerPeriodicViewRefreshUser()])

      showNotification('Database views refreshed successfully!', 'success')
    } catch (err) {
      showNotification('Failed to refresh database views.', 'error')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewOrganization(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const createOrganization = async () => {
    try {
      await createOrg(newOrganization)

      showNotification('Organization created successfully!', 'success')
      setCreateOrgOpen(false)
      setNewOrganization({
        name: '',
        code: '',
        description: '',
        domains: '',
        admin_email: '',
      })
      fetchOrganizations()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create Organization.'
      showNotification(errorMessage, 'error')
    }
  }

  const handleRowsPerPageChange = value => {
    setRowsPerPage(parseInt(value))
    setPage(0)
    fetchOrganizations()
  }

  const handleViewDetails = async org => {
    await deactivateOrg(org.id)
    showNotification('Organization deactivated successfully!', 'success')
    setCreateOrgOpen(false)
    setNewOrganization({
      name: '',
      code: '',
      description: '',
      domains: '',
      admin_email: '',
    })
    fetchOrganizations()
    console.log('Viewing details for organization:', org)
  }
  const actAsOrgAdmin = async org => {
    localStorage.setItem('custom_org', org.id)
    localStorage.setItem('custom_org_name', org.name || 'Default')

    toast({
      description: 'Acting as Org Admin for: ' + org.name,
    })
    window.location.reload()

    console.log('ORG ID SET::::', org.id)
  }
  const OrganizationAdminSwitch = ({ org, onAdminSwitch, disabled = false }) => {
    const [isLocallyDisabled, setIsLocallyDisabled] = useState(disabled)

    const handleAdminSwitch = () => {
      // Prevent multiple clicks
      if (isLocallyDisabled) return

      // Call the provided switch function
      onAdminSwitch(org)

      // Disable the button after click
      setIsLocallyDisabled(true)
    }

    if (isLocallyDisabled) {
      return (
        <div
          className="p-2 text-gray-400 cursor-not-allowed"
          title="Admin access already initiated">
          <Lock size={16} strokeWidth={1.5} />
        </div>
      )
    }

    return (
      <button
        onClick={handleAdminSwitch}
        className="p-2 rounded-lg hover:bg-blue-50 group"
        title="Act as Organization Admin">
        <UserCog className="text-gray-600 group-hover:text-blue-500" size={16} strokeWidth={1.5} />
      </button>
    )
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 p-6 dark:bg-dark-bg-primary">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}</h1>
            <p className="text-gray-500">Here's what's happening today.</p>
          </div>
          <Button onClick={() => setCreateOrgOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Organization
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 dark:bg-dark-bg-primary">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            trend="12"
            onClick={() => navigate('/users')}
          />
          <StatCard
            title="Organizations"
            value={organizations.length}
            icon={Building2}
            onClick={() => setListOrgOpen(true)}
          />
          <StatCard title="Active Sessions" value="24" icon={BarChart3} trend="8" />
          <StatCard
            title="Database Views"
            value="Refresh"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={refreshDatabaseViews}
            customContent={
              <Button
                className="w-full mt-4 justify-between"
                onClick={refreshDatabaseViews}
                disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    Refreshing...
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Refresh Views
                    <RefreshCw className="w-4 h-4" />
                  </>
                )}
              </Button>
            }
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across your organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-primary-50 rounded-full">
                    <Users className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-sm text-gray-500">2 minutes ago</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Organization Dialog */}
        <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <Input
                  name="name"
                  defaultValue={newOrganization.name}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input
                  name="code"
                  defaultValue={newOrganization.code}
                  onChange={handleInputChange}
                  placeholder="Enter organization code"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  name="description"
                  defaultValue={newOrganization.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Domains (comma-separated)</label>
                <Input
                  name="domains"
                  defaultValue={newOrganization.domains}
                  onChange={handleInputChange}
                  placeholder="domain1.com, domain2.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Email</label>
                <Input
                  name="admin_email"
                  defaultValue={newOrganization.admin_email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCreateOrgOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createOrganization}>Create Organization</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* List Organizations Dialog */}
        <OrganizationsList
          listOrgOpen={listOrgOpen}
          setListOrgOpen={setListOrgOpen}
          setCreateOrgOpen={setCreateOrgOpen}
          onViewDetails={handleViewDetails}
          onActAsOrgAdmin={actAsOrgAdmin}
          listOrganizations={listOrganizations} // Pass the API function
        />

        {/* Notification */}
        {notification.show && (
          <Alert
            className={`fixed bottom-4 right-4 w-96 z-50 ${
              notification.type === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  )
}
const StatCard = ({ title, value, icon: Icon, trend, onClick, isLoading, customContent }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className="text-sm text-green-500 flex items-center">
                +{trend}%
                <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
        <div className="p-3 bg-primary-50 rounded-full">
          <Icon className={`w-6 h-6 text-primary-500 ${isLoading ? 'animate-spin' : ''}`} />
        </div>
      </div>
      {customContent
        ? customContent
        : onClick && (
            <Button variant="ghost" className="w-full mt-4 justify-between" onClick={onClick}>
              View details
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          )}
    </CardContent>
  </Card>
)
/* const StatCard = ({ title, value, icon: Icon, trend, onClick }) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className="text-sm text-green-500 flex items-center">
                +{trend}%
                <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
        <div className="p-3 bg-primary-50 rounded-full">
          <Icon className="w-6 h-6 text-primary-500" />
        </div>
      </div>
      {onClick && (
        <Button
          variant="ghost"
          className="w-full mt-4 justify-between"
          onClick={onClick}
        >
          View details
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      )}
    </CardContent>
  </Card>
); */

export default DashboardPage
