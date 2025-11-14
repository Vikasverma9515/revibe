'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Eye, EyeOff } from 'lucide-react'

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

function generateCaptcha() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function LoginForm() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    setCaptcha(generateCaptcha())
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (captchaInput.toUpperCase() !== captcha) {
      setError('Invalid captcha')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-blue-900">
          eHRMS Login
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to access your employee portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="department">User Department</Label>
            <Select onValueChange={setDepartment} required>
              <SelectTrigger>
                <SelectValue placeholder="Select--" />
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

          <div className="space-y-2">
            <Label htmlFor="userId">User Id</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="employee@up.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="captcha">Captcha Text</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="Enter captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center px-3 py-2 bg-gray-100 rounded-md font-mono text-lg">
                {captcha}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </div>
      </CardContent>
    </Card>
  )
}