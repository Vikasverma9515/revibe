// import type React from "react"
// import './globals.css'
// import { Inter } from "next/font/google"
// import type { Metadata } from "next"
// import { ThemeProvider } from "next-themes"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "SaaSify - Streamline Your Workflow",
//   description: "Boost productivity, reduce costs, and scale your business with our all-in-one SaaS platform.",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }

// import './globals.css'
// import { Inter } from 'next/font/google'
// import { Metadata } from 'next'
// import Header from '@/components/layout/Header'
// import Footer from '@/components/layout/Footer'
// import { ToastProvider } from '@/components/common/ToastProvider'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'AI Marketplace - Buy and Sell AI-Generated Assets',
//   description: 'Discover, buy, and sell AI-generated code, images, datasets, and prompts. Join the premier marketplace for AI-created digital assets.',
//   keywords: 'AI marketplace, AI assets, machine learning, artificial intelligence, code, datasets, prompts, images',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ToastProvider>
//           <div className="min-h-screen bg-gray-50 flex flex-col">
//             <Header />
//             <main className="flex-grow">
//               {children}
//             </main>
//             <Footer />
//           </div>
//         </ToastProvider>
//       </body>
//     </html>
//   )
// }
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { UserProvider } from "@/contexts/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "eHRMS - Uttar Pradesh Electronic Human Resource Management System",
  description: "Official portal for Uttar Pradesh government employees. Access salary slips, apply for leave, manage service records, and submit grievances online.",
  keywords: "eHRMS, Uttar Pradesh, government, HRMS, employee portal, salary, leave management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  )
}