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
  User,
  Edit,
  Save,
  Plus,
  Search,
  Briefcase,
  Building,
  Calendar
} from 'lucide-react'

// Mock data for employees
const mockEmployees = [
  {
    id: 'UP/2024/001',
    name: 'John Doe',
    currentDepartment: 'FINANCE',
    currentDesignation: 'Senior Accountant',
    currentGrade: 'Grade A',
    joiningDate: '2020-01-15',
    responsibilities: 'Financial reporting, budget management, tax compliance',
    skills: 'Accounting, Excel, SAP',
    status: 'active'
  },
  {
    id: 'UP/2024/002',
    name: 'Jane Smith',
    currentDepartment: 'EDUCATION',
    currentDesignation: 'Teacher',
    currentGrade: 'Grade B',
    joiningDate: '2019-08-20',
    responsibilities: 'Teaching mathematics, student assessment, curriculum development',
    skills: 'Mathematics, Teaching, Classroom Management',
    status: 'active'
  },
  {
    id: 'UP/2024/003',
    name: 'Bob Johnson',
    currentDepartment: 'HEALTH',
    currentDesignation: 'Doctor',
    currentGrade: 'Grade A',
    joiningDate: '2018-03-10',
    responsibilities: 'Patient care, medical diagnosis, emergency response',
    skills: 'Medicine, Surgery, Emergency Care',
    status: 'active'
  }
]

const departments = [
  'ADMINISTRATIVE REFORMS DEPARTMENT',
  'AGRICULTURE',
  'AGRICULTURE EDUCATION',
  'ANIMAL HUSBANDRY',
  'APPOINTMENT AND PERSONNEL',
  'AYUSH',
  'BACKWARD CLASS WELFARE DEPARTMENT',
  'BASIC EDUCATION',
  'CANE DEVELOPMENT',
  'CENTRAL GOVERNMENT',
  'CIVIL AVIATION',
  'CIVIL DEFENCE DEPARTMENT',
  'COMMERCIAL TAX',
  'CONSUMER PROTECTION, WEIGHTS AND MEASURES',
  'COOPERATIVE',
  'COORDINATION DEPARTMENT',
  'CULTURE',
  'DAIRY DEVELOPMENT',
  'DHARMARTH KARYA',
  'PUBLIC ENTERPRISES',
  'DISTRICT GAZETTEER',
  'DIVYANGJAN EMPOWERMENT',
  'ELECTION',
  'ENERGY',
  'ENVIRONMENT',
  'EXCISE',
  'FINANCE',
  'FISHERIES',
  'FOOD',
  'FOOD SEFETY AND DRUG ADMINISTRATION',
  'FOREST',
  'GOPAN DEPARTMENT',
  'GOVERNOR SECRETARIAT',
  'HIGHER EDUCATION',
  'HOME',
  'HOME GUARDS',
  'HORTICULTURE',
  'HOUSING AND URBAN PLANNING',
  'ICDS',
  'INDUSTRIAL DEVELOPMENT',
  'INDUSTRIES',
  'INFORMATION AND PUBLIC RELATIONS',
  'IT AND ELECTRONICS',
  'IRRIGATION AND WATER RESOURCES',
  'JUSTICE',
  'KHADI AND VILLAGE INDUSTRIES',
  'LABOUR',
  'LANGUAGE',
  'LEGISLATIVE',
  'MEDICAL EDUCATION',
  'MEDICAL HEALTH AND FAMILY WELFARE',
  'MINING',
  'MINIORITY WELFARE',
  'MSME AND EXPORT PROMOTION',
  'NCC',
  'NEW AND RENEWABLE ENERGY',
  'PANCHAYATI RAJ',
  'PARTI BHOOMI VIKAS VIBHAG',
  'PLANNING',
  'POLITICAL PENSION',
  'PRISON ADMINISTRATION AND REFORM SERVICES',
  'PROGRAM IMPLEMENTATION',
  'PWD',
  'RAJYA SAMPATTI',
  'REVENUE',
  'RURAL DEVELOPMENT',
  'RURAL ENGINEERING',
  'SAD',
  'SAINIK KALYAN',
  'SCIENCE AND TECHNOLOGY',
  'SECONDARY EDUCATION',
  'SERICULTURE',
  'SOCIAL WELFARE',
  'SPORTS',
  'STAMPS AND REGISTRATION',
  'TECHNICAL EDUCATION',
  'TEXTILE',
  'TOURISM',
  'TRANSPORT',
  'URBAN DEVELOPMENT',
  'VIDHAN PARISHAD SACHIVALAYA',
  'VIDHANSABHA SACHIVALAYA',
  'VIGILANCE DEPARTMENT',
  'VOCATIONAL EDUCATION SKILL DEVELOPMENT AND ENTREPRENEURSHIP',
  'WOMEN WELFARE',
  'YOUTH WELFARE',
  'DEMO'
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
  'Accountant',
  'Senior Accountant',
  'Finance Officer',
  'Engineer',
  'Senior Engineer',
  'Technical Officer'
]

const grades = ['Grade A', 'Grade B', 'Grade C', 'Grade D']

export default function JobProfilePage() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    designation: '',
    grade: '',
    responsibilities: '',
    skills: ''
  })

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || employee.currentDepartment === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
  }

  const handleSave = () => {
    // Mock save functionality
    setEmployees(prev => prev.map(emp =>
      emp.id === editingEmployee.id ? editingEmployee : emp
    ))
    setEditingEmployee(null)
    alert('Employee profile updated successfully')
  }

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department || !newEmployee.designation) {
      alert('Please fill in all required fields')
      return
    }

    const newEmp = {
      id: `UP/2024/${String(employees.length + 1).padStart(3, '0')}`,
      name: newEmployee.name,
      currentDepartment: newEmployee.department,
      currentDesignation: newEmployee.designation,
      currentGrade: newEmployee.grade,
      joiningDate: new Date().toISOString().split('T')[0],
      responsibilities: newEmployee.responsibilities,
      skills: newEmployee.skills,
      status: 'active'
    }

    setEmployees(prev => [...prev, newEmp])
    setNewEmployee({
      name: '',
      department: '',
      designation: '',
      grade: '',
      responsibilities: '',
      skills: ''
    })
    setIsDialogOpen(false)
    alert('New employee added successfully')
  }

  const updateEmployeeField = (field, value) => {
    setEditingEmployee(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Profile Management</h1>
          <p className="text-gray-600 mt-2">Manage employee roles, departments, and responsibilities</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {employees.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(employees.map(e => e.currentDepartment)).size}
                  </p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Updates</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="w-full md:w-80">
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
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new employee profile.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newName">Full Name</Label>
                      <Input
                        id="newName"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newDepartment">Department</Label>
                      <Select
                        value={newEmployee.department}
                        onValueChange={(value) => setNewEmployee(prev => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="newDesignation">Designation</Label>
                      <Select
                        value={newEmployee.designation}
                        onValueChange={(value) => setNewEmployee(prev => ({ ...prev, designation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
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
                      <Label htmlFor="newGrade">Grade</Label>
                      <Select
                        value={newEmployee.grade}
                        onValueChange={(value) => setNewEmployee(prev => ({ ...prev, grade: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
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
                    <div>
                      <Label htmlFor="newResponsibilities">Responsibilities</Label>
                      <Textarea
                        id="newResponsibilities"
                        value={newEmployee.responsibilities}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, responsibilities: e.target.value }))}
                        placeholder="Enter job responsibilities"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newSkills">Skills</Label>
                      <Input
                        id="newSkills"
                        value={newEmployee.skills}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, skills: e.target.value }))}
                        placeholder="Enter skills (comma separated)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddEmployee} className="flex-1">
                        Add Employee
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

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Profiles</CardTitle>
            <CardDescription>View and manage employee job profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.currentDepartment}</TableCell>
                    <TableCell>{employee.currentDesignation}</TableCell>
                    <TableCell>{employee.currentGrade}</TableCell>
                    <TableCell>{employee.joiningDate}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Employee Profile */}
        {editingEmployee && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Edit Employee Profile</CardTitle>
                <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Employee ID</Label>
                    <Input value={editingEmployee.id} disabled />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input value={editingEmployee.name} disabled />
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editDepartment">Department</Label>
                    <Select
                      value={editingEmployee.currentDepartment}
                      onValueChange={(value) => updateEmployeeField('currentDepartment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editDesignation">Designation</Label>
                    <Select
                      value={editingEmployee.currentDesignation}
                      onValueChange={(value) => updateEmployeeField('currentDesignation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="editGrade">Grade</Label>
                    <Select
                      value={editingEmployee.currentGrade}
                      onValueChange={(value) => updateEmployeeField('currentGrade', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                {/* Responsibilities and Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editResponsibilities">Responsibilities</Label>
                    <Textarea
                      id="editResponsibilities"
                      value={editingEmployee.responsibilities}
                      onChange={(e) => updateEmployeeField('responsibilities', e.target.value)}
                      placeholder="Enter job responsibilities"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editSkills">Skills</Label>
                    <Textarea
                      id="editSkills"
                      value={editingEmployee.skills}
                      onChange={(e) => updateEmployeeField('skills', e.target.value)}
                      placeholder="Enter skills (comma separated)"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}