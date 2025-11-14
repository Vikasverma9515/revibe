'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  TrendingUp,
  Plus,
  CheckCircle,
  X,
  Clock,
  DollarSign
} from 'lucide-react'

// Mock data for promotion requests
const mockPromotionRequests = [
  {
    id: 'PROM-2024-001',
    employeeId: 'UP/2024/001',
    employeeName: 'John Doe',
    currentDesignation: 'Senior Accountant',
    currentGrade: 'Grade B',
    currentSalary: 45000,
    proposedDesignation: 'Finance Officer',
    proposedGrade: 'Grade A',
    proposedSalary: 55000,
    reason: 'Excellent performance and 4 years of service',
    status: 'pending',
    requestedDate: '2024-01-15',
    approvedDate: null
  },
  {
    id: 'PROM-2024-002',
    employeeId: 'UP/2024/002',
    employeeName: 'Jane Smith',
    currentDesignation: 'Teacher',
    currentGrade: 'Grade C',
    currentSalary: 35000,
    proposedDesignation: 'Senior Teacher',
    proposedGrade: 'Grade B',
    proposedSalary: 42000,
    reason: 'Outstanding teaching performance and student feedback',
    status: 'approved',
    requestedDate: '2024-01-10',
    approvedDate: '2024-01-20'
  },
  {
    id: 'PROM-2024-003',
    employeeId: 'UP/2024/003',
    employeeName: 'Bob Johnson',
    currentDesignation: 'Medical Officer',
    currentGrade: 'Grade B',
    currentSalary: 65000,
    proposedDesignation: 'Senior Medical Officer',
    proposedGrade: 'Grade A',
    proposedSalary: 75000,
    reason: 'Specialized skills and leadership qualities',
    status: 'rejected',
    requestedDate: '2024-01-05',
    approvedDate: null
  }
]

const designations = [
  'Junior Clerk',
  'Senior Clerk',
  'Assistant',
  'Junior Officer',
  'Officer',
  'Senior Officer',
  'Deputy Director',
  'Director',
  'Teacher',
  'Senior Teacher',
  'Principal',
  'Doctor',
  'Senior Doctor',
  'Medical Officer',
  'Senior Medical Officer',
  'Accountant',
  'Senior Accountant',
  'Finance Officer',
  'Engineer',
  'Senior Engineer',
  'Technical Officer'
]

const grades = ['Grade A', 'Grade B', 'Grade C', 'Grade D']

export default function PromotionPage() {
  const [promotionRequests, setPromotionRequests] = useState(mockPromotionRequests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPromotion, setNewPromotion] = useState({
    employeeId: '',
    employeeName: '',
    currentDesignation: '',
    currentGrade: '',
    currentSalary: '',
    proposedDesignation: '',
    proposedGrade: '',
    proposedSalary: '',
    reason: ''
  })

  const handleApprove = (id) => {
    setPromotionRequests(prev => prev.map(req =>
      req.id === id ? {
        ...req,
        status: 'approved',
        approvedDate: new Date().toISOString().split('T')[0]
      } : req
    ))
    alert('Promotion request approved')
  }

  const handleReject = (id) => {
    setPromotionRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'rejected' } : req
    ))
    alert('Promotion request rejected')
  }

  const handleSubmitPromotion = () => {
    if (!newPromotion.employeeId || !newPromotion.proposedDesignation) {
      alert('Please fill in all required fields')
      return
    }

    const newRequest = {
      id: `PROM-2024-${String(promotionRequests.length + 1).padStart(3, '0')}`,
      employeeId: newPromotion.employeeId,
      employeeName: newPromotion.employeeName,
      currentDesignation: newPromotion.currentDesignation,
      currentGrade: newPromotion.currentGrade,
      currentSalary: parseFloat(newPromotion.currentSalary),
      proposedDesignation: newPromotion.proposedDesignation,
      proposedGrade: newPromotion.proposedGrade,
      proposedSalary: parseFloat(newPromotion.proposedSalary),
      reason: newPromotion.reason,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      approvedDate: null
    }

    setPromotionRequests(prev => [...prev, newRequest])
    setNewPromotion({
      employeeId: '',
      employeeName: '',
      currentDesignation: '',
      currentGrade: '',
      currentSalary: '',
      proposedDesignation: '',
      proposedGrade: '',
      proposedSalary: '',
      reason: ''
    })
    setIsDialogOpen(false)
    alert('Promotion request submitted successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Promotion Management</h1>
          <p className="text-gray-600 mt-2">Handle employee promotion requests and updates to designation, pay scale, and benefits</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{promotionRequests.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promotionRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {promotionRequests.filter(r => r.status === 'approved').length}
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
                  <p className="text-sm font-medium text-gray-600">Salary Increase</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{promotionRequests
                      .filter(r => r.status === 'approved')
                      .reduce((sum, r) => sum + (r.proposedSalary - r.currentSalary), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Promotion Requests</h3>
                <p className="text-gray-600">Manage employee promotion applications</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Promotion Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Submit Promotion Request</DialogTitle>
                    <DialogDescription>
                      Enter the details for the promotion request.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="empId">Employee ID</Label>
                        <Input
                          id="empId"
                          value={newPromotion.employeeId}
                          onChange={(e) => setNewPromotion(prev => ({ ...prev, employeeId: e.target.value }))}
                          placeholder="UP/2024/001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="empName">Employee Name</Label>
                        <Input
                          id="empName"
                          value={newPromotion.employeeName}
                          onChange={(e) => setNewPromotion(prev => ({ ...prev, employeeName: e.target.value }))}
                          placeholder="Enter employee name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentDesig">Current Designation</Label>
                        <Select
                          value={newPromotion.currentDesignation}
                          onValueChange={(value) => setNewPromotion(prev => ({ ...prev, currentDesignation: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select current designation" />
                          </SelectTrigger>
                          <SelectContent>
                            {designations.map((desig) => (
                              <SelectItem key={desig} value={desig}>
                                {desig}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currentGrade">Current Grade</Label>
                        <Select
                          value={newPromotion.currentGrade}
                          onValueChange={(value) => setNewPromotion(prev => ({ ...prev, currentGrade: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select current grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="currentSalary">Current Salary (₹)</Label>
                      <Input
                        id="currentSalary"
                        type="number"
                        value={newPromotion.currentSalary}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, currentSalary: e.target.value }))}
                        placeholder="Enter current salary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="proposedDesig">Proposed Designation</Label>
                        <Select
                          value={newPromotion.proposedDesignation}
                          onValueChange={(value) => setNewPromotion(prev => ({ ...prev, proposedDesignation: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select proposed designation" />
                          </SelectTrigger>
                          <SelectContent>
                            {designations.map((desig) => (
                              <SelectItem key={desig} value={desig}>
                                {desig}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="proposedGrade">Proposed Grade</Label>
                        <Select
                          value={newPromotion.proposedGrade}
                          onValueChange={(value) => setNewPromotion(prev => ({ ...prev, proposedGrade: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select proposed grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="proposedSalary">Proposed Salary (₹)</Label>
                      <Input
                        id="proposedSalary"
                        type="number"
                        value={newPromotion.proposedSalary}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, proposedSalary: e.target.value }))}
                        placeholder="Enter proposed salary"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reason">Reason for Promotion</Label>
                      <Textarea
                        id="reason"
                        value={newPromotion.reason}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Enter detailed reason for promotion"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSubmitPromotion} className="flex-1">
                        Submit Request
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Promotion Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Promotion Requests</CardTitle>
            <CardDescription>Review and approve employee promotion requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Current Position</TableHead>
                  <TableHead>Proposed Position</TableHead>
                  <TableHead>Salary Change</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotionRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-gray-500">{request.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.currentDesignation}</p>
                        <p className="text-sm text-gray-500">{request.currentGrade}</p>
                        <p className="text-sm text-gray-500">₹{request.currentSalary.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.proposedDesignation}</p>
                        <p className="text-sm text-gray-500">{request.proposedGrade}</p>
                        <p className="text-sm text-gray-500">₹{request.proposedSalary.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-semibold">
                        +₹{(request.proposedSalary - request.currentSalary).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'pending' ? 'secondary' :
                        request.status === 'rejected' ? 'destructive' : 'outline'
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.requestedDate}</TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}