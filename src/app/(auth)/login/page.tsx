'use client'; // <-- This line fixes the error

import { LoginForm } from '@/components/auth/LoginForm' // Restored alias path
import Link from 'next/link'

export default function LoginPage() {
return (
// Refined: Changed gradient from blue to purple theme
<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
<div className="w-full max-w-md space-y-6">
<div className="text-center">
<div className="mb-4 flex justify-center">
{/* Refined: Replaced text logo with official UP Seal logo */}
<Link href="/" className="mb-4">
<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Seal_of_Uttar_Pradesh.svg/768px-Seal_of_Uttar_Pradesh.svg.png"
alt="UP Government Logo"
className="h-20 w-auto"
onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/80x80/ccc/333?text=UP'; }}
/>
</Link>
</div>
{/* Refined: Matched text and colors to landing page */}
<h1 className="text-3xl font-bold text-purple-700">
MANAV SAMPADA
</h1>
<h2 className="text-xl font-semibold text-gray-700">
UTTAR PRADESH
</h2>
<p className="mt-2 text-sm text-gray-500">Please login to access your dashboard.</p>
</div>

<LoginForm />

<div className="text-center">
{/* Refined: Replaced 'Sign up' with 'Go back to Home' to match landing page */}
<p className="text-sm text-gray-60hidden0">
<Link href="/" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">
← Go back to Home
</Link>
</p>
</div>
</div>
</div>
)
}

