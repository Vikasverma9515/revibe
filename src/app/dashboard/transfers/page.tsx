import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  MapPin,
  Plus,
  Users,
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck
} from 'lucide-react'

interface Transfer {
  id: string
  employee_id: string
  employee_name: string
  transfer_type: 'merit' | 'request' | 'promotion'
  from_department: string
  to_department: string
  from_location: string
  to_location: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requested_at: string
  approved_at?: string
  effective_date?: string
  reviewer_comment?: string
}

export default function TransfersPage() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loadingTransfers, setLoadingTransfers] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      fetchTransfers()
    }
  }, [profile])

  const fetchTransfers = async () => {
    try {
      let query = supabase.from('transfers').select('*')

      // If employee, only show their own transfers
      if (profile?.role === 'employee') {
        query = query.eq('employee_id', profile.employee_id || profile.id)
      }
      // HR and Admin can see all transfers

      const { data, error } = await query.order('requested_at', { ascending: false })

      if (error) throw error
      setTransfers(data || [])
    } catch (error) {
      console.error('Error fetching transfers:', error)
    } finally {
      setLoadingTransfers(false)
    }
  }

  const getTransferTypeIcon = (type: string) => {
    switch (type) {
      case 'merit':
        return <Award className="w-5 h-5 text-blue-500" />
      case 'request':
        return <UserCheck className="w-5 h-5 text-green-500" />
      case 'promotion':
        return <FileText className="w-5 h-5 text-purple-500" />
      default:
        return <MapPin className="w-5 h-5 text-gray-500" />
    }
  }

  const getTransferTypeBadge = (type: string) => {
    switch (type) {
      case 'merit':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Merit-based</Badge>
      case 'request':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Request-based</Badge>
      case 'promotion':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Promotion</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const filterTransfersByType = (type: string) => {
    if (type === 'all') return transfers
    return transfers.filter(t => t.transfer_type === type)
  }

  if (loading || loadingTransfers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  // Only HR and Admin can access this page
  if (profile.role === 'employee') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access the transfers module.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Transfers</h1>
              <p className="text-gray-600">Manage merit-based, request-based, and promotion transfers</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transfers.filter(t => t.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transfers.filter(t => t.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transfers.filter(t => t.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{transfers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfers by Type */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Transfers</TabsTrigger>
            <TabsTrigger value="merit">Merit-based</TabsTrigger>
            <TabsTrigger value="request">Request-based</TabsTrigger>
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
          </TabsList>

          {['all', 'merit', 'request', 'promotion'].map((type) => (
            <TabsContent key={type} value={type}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {type === 'all' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      getTransferTypeIcon(type)
                    )}
                    <span>
                      {type === 'all' ? 'All Transfers' : `${type.charAt(0).toUpperCase() + type.slice(1)} Transfers`}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {type === 'all'
                      ? 'View all employee transfer requests and their status'
                      : `View ${type}-based transfer requests and their status`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filterTransfersByType(type).length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {type === 'all' ? '' : type + ' '}transfers found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {type === 'all'
                          ? 'No transfer requests have been submitted yet'
                          : `No ${type}-based transfer requests have been submitted yet`
                        }
                      </p>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Transfer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filterTransfersByType(type).map((transfer) => (
                        <div key={transfer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {getTransferTypeIcon(transfer.transfer_type)}
                                <h4 className="font-semibold text-gray-900">
                                  {transfer.employee_name} - {transfer.from_department} → {transfer.to_department}
                                </h4>
                                {getTransferTypeBadge(transfer.transfer_type)}
                                {getStatusBadge(transfer.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-gray-600">From Location</p>
                                  <p className="text-sm font-medium">{transfer.from_location}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">To Location</p>
                                  <p className="text-sm font-medium">{transfer.to_location}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Reason:</strong> {transfer.reason}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Requested: {new Date(transfer.requested_at).toLocaleDateString()}</span>
                                {transfer.effective_date && (
                                  <span>Effective: {new Date(transfer.effective_date).toLocaleDateString()}</span>
                                )}
                              </div>
                              {transfer.reviewer_comment && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                  <strong>Reviewer Comment:</strong> {transfer.reviewer_comment}
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}