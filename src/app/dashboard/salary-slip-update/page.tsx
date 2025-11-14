'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Edit,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calculator
} from 'lucide-react'

// Mock data for pending salary slips
const mockPendingSlips = [
  {
    id: 'SLIP-2024-001',
    employeeId: 'UP/2024/001',
    employeeName: 'John Doe',
    department: 'FINANCE',
    month: 'January 2024',
    status: 'draft',
    basicSalary: 45000,
    hra: 9000,
    conveyance: 1920,
    lta: 1500,
    medical: 1250,
    otherAllowances: 1330,
    providentFund: 5400,
    professionalTax: 235,
    incomeTax: 4500,
    otherDeductions: 500,
    grossSalary: 51000,
    totalDeductions: 10635,
    netSalary: 40365,
    notes: ''
  },
  {
    id: 'SLIP-2024-002',
    employeeId: 'UP/2024/002',
    employeeName: 'Jane Smith',
    department: 'EDUCATION',
    month: 'January 2024',
    status: 'pending_approval',
    basicSalary: 35000,
    hra: 7000,
    conveyance: 1920,
    lta: 1200,
    medical: 1250,
    otherAllowances: 1130,
    providentFund: 4200,
    professionalTax: 235,
    incomeTax: 3500,
    otherDeductions: 300,
    grossSalary: 40500,
    totalDeductions: 8235,
    netSalary: 32265,
    notes: 'Medical allowance adjustment required'
  }
]

export default function SalarySlipUpdatePage() {
  const [editingSlip, setEditingSlip] = useState(null)
  const [slipData, setSlipData] = useState(mockPendingSlips)

  const handleEdit = (slip) => {
    setEditingSlip(slip.id)
  }

  const handleSave = (slipId) => {
    // Mock save functionality
    setSlipData(prev => prev.map(slip =>
      slip.id === slipId ? { ...slip, status: 'pending_approval' } : slip
    ))
    setEditingSlip(null)
    alert('Salary slip updated and sent for approval')
  }

  const handleCancel = () => {
    setEditingSlip(null)
  }

  const handleApprove = (slipId) => {
    setSlipData(prev => prev.map(slip =>
      slip.id === slipId ? { ...slip, status: 'approved' } : slip
    ))
    alert('Salary slip approved')
  }

  const handleReject = (slipId) => {
    setSlipData(prev => prev.map(slip =>
      slip.id === slipId ? { ...slip, status: 'rejected' } : slip
    ))
    alert('Salary slip rejected')
  }

  const updateSlipField = (slipId, field, value) => {
    setSlipData(prev => prev.map(slip =>
      slip.id === slipId ? { ...slip, [field]: parseFloat(value) || value } : slip
    ))
  }

  const calculateTotals = (slip) => {
    const gross = slip.basicSalary + slip.hra + slip.conveyance + slip.lta + slip.medical + slip.otherAllowances
    const deductions = slip.providentFund + slip.professionalTax + slip.incomeTax + slip.otherDeductions
    const net = gross - deductions
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
                    ₹{slipData.reduce((sum, slip) => sum + calculateTotals(slip).net, 0).toLocaleString()}
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
                {slipData.map((slip) => {
                  const totals = calculateTotals(slip)
                  return (
                    <TableRow key={slip.id}>
                      <TableCell className="font-medium">{slip.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{slip.employeeName}</p>
                          <p className="text-sm text-gray-500">{slip.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{slip.department}</TableCell>
                      <TableCell>{slip.month}</TableCell>
                      <TableCell>₹{totals.gross.toLocaleString()}</TableCell>
                      <TableCell>₹{totals.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">₹{totals.net.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          slip.status === 'approved' ? 'default' :
                          slip.status === 'pending_approval' ? 'secondary' :
                          slip.status === 'rejected' ? 'destructive' : 'outline'
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
                            disabled={editingSlip === slip.id}
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
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(slip.id)}
                                className="text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
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
                <Button variant="outline" onClick={handleCancel}>
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
                        <Input value={slip.employeeName} disabled />
                      </div>
                      <div>
                        <Label>Employee ID</Label>
                        <Input value={slip.employeeId} disabled />
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Input value={slip.department} disabled />
                      </div>
                    </div>

                    {/* Earnings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Earnings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="basicSalary">Basic Salary</Label>
                          <Input
                            id="basicSalary"
                            type="number"
                            value={slip.basicSalary}
                            onChange={(e) => updateSlipField(slip.id, 'basicSalary', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hra">HRA</Label>
                          <Input
                            id="hra"
                            type="number"
                            value={slip.hra}
                            onChange={(e) => updateSlipField(slip.id, 'hra', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="conveyance">Conveyance</Label>
                          <Input
                            id="conveyance"
                            type="number"
                            value={slip.conveyance}
                            onChange={(e) => updateSlipField(slip.id, 'conveyance', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lta">LTA</Label>
                          <Input
                            id="lta"
                            type="number"
                            value={slip.lta}
                            onChange={(e) => updateSlipField(slip.id, 'lta', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medical">Medical</Label>
                          <Input
                            id="medical"
                            type="number"
                            value={slip.medical}
                            onChange={(e) => updateSlipField(slip.id, 'medical', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="otherAllowances">Other Allowances</Label>
                          <Input
                            id="otherAllowances"
                            type="number"
                            value={slip.otherAllowances}
                            onChange={(e) => updateSlipField(slip.id, 'otherAllowances', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="providentFund">Provident Fund</Label>
                          <Input
                            id="providentFund"
                            type="number"
                            value={slip.providentFund}
                            onChange={(e) => updateSlipField(slip.id, 'providentFund', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="professionalTax">Professional Tax</Label>
                          <Input
                            id="professionalTax"
                            type="number"
                            value={slip.professionalTax}
                            onChange={(e) => updateSlipField(slip.id, 'professionalTax', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="incomeTax">Income Tax</Label>
                          <Input
                            id="incomeTax"
                            type="number"
                            value={slip.incomeTax}
                            onChange={(e) => updateSlipField(slip.id, 'incomeTax', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="otherDeductions">Other Deductions</Label>
                          <Input
                            id="otherDeductions"
                            type="number"
                            value={slip.otherDeductions}
                            onChange={(e) => updateSlipField(slip.id, 'otherDeductions', e.target.value)}
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
                        value={slip.notes}
                        onChange={(e) => updateSlipField(slip.id, 'notes', e.target.value)}
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
                      <Button onClick={() => handleSave(slip.id)}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
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