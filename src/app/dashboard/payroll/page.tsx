'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/contexts/UserContext'
import {
  Users,
  Calculator,
  FileText,
  Download,
  Plus,
  Search,
  DollarSign,
  Calendar,
  Loader2,
  CheckCircle
} from 'lucide-react'

interface Employee {
  id: string
  profile_id: string
  employee_id: string | null
  full_name: string | null
  department: string | null
  designation: string | null
  basic_salary: number | null
  hra: number | null
  conveyance: number | null
  lta: number | null
  medical: number | null
  other_allowances: number | null
  provident_fund: number | null
  professional_tax: number | null
  income_tax: number | null
  other_deductions: number | null
  net_salary?: number
}

interface PayrollRun {
  id: string
  month: number
  year: number
  status: string
  total_employees: number | null
  total_gross_salary: number | null
  total_deductions: number | null
  total_net_salary: number | null
  processed_by: string | null
  processed_at: string | null
}

export default function PayrollPage() {
  const { profile } = useUser()

  // Only allow HR and Admin roles
  if (profile && profile.role !== 'hr' && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access payroll management.</p>
        </div>
      </div>
    )
  }
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [editForm, setEditForm] = useState({
    basic_salary: '',
    hra: '',
    conveyance: '',
    lta: '',
    medical: '',
    other_allowances: '',
    provident_fund: '',
    professional_tax: '',
    income_tax: '',
    other_deductions: ''
  })

  useEffect(() => {
    fetchEmployees()
    fetchPayrollRuns()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          profile_id,
          employee_id,
          full_name,
          department,
          designation,
          basic_salary,
          hra,
          conveyance,
          lta,
          medical,
          other_allowances,
          provident_fund,
          professional_tax,
          income_tax,
          other_deductions
        `)

      if (error) throw error

      // Calculate net salary for each employee
      const employeesWithNet = data.map(emp => ({
        ...emp,
        net_salary: calculateNetSalary(emp)
      }))

      setEmployees(employeesWithNet)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchPayrollRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_runs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setPayrollRuns(data)
    } catch (error) {
      console.error('Error fetching payroll runs:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateNetSalary = (employee: Employee) => {
    const basic = employee.basic_salary || 0
    const hra = employee.hra || 0
    const conveyance = employee.conveyance || 0
    const otherAllowances = employee.other_allowances || 0
    const pf = employee.provident_fund || 0
    const pt = employee.professional_tax || 0
    const it = employee.income_tax || 0
    const otherDed = employee.other_deductions || 0

    const gross = basic + hra + conveyance + otherAllowances
    const deductions = pf + pt + it + otherDed
    return gross - deductions
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const createPayrollRun = async () => {
    try {
      setLoading(true)

      // Check if payroll run already exists for this month/year
      const { data: existingRun, error: checkError } = await supabase
        .from('payroll_runs')
        .select('*')
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingRun) {
        alert('Payroll run already exists for this period')
        return
      }

      // Get all active employees with salary details
      const { data: activeEmployees, error: empError } = await supabase
        .from('employees')
        .select(`
          id,
          profile_id,
          employee_id,
          full_name,
          basic_salary,
          hra,
          conveyance,
          lta,
          medical,
          other_allowances,
          provident_fund,
          professional_tax,
          income_tax,
          other_deductions
        `)
        .not('basic_salary', 'is', null)

      if (empError) throw empError

      if (!activeEmployees || activeEmployees.length === 0) {
        alert('No employees found with salary details')
        return
      }

      // Calculate totals
      let totalGross = 0
      let totalDeductions = 0
      let totalNet = 0

      activeEmployees.forEach(emp => {
        const basic = emp.basic_salary || 0
        const hra = emp.hra || 0
        const conveyance = emp.conveyance || 0
        const lta = emp.lta || 0
        const medical = emp.medical || 0
        const otherAllow = emp.other_allowances || 0

        const gross = basic + hra + conveyance + lta + medical + otherAllow
        const deductions = (emp.provident_fund || 0) + (emp.professional_tax || 0) + (emp.income_tax || 0) + (emp.other_deductions || 0)
        const net = gross - deductions

        totalGross += gross
        totalDeductions += deductions
        totalNet += net
      })

      // Create payroll run
      const { data: payrollRun, error: runError } = await supabase
        .from('payroll_runs')
        .insert({
          month: selectedMonth,
          year: selectedYear,
          status: 'draft',
          total_employees: activeEmployees.length,
          total_gross_salary: totalGross,
          total_deductions: totalDeductions,
          total_net_salary: totalNet,
          processed_by: profile?.id
        })
        .select()
        .single()

      if (runError) throw runError

      // Generate salary slips for each employee
      const salarySlips = activeEmployees.map(emp => {
        const basic = emp.basic_salary || 0
        const hra = emp.hra || 0
        const conveyance = emp.conveyance || 0
        const lta = emp.lta || 0
        const medical = emp.medical || 0
        const otherAllow = emp.other_allowances || 0

        const gross = basic + hra + conveyance + lta + medical + otherAllow
        const deductions = (emp.provident_fund || 0) + (emp.professional_tax || 0) + (emp.income_tax || 0) + (emp.other_deductions || 0)
        const net = gross - deductions

        return {
          employee_id: emp.profile_id,
          month: selectedMonth,
          year: selectedYear,
          basic_salary: basic,
          hra: hra,
          conveyance: conveyance,
          lta: lta,
          medical: medical,
          other_allowances: otherAllow,
          gross_salary: gross,
          provident_fund: emp.provident_fund || 0,
          professional_tax: emp.professional_tax || 0,
          income_tax: emp.income_tax || 0,
          other_deductions: emp.other_deductions || 0,
          total_deductions: deductions,
          net_salary: net,
          status: 'draft'
        }
      })

      const { error: slipsError } = await supabase
        .from('salary_slips')
        .insert(salarySlips)

      if (slipsError) throw slipsError

      alert(`Payroll run created successfully for ${activeEmployees.length} employees`)
      fetchPayrollRuns()
    } catch (error) {
      console.error('Error creating payroll run:', error)
      alert('Failed to create payroll run')
    } finally {
      setLoading(false)
    }
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setEditForm({
      basic_salary: employee.basic_salary?.toString() || '',
      hra: employee.hra?.toString() || '',
      conveyance: employee.conveyance?.toString() || '',
      lta: employee.lta?.toString() || '',
      medical: employee.medical?.toString() || '',
      other_allowances: employee.other_allowances?.toString() || '',
      provident_fund: employee.provident_fund?.toString() || '',
      professional_tax: employee.professional_tax?.toString() || '',
      income_tax: employee.income_tax?.toString() || '',
      other_deductions: employee.other_deductions?.toString() || ''
    })
  }

  const handleSaveEmployee = async () => {
    if (!editingEmployee) return

    try {
      setLoading(true)
      const updateData = {
        basic_salary: parseFloat(editForm.basic_salary) || null,
        hra: parseFloat(editForm.hra) || null,
        conveyance: parseFloat(editForm.conveyance) || null,
        lta: parseFloat(editForm.lta) || null,
        medical: parseFloat(editForm.medical) || null,
        other_allowances: parseFloat(editForm.other_allowances) || null,
        provident_fund: parseFloat(editForm.provident_fund) || null,
        professional_tax: parseFloat(editForm.professional_tax) || null,
        income_tax: parseFloat(editForm.income_tax) || null,
        other_deductions: parseFloat(editForm.other_deductions) || null
      }

      const { error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', editingEmployee.id)

      if (error) throw error

      alert('Employee salary details updated successfully')
      setEditingEmployee(null)
      fetchEmployees()
    } catch (error) {
      console.error('Error updating employee:', error)
      alert('Failed to update employee details')
    } finally {
      setLoading(false)
    }
  }

  const generatePayslips = async () => {
    try {
      setLoading(true)

      // Get salary slips for the selected month/year that are in draft status
      const { data: draftSlips, error: fetchError } = await supabase
        .from('salary_slips')
        .select(`
          id,
          employee_id,
          profiles!inner(full_name, email)
        `)
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .eq('status', 'draft')

      if (fetchError) throw fetchError

      if (!draftSlips || draftSlips.length === 0) {
        alert('No draft salary slips found for the selected period')
        return
      }

      // Update salary slips status to approved
      const slipIds = draftSlips.map(slip => slip.id)
      const { error: updateError } = await supabase
        .from('salary_slips')
        .update({
          status: 'approved',
          approved_by: profile?.id,
          approved_at: new Date().toISOString()
        })
        .in('id', slipIds)

      if (updateError) throw updateError

      // Update payroll run status to completed
      const { error: runUpdateError } = await supabase
        .from('payroll_runs')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('month', selectedMonth)
        .eq('year', selectedYear)

      if (runUpdateError) throw runUpdateError

      alert(`Payslips approved for ${draftSlips.length} employees. Ready for disbursement.`)
      fetchPayrollRuns()
    } catch (error) {
      console.error('Error generating payslips:', error)
      alert('Failed to generate payslips')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-2">Manage employee salaries, calculate payroll, and generate payslips</p>
        </div>



        {/* Payroll Runs Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Payroll Runs</CardTitle>
            <CardDescription>Overview of recent payroll processing activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollRuns.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No payroll runs found</p>
              ) : (
                payrollRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        {new Date(run.year, run.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {run.total_employees} employees • ₹{(run.total_net_salary || 0).toLocaleString()} total
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        run.status === 'completed' ? 'default' :
                        run.status === 'processing' ? 'secondary' : 'outline'
                      }>
                        {run.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="calculation">Payroll Calculation</TabsTrigger>
            <TabsTrigger value="reports">Reports & Payslips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Payroll Runs</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {payrollRuns.filter(run => run.status !== 'completed').length}
                      </p>
                    </div>
                    <Calculator className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Salary Budget</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{employees.reduce((sum, emp) => sum + (emp.net_salary || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Runs</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {payrollRuns.filter(run => run.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Processing Workflow</CardTitle>
                <CardDescription>How payroll management works in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Employee Data Setup</h4>
                      <p className="text-sm text-gray-600">HR enters employee salary details, allowances, and deductions in the system.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Payroll Run Creation</h4>
                      <p className="text-sm text-gray-600">Create payroll run for specific month/year, system calculates salaries automatically.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Review & Approval</h4>
                      <p className="text-sm text-gray-600">HR reviews calculations, makes adjustments if needed, and approves payroll.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Salary Disbursement</h4>
                      <p className="text-sm text-gray-600">Generate payslips and process payments through bank transfers or other methods.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                  <Button onClick={createPayrollRun} className="flex-1" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calculator className="w-4 h-4 mr-2" />}
                    Create Payroll Run
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
                  <Button onClick={generatePayslips} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                    Approve & Generate Payslips
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