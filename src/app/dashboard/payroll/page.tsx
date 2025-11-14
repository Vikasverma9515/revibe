'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Calculator,
  FileText,
  Download,
  Plus,
  Search,
  DollarSign,
  Calendar
} from 'lucide-react'

// Mock data for employees
const mockEmployees = [
  {
    id: 'UP/2024/001',
    name: 'John Doe',
    department: 'FINANCE',
    designation: 'Senior Accountant',
    basicSalary: 45000,
    allowances: 5000,
    deductions: 2000,
    netSalary: 48000,
    status: 'active'
  },
  {
    id: 'UP/2024/002',
    name: 'Jane Smith',
    department: 'EDUCATION',
    designation: 'Teacher',
    basicSalary: 35000,
    allowances: 3000,
    deductions: 1500,
    netSalary: 36500,
    status: 'active'
  },
  {
    id: 'UP/2024/003',
    name: 'Bob Johnson',
    department: 'HEALTH',
    designation: 'Doctor',
    basicSalary: 75000,
    allowances: 10000,
    deductions: 5000,
    netSalary: 80000,
    status: 'active'
  }
]

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const calculatePayroll = () => {
    // Mock payroll calculation
    alert('Payroll calculated for all active employees')
  }

  const generatePayslips = () => {
    // Mock payslip generation
    alert('Payslips generated and sent to employees')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-2">Manage employee salaries, calculate payroll, and generate payslips</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{mockEmployees.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">₹{mockEmployees.reduce((sum, emp) => sum + emp.netSalary, 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payroll Period</p>
                  <p className="text-2xl font-bold text-gray-900">Jan 2024</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="calculation">Payroll Calculation</TabsTrigger>
            <TabsTrigger value="reports">Reports & Payslips</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Employees</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label htmlFor="department">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="EDUCATION">Education</SelectItem>
                        <SelectItem value="HEALTH">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Employee Salary Details</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>₹{employee.basicSalary.toLocaleString()}</TableCell>
                        <TableCell>₹{employee.allowances.toLocaleString()}</TableCell>
                        <TableCell>₹{employee.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">₹{employee.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Calculation</CardTitle>
                <CardDescription>Calculate salaries for the current payroll period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payrollPeriod">Payroll Period</Label>
                    <Select defaultValue="january-2024">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january-2024">January 2024</SelectItem>
                        <SelectItem value="december-2023">December 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="calculationType">Calculation Type</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={calculatePayroll} className="flex-1">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Payroll
                  </Button>
                  <Button variant="outline">
                    Preview Calculations
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax & Deduction Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="providentFund">Provident Fund (%)</Label>
                    <Input id="providentFund" type="number" defaultValue="12" />
                  </div>
                  <div>
                    <Label htmlFor="professionalTax">Professional Tax (₹)</Label>
                    <Input id="professionalTax" type="number" defaultValue="235" />
                  </div>
                  <div>
                    <Label htmlFor="incomeTax">Income Tax (%)</Label>
                    <Input id="incomeTax" type="number" defaultValue="10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payslip Generation</CardTitle>
                <CardDescription>Generate and distribute payslips to employees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={generatePayslips}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Payslips
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Monthly Payroll Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Tax Deduction Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Salary Register
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Bank Transfer File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}