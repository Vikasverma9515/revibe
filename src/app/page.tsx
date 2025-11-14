import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Building2,
  Award
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      title: 'Employee Self-Service',
      description: 'Access your personal information, update details, and manage your profile online.',
      icon: <Users className="w-8 h-8" />,
      color: 'text-blue-600'
    },
    {
      title: 'Salary & Pay Slips',
      description: 'View salary details, download pay slips, and track your compensation history.',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-green-600'
    },
    {
      title: 'Leave Management',
      description: 'Apply for leave online, track your leave balance, and view leave history.',
      icon: <Calendar className="w-8 h-8" />,
      color: 'text-orange-600'
    },
    {
      title: 'Service Records',
      description: 'Access your complete service history, promotions, and career progression.',
      icon: <FileText className="w-8 h-8" />,
      color: 'text-purple-600'
    },
    {
      title: 'Grievance Redressal',
      description: 'Submit complaints, track resolution status, and communicate with authorities.',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'text-red-600'
    },
    {
      title: 'Secure & Reliable',
      description: 'Bank-grade security with government-level data protection and privacy.',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-indigo-600'
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Active Employees' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
    { number: '100%', label: 'Secure' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">UP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Uttar Pradesh Government</h1>
                <p className="text-sm text-gray-600">Electronic Human Resource Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                <Award className="w-4 h-4 mr-1" />
                Government of Uttar Pradesh
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                eHRMS Portal
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Streamline your HR processes with our comprehensive Electronic Human Resource Management System.
                Manage employee data, salaries, leaves, and more with ease and security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    Access Portal
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive HR Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage human resources efficiently and effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of government employees already using eHRMS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">UP</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Uttar Pradesh Government</h3>
                  <p className="text-gray-400">Electronic Human Resource Management System</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Digitizing HR processes for efficient governance and employee satisfaction.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Government of Uttar Pradesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}