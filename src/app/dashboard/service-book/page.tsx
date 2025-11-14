'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Download,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Clock
} from 'lucide-react'

interface ServiceRecord {
  id: string
  employee_id: string
  record_type: 'joining' | 'promotion' | 'transfer' | 'training' | 'appraisal' | 'disciplinary'
  title: string
  description: string
  effective_date: string
  document_url?: string
  metadata: {
    previous_role?: string
    new_role?: string
    previous_salary?: number
    new_salary?: number
    previous_location?: string
    new_location?: string
    training_type?: string
    appraisal_rating?: string
    disciplinary_action?: string
  }
}

interface CareerSummary {
  total_service_years: number
  current_designation: string
  current_department: string
  current_location: string
  total_promotions: number
  last_appraisal_date?: string
  last_appraisal_rating?: string
}

export default function ServiceBookPage() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])
  const [careerSummary, setCareerSummary] = useState<CareerSummary | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      fetchServiceBookData()
    }
  }, [profile])

  const fetchServiceBookData = async () => {
    try {
      // Fetch service records
      const { data: recordsData, error: recordsError } = await supabase
        .from('service_records')
        .select('*')
        .eq('employee_id', profile?.employee_id || profile?.id)
        .order('effective_date', { ascending: false })

      if (recordsError) throw recordsError
      setServiceRecords(recordsData || [])

      // Calculate career summary
      const summary: CareerSummary = {
        total_service_years: 5.2, // This would be calculated from joining date
        current_designation: profile?.designation || 'Software Engineer',
        current_department: profile?.department || 'IT Department',
        current_location: profile?.location || 'Lucknow, UP',
        total_promotions: recordsData?.filter(r => r.record_type === 'promotion').length || 2,
        last_appraisal_date: '2024-01-15',
        last_appraisal_rating: 'Excellent'
      }
      setCareerSummary(summary)
    } catch (error) {
      console.error('Error fetching service book data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'joining':
        return <GraduationCap className="w-5 h-5 text-green-500" />
      case 'promotion':
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      case 'transfer':
        return <MapPin className="w-5 h-5 text-purple-500" />
      case 'training':
        return <BookOpen className="w-5 h-5 text-orange-500" />
      case 'appraisal':
        return <Award className="w-5 h-5 text-yellow-500" />
      case 'disciplinary':
        return <FileText className="w-5 h-5 text-red-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getRecordTypeBadge = (type: string) => {
    const colors = {
      joining: 'bg-green-100 text-green-800',
      promotion: 'bg-blue-100 text-blue-800',
      transfer: 'bg-purple-100 text-purple-800',
      training: 'bg-orange-100 text-orange-800',
      appraisal: 'bg-yellow-100 text-yellow-800',
      disciplinary: 'bg-red-100 text-red-800'
    }
    return <Badge variant="secondary" className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
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
              <h1 className="text-2xl font-bold text-gray-900">Service Book</h1>
              <p className="text-gray-600">Your complete service history and career progression</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Career Summary */}
        {careerSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Service</p>
                    <p className="text-2xl font-bold text-gray-900">{careerSummary.total_service_years} years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Role</p>
                    <p className="text-lg font-semibold text-gray-900">{careerSummary.current_designation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                    <p className="text-2xl font-bold text-gray-900">{careerSummary.total_promotions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Appraisal</p>
                    <p className="text-sm font-semibold text-gray-900">{careerSummary.last_appraisal_rating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Records */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="promotion">Promotions</TabsTrigger>
            <TabsTrigger value="transfer">Transfers</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="appraisal">Appraisals</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          {['all', 'promotion', 'transfer', 'training', 'appraisal', 'other'].map((filter) => (
            <TabsContent key={filter} value={filter}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>
                      {filter === 'all' ? 'All Service Records' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Records`}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {filter === 'all'
                      ? 'Complete history of your service records'
                      : `View your ${filter} records and milestones`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {serviceRecords.filter(r => filter === 'all' ||
                    (filter === 'other' ? !['promotion', 'transfer', 'training', 'appraisal'].includes(r.record_type) : r.record_type === filter)
                  ).length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {filter} records found
                      </h3>
                      <p className="text-gray-600">
                        {filter === 'all'
                          ? 'Your service records will appear here'
                          : `No ${filter} records have been recorded yet`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {serviceRecords
                        .filter(r => filter === 'all' ||
                          (filter === 'other' ? !['promotion', 'transfer', 'training', 'appraisal'].includes(r.record_type) : r.record_type === filter)
                        )
                        .map((record) => (
                        <div key={record.id} className="border-l-4 border-purple-500 pl-6 pb-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {getRecordTypeIcon(record.record_type)}
                                <h4 className="font-semibold text-gray-900">{record.title}</h4>
                                {getRecordTypeBadge(record.record_type)}
                              </div>
                              <p className="text-gray-600 mb-3">{record.description}</p>

                              {/* Record-specific details */}
                              {record.record_type === 'promotion' && record.metadata && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm text-gray-600">Previous Role</p>
                                    <p className="text-sm font-medium">{record.metadata.previous_role}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">New Role</p>
                                    <p className="text-sm font-medium">{record.metadata.new_role}</p>
                                  </div>
                                  {record.metadata.previous_salary && record.metadata.new_salary && (
                                    <>
                                      <div>
                                        <p className="text-sm text-gray-600">Previous Salary</p>
                                        <p className="text-sm font-medium">{formatCurrency(record.metadata.previous_salary)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">New Salary</p>
                                        <p className="text-sm font-medium">{formatCurrency(record.metadata.new_salary)}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}

                              {record.record_type === 'transfer' && record.metadata && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm text-gray-600">From Location</p>
                                    <p className="text-sm font-medium">{record.metadata.previous_location}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">To Location</p>
                                    <p className="text-sm font-medium">{record.metadata.new_location}</p>
                                  </div>
                                </div>
                              )}

                              {record.record_type === 'training' && record.metadata && (
                                <div className="mb-3">
                                  <p className="text-sm text-gray-600">Training Type</p>
                                  <p className="text-sm font-medium">{record.metadata.training_type}</p>
                                </div>
                              )}

                              {record.record_type === 'appraisal' && record.metadata && (
                                <div className="mb-3">
                                  <p className="text-sm text-gray-600">Appraisal Rating</p>
                                  <p className="text-sm font-medium">{record.metadata.appraisal_rating}</p>
                                </div>
                              )}

                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(record.effective_date).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                                {record.document_url && (
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Document
                                  </Button>
                                )}
                              </div>
                            </div>
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