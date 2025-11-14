import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  CalendarDays,
  UserCheck,
  RotateCcw
} from 'lucide-react'

interface LeaveApplication {
  id: string
  employee_id: string
  leave_type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency'
  start_date: string
  end_date: string
  days_requested: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  applied_at: string
  approved_at?: string
  approved_by?: string
  reviewer_comment?: string
}

interface LeaveBalance {
  annual: number
  sick: number
  maternity: number
  paternity: number
  emergency: number
}

export default function LeavePage() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const [applications, setApplications] = useState<LeaveApplication[]>([])
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>({
    annual: 30,
    sick: 12,
    maternity: 180,
    paternity: 15,
    emergency: 5
  })
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      fetchLeaveData()
    }
  }, [profile])

  const fetchLeaveData = async () => {
    try {
      // Fetch leave applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('leave_applications')
        .select('*')
        .eq('employee_id', profile?.employee_id || profile?.id)
        .order('applied_at', { ascending: false })

      if (applicationsError) throw applicationsError
      setApplications(applicationsData || [])

      // Fetch leave balance (this would come from a leave_balances table in real implementation)
      // For now, using mock data
      setLeaveBalance({
        annual: 30,
        sick: 12,
        maternity: profile?.gender === 'female' ? 180 : 0,
        paternity: profile?.gender === 'male' ? 15 : 0,
        emergency: 5
      })
    } catch (error) {
      console.error('Error fetching leave data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      annual: 'bg-green-100 text-green-800',
      sick: 'bg-red-100 text-red-800',
      maternity: 'bg-pink-100 text-pink-800',
      paternity: 'bg-blue-100 text-blue-800',
      emergency: 'bg-orange-100 text-orange-800'
    }
    return <Badge variant="secondary" className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
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
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const calculateUsedLeaves = (type: string) => {
    return applications
      .filter(app => app.leave_type === type && app.status === 'approved')
      .reduce((total, app) => total + app.days_requested, 0)
  }

  if (loading || loadingData) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-gray-600">Apply for leave, track balances, and manage requests</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Apply for Leave
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {Object.entries(leaveBalance).map(([type, total]) => {
            const used = calculateUsedLeaves(type)
            const remaining = total - used
            return (
              <Card key={type}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CalendarDays className="w-8 h-8 text-purple-600" />
                    <Badge variant="outline" className="text-xs">
                      {remaining} left
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 capitalize mb-1">
                    {type === 'maternity' ? 'Maternity' : type === 'paternity' ? 'Paternity' : type}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{remaining}</div>
                  <div className="text-xs text-gray-600">
                    Used: {used} / Total: {total}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Leave Applications</TabsTrigger>
            <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
            <TabsTrigger value="requests">Special Requests</TabsTrigger>
          </TabsList>

          {/* Leave Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Your Leave Applications</CardTitle>
                <CardDescription>
                  View and track the status of your leave applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leave applications yet</h3>
                    <p className="text-gray-600 mb-4">
                      Submit your first leave application to get started
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Apply for Leave
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(application.status)}
                              <h4 className="font-semibold text-gray-900">
                                {application.days_requested} days - {application.leave_type} leave
                              </h4>
                              {getLeaveTypeBadge(application.leave_type)}
                              {getStatusBadge(application.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Start Date</p>
                                <p className="text-sm font-medium">
                                  {new Date(application.start_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">End Date</p>
                                <p className="text-sm font-medium">
                                  {new Date(application.end_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Reason:</strong> {application.reason}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                              {application.approved_at && (
                                <span>Approved: {new Date(application.approved_at).toLocaleDateString()}</span>
                              )}
                            </div>
                            {application.reviewer_comment && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                <strong>Reviewer Comment:</strong> {application.reviewer_comment}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {application.status === 'pending' && (
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Leave Calendar</CardTitle>
                <CardDescription>
                  View upcoming leaves and holidays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View Coming Soon</h3>
                  <p className="text-gray-600">
                    This feature will show a calendar view of your leaves and company holidays.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Special Requests Tab */}
          <TabsContent value="requests">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span>Joining Report</span>
                  </CardTitle>
                  <CardDescription>
                    Submit your joining report after leave
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Submit a joining report when you return from leave to document your activities.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Submit Joining Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                    <span>Extension Request</span>
                  </CardTitle>
                  <CardDescription>
                    Request extension for approved leave
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    If you need to extend your approved leave, submit an extension request.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Request Extension
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}