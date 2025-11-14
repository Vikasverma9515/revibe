'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  User,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Briefcase,
  Users,
  Settings,
  Shield,
  LogOut,
  MapPin,
  BookOpen
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
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

  // Define all available features
  const getFeatures = () => {
    return [
      {
        title: 'Employee Profile',
        description: 'View and update your personal information',
        icon: <User className="w-6 h-6" />,
        href: '/dashboard/job-profile',
        color: 'bg-purple-500'
      },
      {
        title: 'Salary & Pay Slips',
        description: 'Access your salary details and pay slips',
        icon: <DollarSign className="w-6 h-6" />,
        href: '/dashboard/payroll',
        color: 'bg-green-500'
      },
      {
        title: 'Leave Management',
        description: 'Apply for leave and track your leave balance',
        icon: <Calendar className="w-6 h-6" />,
        href: '/dashboard/leave',
        color: 'bg-orange-500'
      },
      {
        title: 'HR Chatbot',
        description: 'Get instant support for HR queries and services',
        icon: <MessageSquare className="w-6 h-6" />,
        href: '/dashboard/chatbot',
        color: 'bg-purple-400'
      },
      {
        title: 'Correction Requests',
        description: 'Request corrections to your service records',
        icon: <FileText className="w-6 h-6" />,
        href: '/dashboard/correction-requests',
        color: 'bg-orange-500'
      },
      {
        title: 'Service Book',
        description: 'View your complete service history and promotions',
        icon: <BookOpen className="w-6 h-6" />,
        href: '/dashboard/service-book',
        color: 'bg-indigo-600'
      },
      {
        title: 'Payroll Management',
        description: 'Manage employee salaries and payroll processing',
        icon: <DollarSign className="w-6 h-6" />,
        href: '/dashboard/payroll',
        color: 'bg-purple-600'
      },
      {
        title: 'Job Profile Management',
        description: 'Update employee roles, departments, and responsibilities',
        icon: <Briefcase className="w-6 h-6" />,
        href: '/dashboard/job-profile',
        color: 'bg-purple-700'
      },
      {
        title: 'Promotion Management',
        description: 'Handle employee promotions and pay scale updates',
        icon: <TrendingUp className="w-6 h-6" />,
        href: '/dashboard/promotion',
        color: 'bg-purple-800'
      },
      {
        title: 'Salary Slip Update',
        description: 'Review and modify salary slip details',
        icon: <FileText className="w-6 h-6" />,
        href: '/dashboard/salary-slip-update',
        color: 'bg-purple-300'
      },
      {
        title: 'Employee Transfers',
        description: 'Manage merit-based, request-based, and promotion transfers',
        icon: <MapPin className="w-6 h-6" />,
        href: '/dashboard/transfers',
        color: 'bg-indigo-500'
      }
    ]
  }

  const features = getFeatures()

  const recentActivities = [
    { action: 'Leave application submitted', date: '2024-01-15', status: 'pending' },
    { action: 'Salary slip generated', date: '2024-01-01', status: 'completed' },
    { action: 'Profile updated', date: '2023-12-20', status: 'completed' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to eHRMS</h1>
              <p className="text-gray-600">Electronic Human Resource Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile.full_name || profile.email}</p>
                <p className="text-sm text-gray-500">
                  {profile.employee_id ? `Employee ID: ${profile.employee_id}` : profile.email}
                </p>
                <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Leave Balance</p>
                  <p className="text-2xl font-bold text-gray-900">12 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Salary</p>
                  <p className="text-2xl font-bold text-gray-900">₹45,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Service Years</p>
                  <p className="text-2xl font-bold text-gray-900">5.2 years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal & Departmental Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employee ID</p>
                  <p className="text-sm text-gray-900">{profile.employee_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-sm text-gray-900">{profile.full_name || profile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                  <p className="text-sm text-gray-900">{profile.date_of_birth || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Gender</p>
                  <p className="text-sm text-gray-900 capitalize">{profile.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-sm text-gray-900">{profile.phone || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-sm text-gray-900">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Departmental Information */}
          <Card>
            <CardHeader>
              <CardTitle>Departmental Information</CardTitle>
              <CardDescription>Your current role and department details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Designation</p>
                  <p className="text-sm text-gray-900">{profile.designation || 'Software Engineer'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-sm text-gray-900">{profile.department || 'IT Department'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-sm text-gray-900">{profile.location || 'Lucknow, UP'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Joining Date</p>
                  <p className="text-sm text-gray-900">{profile.joining_date || '2019-03-15'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Reporting Manager</p>
                  <p className="text-sm text-gray-900">{profile.reporting_manager || 'Mr. Rajesh Kumar'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Employee Type</p>
                  <p className="text-sm text-gray-900">{profile.employee_type || 'Permanent'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Administrator Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Administrator Contacts</CardTitle>
            <CardDescription>Important contacts for HR and administrative support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">HR Manager</h4>
                  <p className="text-sm text-gray-600">Ms. Priya Sharma</p>
                  <p className="text-xs text-gray-500">hr@up.gov.in</p>
                  <p className="text-xs text-gray-500">+91-522-1234567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Department Head</h4>
                  <p className="text-sm text-gray-600">Mr. Amit Singh</p>
                  <p className="text-xs text-gray-500">it.head@up.gov.in</p>
                  <p className="text-xs text-gray-500">+91-522-1234568</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">System Admin</h4>
                  <p className="text-sm text-gray-600">Mr. Vikram Patel</p>
                  <p className="text-xs text-gray-500">admin@up.gov.in</p>
                  <p className="text-xs text-gray-500">+91-522-1234569</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{feature.description}</CardDescription>
                <Button className="w-full" variant="outline">
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm font-medium">{activity.action}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{activity.date}</p>
                    <p className={`text-xs ${
                      activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}