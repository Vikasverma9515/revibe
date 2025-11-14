'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/contexts/UserContext'
import {
  Edit,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calculator,
  Loader2
} from 'lucide-react'

interface SalarySlip {
  id: string
  employee_id: string
  month: number
  year: number
  basic_salary: number
  hra: number | null
  conveyance: number | null
  lta: number | null
  medical: number | null
  other_allowances: number | null
  gross_salary: number
  provident_fund: number | null
  professional_tax: number | null
  income_tax: number | null
  other_deductions: number | null
  total_deductions: number | null
  net_salary: number
  status: string
  profiles?: {
    full_name: string
    employee_id: string
    department: string
  }
  notes?: string
}

export default function SalarySlipUpdatePage() {
  const { profile } = useUser()
  const [editingSlip, setEditingSlip] = useState<string | null>(null)
  const [slipData, setSlipData] = useState<SalarySlip[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile && (profile.role === 'hr' || profile.role === 'admin')) {
      fetchSalarySlips()
    } else {
      setLoading(false)
    }
  }, [profile])

  // Only allow HR and Admin roles
  if (profile && profile.role !== 'hr' && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access salary slip updates.</p>
        </div>
      </div>
    )
  }

  const fetchSalarySlips = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('salary_slips')
        .select(`
          *,
          profiles!inner(full_name, employee_id, department)
        `)
        .in('status', ['draft', 'pending_approval'])
        .order('created_at', { ascending: false })

      if (error) throw error
      setSlipData(data || [])
    } catch (error) {
      console.error('Error fetching salary slips:', error)
      alert('Failed to load salary slips')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (slip: SalarySlip) => {
    setEditingSlip(slip.id)
  }

  const handleSave = async (slipId: string) => {
    if (!profile) return

    try {
      setSaving(true)
      const slip = slipData.find(s => s.id === slipId)
      if (!slip) return

      // Calculate new totals
      const basic = slip.basic_salary || 0
      const hra = slip.hra || 0
      const conveyance = slip.conveyance || 0
      const lta = slip.lta || 0
      const medical = slip.medical || 0
      const otherAllow = slip.other_allowances || 0

      const gross = basic + hra + conveyance + lta + medical + otherAllow
      const deductions = (slip.provident_fund || 0) + (slip.professional_tax || 0) + (slip.income_tax || 0) + (slip.other_deductions || 0)
      const net = gross - deductions

      // Get old values for audit logging
      const oldSlip = { ...slip }

      // Update salary slip
      const { error: updateError } = await supabase
        .from('salary_slips')
        .update({
          basic_salary: basic,
          hra: hra,
          conveyance: conveyance,
          lta: lta,
          medical: medical,
          other_allowances: otherAllow,
          gross_salary: gross,
          provident_fund: slip.provident_fund,
          professional_tax: slip.professional_tax,
          income_tax: slip.income_tax,
          other_deductions: slip.other_deductions,
          total_deductions: deductions,
          net_salary: net,
          status: 'pending_approval',
          updated_at: new Date().toISOString()
        })
        .eq('id', slipId)

      if (updateError) throw updateError

      // Log the change in audit logs
      await supabase
        .from('audit_logs')
        .insert({
          user_id: profile.id,
          action: 'UPDATE_SALARY_SLIP',
          table_name: 'salary_slips',
          record_id: slipId,
          old_values: oldSlip,
          new_values: {
            ...slip,
            gross_salary: gross,
            total_deductions: deductions,
            net_salary: net,
            status: 'pending_approval'
          }
        })

      // Update local state
      setSlipData(prev => prev.map(s =>
        s.id === slipId ? {
          ...s,
          gross_salary: gross,
          total_deductions: deductions,
          net_salary: net,
          status: 'pending_approval'
        } : s
      ))

      setEditingSlip(null)
      alert('Salary slip updated and sent for approval')
    } catch (error) {
      console.error('Error updating salary slip:', error)
      alert('Failed to update salary slip')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingSlip(null)
  }

  const handleApprove = async (slipId: string) => {
    if (!profile) return

    try {
      setSaving(true)

      const { error } = await supabase
        .from('salary_slips')
        .update({
          status: 'approved',
          approved_by: profile.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', slipId)

      if (error) throw error

      // Log approval
      await supabase
        .from('audit_logs')
        .insert({
          user_id: profile.id,
          action: 'APPROVE_SALARY_SLIP',
          table_name: 'salary_slips',
          record_id: slipId
        })

      setSlipData(prev => prev.map(slip =>
        slip.id === slipId ? { ...slip, status: 'approved' } : slip
      ))
      alert('Salary slip approved')
    } catch (error) {
      console.error('Error approving salary slip:', error)
      alert('Failed to approve salary slip')
    } finally {
      setSaving(false)
    }
  }

  const handleReject = async (slipId: string) => {
    if (!profile) return

    try {
      setSaving(true)

      const { error } = await supabase
        .from('salary_slips')
        .update({
          status: 'draft' // Reset to draft so it can be edited again
        })
        .eq('id', slipId)

      if (error) throw error

      // Log rejection
      await supabase
        .from('audit_logs')
        .insert({
          user_id: profile.id,
          action: 'REJECT_SALARY_SLIP',
          table_name: 'salary_slips',
          record_id: slipId
        })

      setSlipData(prev => prev.map(slip =>
        slip.id === slipId ? { ...slip, status: 'draft' } : slip
      ))
      alert('Salary slip sent back for revision')
    } catch (error) {
      console.error('Error rejecting salary slip:', error)
      alert('Failed to reject salary slip')
    } finally {
      setSaving(false)
    }
  }

  const updateSlipField = (slipId: string, field: string, value: string | number) => {
    setSlipData(prev => prev.map(slip =>
      slip.id === slipId ? { ...slip, [field]: typeof value === 'string' ? (parseFloat(value as string) || 0) : value } : slip
    ))
  }

  const calculateTotals = (slip: SalarySlip) => {
    const gross = slip.gross_salary || 0
    const deductions = slip.total_deductions || 0
    const net = slip.net_salary || 0
    return { gross, deductions, net }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Salary Slip Update</h1>
          <p className="text-gray-600 mt-2">Review and modify employee salary details before finalizing payslips</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Slips</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slipData.filter(s => s.status === 'draft').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slipData.filter(s => s.status === 'pending_approval').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {slipData.filter(s => s.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{slipData.reduce((sum, slip) => sum + (slip.net_salary || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Slips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Salary Slips</CardTitle>
            <CardDescription>Review and update salary details before approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slip ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading salary slips...
                    </TableCell>
                  </TableRow>
                ) : slipData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No salary slips found
                    </TableCell>
                  </TableRow>
                ) : (
                  slipData.map((slip) => {
                    const totals = calculateTotals(slip)
                    const monthName = new Date(slip.year, slip.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    return (
                      <TableRow key={slip.id}>
                        <TableCell className="font-medium">{slip.id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{slip.profiles?.full_name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{slip.profiles?.employee_id || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{slip.profiles?.department || 'N/A'}</TableCell>
                        <TableCell>{monthName}</TableCell>
                        <TableCell>₹{totals.gross.toLocaleString()}</TableCell>
                        <TableCell>₹{totals.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">₹{totals.net.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            slip.status === 'approved' ? 'default' :
                            slip.status === 'pending_approval' ? 'secondary' :
                            slip.status === 'draft' ? 'outline' : 'destructive'
                          }>
                            {slip.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(slip)}
                              disabled={editingSlip === slip.id || saving}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {slip.status === 'pending_approval' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(slip.id)}
                                  className="text-green-600"
                                  disabled={saving}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(slip.id)}
                                  className="text-red-600"
                                  disabled={saving}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Modal/Form */}
        {editingSlip && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Edit Salary Slip</CardTitle>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const slip = slipData.find(s => s.id === editingSlip)
                if (!slip) return null
                return (
                  <div className="space-y-6">
                    {/* Employee Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Employee Name</Label>
                        <Input value={slip.profiles?.full_name || 'N/A'} disabled />
                      </div>
                      <div>
                        <Label>Employee ID</Label>
                        <Input value={slip.profiles?.employee_id || 'N/A'} disabled />
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Input value={slip.profiles?.department || 'N/A'} disabled />
                      </div>
                    </div>

                    {/* Earnings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Earnings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="basic_salary">Basic Salary</Label>
                          <Input
                            id="basic_salary"
                            type="number"
                            value={slip.basic_salary || ''}
                            onChange={(e) => updateSlipField(slip.id, 'basic_salary', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hra">HRA</Label>
                          <Input
                            id="hra"
                            type="number"
                            value={slip.hra || ''}
                            onChange={(e) => updateSlipField(slip.id, 'hra', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="conveyance">Conveyance</Label>
                          <Input
                            id="conveyance"
                            type="number"
                            value={slip.conveyance || ''}
                            onChange={(e) => updateSlipField(slip.id, 'conveyance', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lta">LTA</Label>
                          <Input
                            id="lta"
                            type="number"
                            value={slip.lta || ''}
                            onChange={(e) => updateSlipField(slip.id, 'lta', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medical">Medical</Label>
                          <Input
                            id="medical"
                            type="number"
                            value={slip.medical || ''}
                            onChange={(e) => updateSlipField(slip.id, 'medical', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="other_allowances">Other Allowances</Label>
                          <Input
                            id="other_allowances"
                            type="number"
                            value={slip.other_allowances || ''}
                            onChange={(e) => updateSlipField(slip.id, 'other_allowances', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="provident_fund">Provident Fund</Label>
                          <Input
                            id="provident_fund"
                            type="number"
                            value={slip.provident_fund || ''}
                            onChange={(e) => updateSlipField(slip.id, 'provident_fund', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="professional_tax">Professional Tax</Label>
                          <Input
                            id="professional_tax"
                            type="number"
                            value={slip.professional_tax || ''}
                            onChange={(e) => updateSlipField(slip.id, 'professional_tax', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="income_tax">Income Tax</Label>
                          <Input
                            id="income_tax"
                            type="number"
                            value={slip.income_tax || ''}
                            onChange={(e) => updateSlipField(slip.id, 'income_tax', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <Label htmlFor="other_deductions">Other Deductions</Label>
                          <Input
                            id="other_deductions"
                            type="number"
                            value={slip.other_deductions || ''}
                            onChange={(e) => updateSlipField(slip.id, 'other_deductions', e.target.value)}
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes/Comments</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes or comments about this salary slip..."
                        value={slip.notes || ''}
                        onChange={(e) => updateSlipField(slip.id, 'notes', e.target.value)}
                        disabled={saving}
                      />
                    </div>

                    {/* Totals */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Gross Salary</Label>
                          <Input value={`₹${calculateTotals(slip).gross.toLocaleString()}`} disabled />
                        </div>
                        <div>
                          <Label>Total Deductions</Label>
                          <Input value={`₹${calculateTotals(slip).deductions.toLocaleString()}`} disabled />
                        </div>
                        <div>
                          <Label>Net Salary</Label>
                          <Input value={`₹${calculateTotals(slip).net.toLocaleString()}`} disabled className="font-semibold" />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button onClick={() => handleSave(slip.id)} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={saving}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}