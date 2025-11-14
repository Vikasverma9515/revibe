'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, BarChart2, Download, ExternalLink, ArrowRight, ArrowLeft, Menu, Newspaper, Building, Megaphone, ChevronRight, DollarSign, Calendar, Briefcase, MapPin, TrendingUp, BookOpen, Link as LinkIcon } from 'lucide-react';

// --- App ---
// This is the main component that would be your Next.js page.
// It assembles all the other components into the final layout.
export default function App() {
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

return (
<div className="min-h-screen bg-white font-sans text-gray-800">
<GlobalStyles />
{/* --- Page Wrapper --- */}
<div className="relative flex min-h-screen flex-col">

{/* --- STICKY HEADERS --- */}
<div className="sticky top-0 z-50">
<TopBar />
<Header onMenuToggle={() => setIsMobileMenuOpen(prev => !prev)} />
</div>

{/* --- MOBILE MENU --- */}
{isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}

{/* --- PAGE CONTENT --- */}
<main className="flex-grow">
{/* Section 1: Revolving Banners */}
<BannerCarousel />

{/* Section 2: Latest News */}
<NewsCarousel />

{/* Section 3: Info Boxes */}
<InfoBoxes />

{/* Section 4: Demo Preview for Review */}
<DemoPreview />
</main>

{/* --- FOOTER --- */}
<Footer />
</div>
</div>
);
}

// --- 1. Top Bar ---
// The small header on top with "INDIAN govt" and the animated flag.
function TopBar() {
return (
<div className="w-full bg-gray-900 text-white shadow-md">
{/* This div now spans the full width. Removed mx-auto and max-w-7xl */}
<div className="flex h-8 items-center justify-between px-4 sm:px-6 lg:px-8">
<div className="flex items-center gap-2">
{/* Animated Flag: Replaced pulse with a wave animation */}
<div className="relative h-4 w-6 overflow-hidden">
<span className="animate-wave absolute top-0 left-0 h-1/3 w-full bg-orange-500" style={{ animationDelay: '-0.2s' }}></span>
<span className="animate-wave absolute top-1/3 left-0 h-1/3 w-full bg-white"></span>
<span className="animate-wave absolute bottom-0 left-0 h-1/3 w-full bg-green-600" style={{ animationDelay: '0.2s' }}></span>
{/* Adjusted Chakra to fit better */}
<span className="absolute inset-0 m-auto h-[5px] w-[5px] rounded-full border-[1px] border-blue-800 bg-white" style={{ top: 'calc(50% - 2.5px)', left: 'calc(50% - 2.5px)' }}></span>
</div>
<span className="text-xs font-medium uppercase tracking-wider">INDIAN GOVT</span>
</div>
<span className="text-xs">
{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
</span>
</div>
</div>
);
}

// --- 2. Main Header ---
// The main dashboard header with logos and login.
function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
return (
<div className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
{/* This div now spans the full width. Removed mx-auto and max-w-7xl */}
<div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

{/* Left: Satyamev Jayate Emblem */}
<div className="flex items-center">
<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/80px-Emblem_of_India.svg.png"
alt="Satyamev Jayate"
className="h-16 w-auto" // Made logo bigger (h-14 to h-16)
onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/60x70/ccc/333?text=Emblem'; }}
/>
</div>

{/* Middle: Manav Sampada UP */}
{/* Re-engineered the heading for a proper animated hover effect */}
<div className="hidden sm:flex items-center gap-4">
<div
className="relative text-3xl font-bold px-3 py-1 rounded-lg group cursor-pointer"
>
{/* 1. The purple background. Scales from 0 to 100% on hover. */}
<span className="absolute inset-0 bg-purple-700 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>

{/* 2. The text. Sits on top (z-10) and changes color on hover. */}
<span className="relative z-10 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
MANAV SAMPADA UTTAR PRADESH
</span>
</div>

<img
src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Seal_of_Uttar_Pradesh.svg/768px-Seal_of_Uttar_Pradesh.svg.png"
alt="UP Logo"
className="h-12 w-auto"
onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/60x60/ccc/333?text=UP'; }}
/>
</div>

{/* Right: Login/Register */}
<div className="flex items-center gap-4">
{/* Added back the mobile menu toggle button */}
<button onClick={onMenuToggle} className="sm:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100">
<Menu size={24} />
</button>
<Link href="/login">
<button className="rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
Login
</button>
</Link>
<Link href="/signup">
<button className="rounded-md border border-purple-700 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
Signup
</button>
</Link>
</div>
</div>
</div>
);
}

// --- 3. Banner Carousel ---
// Revolving array of banners about UP govt progress.
function BannerCarousel() {
const [currentSlide, setCurrentSlide] = useState(0);
const slides = [
{
title: 'Groundbreaking Ceremony 4.0',
description: 'Launching projects worth ₹10 lakh crore, fueling UP\'s journey to a $1 trillion economy.',
image: 'https://placehold.co/1200x500/6b21a8/ffffff?text=UP+Progress+Banner+1',
color: 'bg-purple-800/75'
},
{
title: 'Noida International Airport',
description: 'Connecting Uttar Pradesh to the world with a state-of-the-art aviation hub.',
image: 'https://placehold.co/1200x500/7e22ce/ffffff?text=UP+Progress+Banner+2',
color: 'bg-purple-700/75'
},
{
title: 'UP Defence Industrial Corridor',
description: 'Fostering self-reliance in aerospace and defence manufacturing.',
image: 'https://placehold.co/1200x500/581c87/ffffff?text=UP+Progress+Banner+3',
color: 'bg-purple-900/75'
},
];

useEffect(() => {
const timer = setTimeout(() => {
setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
}, 5000); // Change slide every 5 seconds
return () => clearTimeout(timer);
}, [currentSlide, slides.length]);

return (
<section className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
{slides.map((slide, index) => (
<div
key={slide.title}
className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
>
<img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
<div className={`absolute inset-0 ${slide.color} bg-opacity-70`}></div>
<div className="absolute inset-0 flex items-center justify-center text-white">
<div className="max-w-3xl text-center">
<h2 className="text-2xl font-bold shadow-black drop-shadow-lg md:text-4xl lg:text-5xl">{slide.title}</h2>
<p className="mt-4 text-sm shadow-black drop-shadow-lg md:text-lg">{slide.description}</p>
</div>
</div>
</div>
))}
<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
{slides.map((_, index) => (
<button
key={index}
onClick={() => setCurrentSlide(index)}
className={`h-2 w-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'} transition-all`}
></button>
))}
</div>
</section>
);
}

// --- 4. Latest News Carousel ---
// Revolving array of clickable news items.
function NewsCarousel() {
const [currentIndex, setCurrentIndex] = useState(0);
const newsItems = [
{ title: 'New Payroll System Deployed', type: 'System Update', icon: <Shield /> },
{ title: 'State Holiday Declared for Friday', type: 'Announcement', icon: <Megaphone /> },
{ title: 'Q3 Promotion Cycle Now Open', type: 'HR News', icon: <Building /> },
{ title: 'Annual Performance Review Guidelines', type: 'Policy', icon: <Newspaper /> },
{ title: 'New Employee Wellness Program', type: 'HR News', icon: <Megaphone /> },
{ title: 'Tax Filing Deadline Reminder', type: 'System Update', icon: <Shield /> },
];

const itemsToShow = 3;

const next = () => {
setCurrentIndex((prev) => (prev + 1) % (newsItems.length - itemsToShow + 1));
};
const prev = () => {
setCurrentIndex((prev) => (prev - 1 + (newsItems.length - itemsToShow + 1)) % (newsItems.length - itemsToShow + 1));
};

// Auto-scroll
useEffect(() => {
const timer = setTimeout(() => {
// Use next() to ensure it loops correctly
setCurrentIndex((prev) => (prev + 1) % (newsItems.length - itemsToShow + 1));
}, 4000);
return () => clearTimeout(timer);
}, [currentIndex, newsItems.length, itemsToShow]); // Fixed dependency array

return (
<section className="bg-gray-50 py-12 md:py-16">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between">
<h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Latest News</h2>
<div className="flex gap-2">
<button onClick={prev} className="rounded-full bg-white p-2 text-purple-700 shadow-md hover:bg-gray-100">
<ArrowLeft size={20} />
</button>
<button onClick={next} className="rounded-full bg-white p-2 text-purple-700 shadow-md hover:bg-gray-100">
<ArrowRight size={20} />
</button>
</div>
</div>

<div className="mt-8 w-full overflow-hidden">
<div
className="flex transition-transform duration-500 ease-in-out"
style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
>
{newsItems.map((item, index) => (
<div key={index} className="w-full flex-shrink-0 px-2" style={{ flexBasis: `${100 / itemsToShow}%` }}>
<NewsCard item={item} />
</div>
))}
</div>
</div>
</div>
</section>
);
}

// Single News Card component for the carousel
type NewsItem = {
  title: string;
  type: string;
  icon: React.ReactNode;
};

function NewsCard({ item }: { item: NewsItem }) {
return (
<a
href="#"
className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100"
onClick={(e) => e.preventDefault()}
>
<div className="p-5">
<div className="flex items-center gap-3">
<span className="rounded-full bg-purple-100 p-2 text-purple-700">
{item.icon}
</span>
<span className="text-xs font-semibold uppercase text-purple-600">{item.type}</span>
</div>
<h3 className="mt-4 truncate text-lg font-semibold text-gray-800 group-hover:text-purple-700">
{item.title}
</h3>
<div className="mt-4 flex items-center justify-between text-sm text-gray-500">
<span>Read More</span>
<ExternalLink
size={16}
className="opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
style={{ transform: 'translateX(-10px)' }}
/>
</div>
</div>
</a>
);
}

// --- 5. Info Boxes ---
// The 4 boxes from the reference site: Imp Links, Public Window, Stats, Download App.
function InfoBoxes() {
const boxes = [
{
title: 'Important Links',
icon: <LinkIcon size={32} />,
color: 'text-purple-500',
links: [
{ name: 'Forms/Notices', href: '/dashboard/correction-requests' },
{ name: 'Published Order', href: '/dashboard/service-book' },
{ name: 'Government Order', href: '/dashboard/service-book' },
{ name: 'Useful Video Links', href: '/dashboard/chatbot' },
]
},
{
title: 'Public Window',
icon: <Newspaper size={32} />,
color: 'text-purple-500',
links: [
{ name: 'Office List', href: '/dashboard/transfers' },
{ name: 'Fact Sheet (P2)', href: '/dashboard' },
{ name: 'Search Hrms Code', href: '/dashboard/job-profile' },
{ name: 'Appointment Choice Filling', href: '/dashboard/promotion' },
{ name: 'Compassionate App.', href: '/dashboard/leave' },
{ name: 'DDCA System', href: '/dashboard/payroll' },
]
},
{
title: 'Statistics',
icon: <BarChart2 size={32} />,
color: 'text-purple-500',
links: [
{ name: 'Reg. Departments', href: '/dashboard/job-profile' },
{ name: 'Department Admin', href: '/dashboard/job-profile' },
{ name: 'Reg. Employees', href: '/dashboard/transfers' },
{ name: 'Mobile App Users', href: '/dashboard/chatbot' },
]
},
{
title: 'm-STHAPNA App', // Updated title
icon: <Download size={32} />,
color: 'text-purple-500',
links: [
{ name: 'Download App', href: '#' },
{ name: 'Download User Manual', href: '#' },
]
},
];

return (
<section className="bg-gray-900 py-12 md:py-16">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
{boxes.map((box) => (
<div
key={box.title}
className="group flex flex-col rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:z-10 hover:-translate-y-2 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20"
>
<div className="flex items-center gap-4">
<div className={`flex-shrink-0 rounded-full bg-purple-100 p-4 ${box.color}`}>
{box.icon}
</div>
<h3 className="text-xl font-semibold text-white">{box.title}</h3>
</div>
<ul className="mt-6 space-y-3">
{box.links.map((link) => (
<li key={link.name}>
<a
href={link.href}
className="flex items-center justify-between text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
>
<span>{link.name}</span>
<ChevronRight size={16} className="text-purple-400" />
</a>
</li>
))}
</ul>
</div>
))}
</div>
</div>
</section>
);
}

// --- 6. Demo Preview ---
// Preview section showing dashboard features for review purposes
function DemoPreview() {
return (
<section className="bg-gradient-to-r from-purple-50 to-blue-50 py-12 md:py-16">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="text-center mb-8">
<h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard Preview</h2>
<p className="mt-4 text-lg text-gray-600">Explore the features available in the Manav Sampada dashboard</p>
</div>

<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
{/* Payroll Management */}
<Link href="/dashboard/payroll">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
<div className="flex items-center mb-4">
<div className="bg-purple-100 p-3 rounded-full">
<DollarSign className="h-6 w-6 text-purple-600" />
</div>
<h3 className="ml-4 text-xl font-semibold text-gray-900">Payroll Management</h3>
</div>
<p className="text-gray-600 mb-4">Manage salary slips, updates, and payroll processing for government employees.</p>
<ul className="text-sm text-gray-500 space-y-1">
<li>• View salary details</li>
<li>• Update payroll information</li>
<li>• Generate reports</li>
</ul>
</div>
</Link>

{/* Leave Management */}
<Link href="/dashboard/leave">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
<div className="flex items-center mb-4">
<div className="bg-blue-100 p-3 rounded-full">
<Calendar className="h-6 w-6 text-blue-600" />
</div>
<h3 className="ml-4 text-xl font-semibold text-gray-900">Leave Management</h3>
</div>
<p className="text-gray-600 mb-4">Apply for leave, track leave balance, and manage leave requests.</p>
<ul className="text-sm text-gray-500 space-y-1">
<li>• Apply for different leave types</li>
<li>• Check leave balance</li>
<li>• View leave history</li>
</ul>
</div>
</Link>

{/* Job Profile */}
<Link href="/dashboard/job-profile">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
<div className="flex items-center mb-4">
<div className="bg-green-100 p-3 rounded-full">
<Briefcase className="h-6 w-6 text-green-600" />
</div>
<h3 className="ml-4 text-xl font-semibold text-gray-900">Job Profile</h3>
</div>
<p className="text-gray-600 mb-4">View and update employee profile, designation, and career progression.</p>
<ul className="text-sm text-gray-500 space-y-1">
<li>• Personal information</li>
<li>• Career progression</li>
<li>• Department details</li>
</ul>
</div>
</Link>

{/* Transfer Management */}
<Link href="/dashboard/transfers">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
<div className="flex items-center mb-4">
<div className="bg-orange-100 p-3 rounded-full">
<MapPin className="h-6 w-6 text-orange-600" />
</div>
<h3 className="ml-4 text-xl font-semibold text-gray-900">Transfer Management</h3>
</div>
<p className="text-gray-600 mb-4">Handle employee transfers, postings, and location changes.</p>
<ul className="text-sm text-gray-500 space-y-1">
<li>• Transfer requests</li>
<li>• Posting history</li>
<li>• Location tracking</li>
</ul>
</div>
</Link>

{/* Promotion System */}
<Link href="/dashboard/promotion">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
<div className="flex items-center mb-4">
<div className="bg-red-100 p-3 rounded-full">
<TrendingUp className="h-6 w-6 text-red-600" />
</div>
<h3 className="ml-4 text-xl font-semibold text-gray-900">Promotion System</h3>
</div>
<p className="text-gray-600 mb-4">Track promotion cycles, eligibility, and career advancement.</p>
<ul className="text-sm text-gray-500 space-y-1">
<li>• Promotion eligibility</li>
<li>• Performance reviews</li>
<li>• Grade progression</li>
</ul>
</div>
</Link>

{/* Service Book */}
<Link href="/dashboard/service-book">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
<div className="flex items-center mb-4">
<div className="bg-indigo-100 p-3 rounded-full">
<BookOpen className="h-6 w-6 text-indigo-600" />
</div>
<h3 className="ml-4 text-xl font-semibold text-gray-900">Service Book</h3>
</div>
<p className="text-gray-600 mb-4">Maintain comprehensive service records and documentation.</p>
<ul className="text-sm text-gray-500 space-y-1">
<li>• Service history</li>
<li>• Document management</li>
<li>• Career milestones</li>
</ul>
</div>
</Link>
</div>

<div className="text-center mt-8">
<p className="text-gray-600 mb-4">Ready to explore the full dashboard?</p>
<div className="flex gap-4 justify-center">
<Link href="/login">
<button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
Login to Access Dashboard
</button>
</Link>
<Link href="/signup">
<button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
Create Account
</button>
</Link>
</div>
</div>
</div>
</section>
);
}

// --- 7. Footer ---
// The final footer for the page.
function Footer() {
return (
<footer className="bg-black text-gray-300"> {/* Changed from bg-gray-900 to bg-black */}
{/* Reduced vertical padding from py-12 to py-8 and removed max-width */}
<div className="px-4 py-8 sm:px-6 lg:px-8"> {/* Removed mx-auto max-w-7xl */}
{/* Reduced gap from 8 to 6 */}
<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
{/* Column 1 */}
<div>
<h4 className="text-sm font-semibold uppercase text-white">About</h4>
<ul className="mt-4 space-y-2">
<li><a href="#" className="text-sm hover:text-white">About Manav Sampada</a></li>
<li><a href="#" className="text-sm hover:text-white">Contact Us</a></li>
<li><a href="#" className="text-sm hover:text-white">Feedback</a></li>
</ul>
</div>
{/* Column 2 */}
<div>
<h4 className="text-sm font-semibold uppercase text-white">Policies</h4>
<ul className="mt-4 space-y-2">
<li><a href="#" className="text-sm hover:text-white">Privacy Policy</a></li>
<li><a href="#" className="text-sm hover:text-white">Terms of Use</a></li>
<li><a href="#" className="text-sm hover:text-white">Accessibility</a></li>
</ul>
</div>
{/* Column 3 */}
<div>
<h4 className="text-sm font-semibold uppercase text-white">Resources</h4>
<ul className="mt-4 space-y-2">
<li><a href="#" className="text-sm hover:text-white">Helpdesk</a></li>
<li><a href="#" className="text-sm hover:text-white">Sitemap</a></li>
<li><a href="#" className="text-sm hover:text-white">FAQ</a></li>
</ul>
</div>
{/* Column 4 */}
<div>
<h4 className="text-sm font-semibold uppercase text-white">Contact</h4>
<p className="mt-4 text-sm">
Manav Sampada Project<br />
Uttar Pradesh, India<br />
Email: help@up.gov.in
</p>
</div>
</div>
{/* Reduced top margin/padding from 8 to 6 */}
<div className="mt-6 border-t border-gray-700 pt-6 text-sm">
{/* Disclaimer Section */}
<div className="mb-6 text-xs text-gray-400">
<p className="font-semibold text-gray-200">Disclaimer:</p>
<p>Manav Sampada, Uttar Pradesh website is being managed by NIC, UP State Centre, Lucknow as HRMS tool for state government departments of UP. The data available on the website is owned by respective department.</p>
</div>

{/* Bottom Bar: NIC Logo, Browser Info, Copyright */}
<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
{/* NIC Logo */}
<div className="flex flex-shrink-0 items-center gap-3">
<img
src="https://www.nic.in/wp-content/themes/NICTheme/assets/images/logo.png"
alt="NIC Logo"
className="h-10 w-auto bg-white p-1 rounded"
onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
/>
<span className="text-left text-xs font-semibold text-white">
National Informatics Centre,
<br />
Government of India
</span>
</div>

{/* Browser Info */}
<div className="text-center text-xs text-gray-400 md:text-left">
<p>This website is best viewed by Internet Explorer 10.x or higher versions,</p>
<p>Mozilla Firefox 33.x or higher, Chrome 35.x or higher, or equivalent browser software.</p>
</div>
</div>

{/* Copyright - Reduced top margin/padding from 8 to 6 */}
<div className="mt-6 border-t border-gray-700 pt-6 text-center">
<p>&copy; {new Date().getFullYear()} Government of Uttar Pradesh. All rights reserved.</p>
<p className="mt-1">Designed & Developed for ReVibe Code Competition.</p>
</div>
</div>
</div>
</footer>
);
}

// --- Mobile Menu Component ---
// A simple slide-down menu for mobile.
function MobileMenu({ onClose }: { onClose: () => void }) {
return (
<div className="absolute left-0 top-28 z-40 w-full animate-slide-down border-b border-gray-200 bg-white p-4 shadow-lg sm:hidden">
<div className="flex flex-col gap-4">
{/* Added back onClick handlers to close the menu */}
<a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-700">Home</a>
<a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-700">Important Links</a>
<a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-700">Statistics</a>
<a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-700">Public Window</a>
<a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gamma-50 hover:text-purple-700">Download App</a>
<Link href="/login" onClick={onClose}>
<button className="block w-full rounded-md bg-purple-600 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-purple-700">
Login
</button>
</Link>
</div>
</div>
);
}

// Note: You'll need to add these keyframes to your Tailwind config
// or a global CSS file for the mobile menu animation.
// Since this is a single file, I'm adding a <style> tag inside App.
// In Next.js, you'd put this in your globals.css
function GlobalStyles() {
return (
<style jsx global>{`
@keyframes slide-down {
from {
opacity: 0;
transform: translateY(-10px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
.animate-slide-down {
animation: slide-down 0.3s ease-out;
}

/* Removed text-gradient animation */

/* Removed text-glow animation */

/* Added animation for the flag wave */
@keyframes wave {
0% { transform: scaleX(1); }
50% { transform: scaleX(1.3) skewX(-10deg); }
100% { transform: scaleX(1); }
}
.animate-wave {
animation: wave 2s ease-in-out infinite;
transform-origin: left;
}
`}</style>
);
}
// To use the GlobalStyles, add <GlobalStyles /> inside the App component return.
// For simplicity in this single-file preview, I've left it as a comment.