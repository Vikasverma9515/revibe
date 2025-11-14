import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  User,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Briefcase
} from 'lucide-react'

export default function DashboardPage() {
  const features = [
    {
      title: 'Employee Profile',
      description: 'View and update your personal information',
      icon: <User className="w-6 h-6" />,
      href: '/dashboard/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'Salary & Pay Slips',
      description: 'Access your salary details and pay slips',
      icon: <DollarSign className="w-6 h-6" />,
      href: '/dashboard/salary',
      color: 'bg-green-500'
    },
    {
      title: 'Salary Slip Update',
      description: 'Review and modify salary slip details',
      icon: <FileText className="w-6 h-6" />,
      href: '/dashboard/salary-slip-update',
      color: 'bg-cyan-500'
    },
    {
      title: 'Leave Management',
      description: 'Apply for leave and track your leave balance',
      icon: <Calendar className="w-6 h-6" />,
      href: '/dashboard/leave',
      color: 'bg-orange-500'
    },
    {
      title: 'Payroll Management',
      description: 'Manage employee salaries and payroll processing',
      icon: <DollarSign className="w-6 h-6" />,
      href: '/dashboard/payroll',
      color: 'bg-teal-500'
    },
    {
      title: 'Job Profile Management',
      description: 'Update employee roles, departments, and responsibilities',
      icon: <Briefcase className="w-6 h-6" />,
      href: '/dashboard/job-profile',
      color: 'bg-yellow-500'
    },
    {
      title: 'Promotion Management',
      description: 'Handle employee promotions and pay scale updates',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/dashboard/promotion',
      color: 'bg-pink-500'
    },
    {
      title: 'HR Chatbot',
      description: 'Get instant support for HR queries and services',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/dashboard/chatbot',
      color: 'bg-indigo-500'
    },
    {
      title: 'Service Records',
      description: 'View your service history and documents',
      icon: <FileText className="w-6 h-6" />,
      href: '/dashboard/records',
      color: 'bg-purple-500'
    },
    {
      title: 'Grievance Redressal',
      description: 'Submit complaints and track resolution',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/dashboard/grievance',
      color: 'bg-red-500'
    },
    {
      title: 'Performance Reports',
      description: 'View your performance evaluations',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/dashboard/performance',
      color: 'bg-indigo-500'
    }
  ]

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
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">Employee ID: UP/2024/001</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
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