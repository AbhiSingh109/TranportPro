import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Truck, ShieldCheck, Clock, MapPin, Search, Phone, Mail,
  ArrowRight, CheckCircle2, ChevronRight, Package, Warehouse,
  Building2, Users, FileCheck, Star, Award, Globe, Zap,
  TrendingUp, ChevronDown, Menu, X, ArrowUpRight
} from 'lucide-react'

// ─── Animated counter hook ─────────────────────────────────────────────────
function useCounter(end: number, duration = 2000, started: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, started])
  return count
}

// ─── Scroll-reveal wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

// ─── Truck SVG (inline, no external dep) ──────────────────────────────────
const TruckSVG = () => (
  <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
    <rect x="2" y="8" width="38" height="18" rx="2" fill="#1e40af" />
    <rect x="40" y="14" width="18" height="12" rx="2" fill="#2563eb" />
    <rect x="41" y="15" width="10" height="7" rx="1" fill="#93c5fd" />
    <rect x="1" y="24" width="62" height="3" rx="1" fill="#1e3a8a" />
    <circle cx="12" cy="27" r="4" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
    <circle cx="12" cy="27" r="1.5" fill="#93c5fd" />
    <circle cx="50" cy="27" r="4" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.5" />
    <circle cx="50" cy="27" r="1.5" fill="#93c5fd" />
  </svg>
)

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lrInput, setLrInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (lrInput.trim()) navigate(`/track?lr=${encodeURIComponent(lrInput.trim())}`)
  }

  const c1 = useCounter(28, 1800, statsVisible)
  const c2 = useCounter(99, 1800, statsVisible)
  const c3 = useCounter(500, 2000, statsVisible)
  const c4 = useCounter(50000, 2200, statsVisible)

  const services = [
    {
      icon: <Truck size={28} />, color: 'from-blue-600 to-blue-800',
      title: 'Full Truckload (FTL)', tag: 'High Volume',
      desc: 'Dedicated multi-axle trucks and open-body trailers for point-to-point full-load commercial dispatches.',
      features: ['32-ton capacity trucks', 'Direct express transit', 'GPS tracked fleet'],
    },
    {
      icon: <Package size={28} />, color: 'from-indigo-600 to-purple-700',
      title: 'Part Truckload (PTL)', tag: 'Cost Efficient',
      desc: 'Consolidated parcel shipments with LR/GR receipts. Pay only for the tonnage your goods occupy.',
      features: ['Accurate weight billing', 'Safe packaging', 'Scheduled dispatches'],
    },
    {
      icon: <Warehouse size={28} />, color: 'from-emerald-600 to-teal-700',
      title: 'Warehousing & Storage', tag: 'Short & Long Term',
      desc: 'Bonded and open warehousing near industrial zones with inventory management and cross-docking.',
      features: ['Inventory tracking', 'Cross-docking', 'Loading/unloading crew'],
    },
    {
      icon: <FileCheck size={28} />, color: 'from-orange-500 to-red-600',
      title: 'Contract Logistics', tag: 'Enterprise',
      desc: 'Long-term enterprise agreements with monthly credit cycles and consolidated GST invoicing.',
      features: ['Credit limits up to ₹25L', 'GST e-invoices', 'Ledger reconciliation'],
    },
  ]

  const whyUs = [
    { icon: <Zap size={22} />, color: 'bg-amber-400', title: 'Real-Time LR Tracking', desc: 'Live consignment status with transit checkpoints from dispatch to delivery confirmation.' },
    { icon: <ShieldCheck size={22} />, color: 'bg-blue-500', title: 'Full GST Compliance', desc: 'Automated tax invoices with correct HSN codes, e-way bill integration, and GSTIN validation.' },
    { icon: <Users size={22} />, color: 'bg-emerald-500', title: 'Verified Driver Network', desc: 'All commercial vehicle drivers verified with valid HCV licences and emergency contact records.' },
    { icon: <Clock size={22} />, color: 'bg-purple-500', title: 'On-Time Performance', desc: 'SLA-backed delivery schedules with proactive delay alerts and POD digital confirmation.' },
    { icon: <Award size={22} />, color: 'bg-rose-500', title: 'Goods Insurance Cover', desc: 'Transit insurance with declared value coverage available on all FTL and PTL shipments.' },
    { icon: <TrendingUp size={22} />, color: 'bg-teal-500', title: 'Live Analytics Dashboard', desc: 'Per-trip profit/loss, monthly revenue, expense breakdown, and outstanding balance tracking.' },
  ]

  const testimonials = [
    { name: 'Rajiv Mehra', role: 'Supply Chain Manager, Tata Motors', text: 'Express Logistics has been our most reliable partner for Pune–Indore freight. Zero mismatches on LR documentation in 3 years.', rating: 5 },
    { name: 'Sandeep Patil', role: 'Logistics Head, Reliance Retail', text: 'Computerized billing and real-time tracking are exactly what we needed. Outstanding dues are now tracked to the rupee.', rating: 5 },
    { name: 'Vikram Shinde', role: 'Operations Director, Mahindra Logistics', text: 'The digital LR system eliminated our paper chase entirely. Freight invoices are ready same day — huge improvement.', rating: 5 },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/98 backdrop-blur-md shadow-lg shadow-black/5 border-b border-gray-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Truck size={22} />
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>Express<span className="text-blue-400">Logistics</span></span>
              <div className={`text-[9px] uppercase font-bold tracking-widest ${scrolled ? 'text-gray-400' : 'text-blue-200'}`}>Kala-Amb • Pan India</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {['Services', 'About', 'Track Shipment', 'Contact'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(' ', '-')}`}
                className={`hover:text-blue-400 transition-colors ${scrolled ? 'text-gray-700' : 'text-white/80'}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5">
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5">
                Staff Portal <ArrowUpRight size={15} />
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 space-y-4">
            {['Services', 'About', 'Track Shipment', 'Contact'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100">
                {label}
              </a>
            ))}
            <Link to="/login" className="block text-center bg-blue-600 text-white font-bold py-3 rounded-xl text-sm mt-2">
              Staff Portal
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-blue-950/70 to-slate-900/85" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Glowing blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/5 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Pan-India Road Freight • Est. Kala-Amb, Himachal Pradesh
              </div>

              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                  Goods Moving.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300">
                    Business Growing.
                  </span>
                </h1>
                <p className="text-slate-300 text-lg mt-6 leading-relaxed max-w-lg">
                  <strong className="text-white">Express Logistics</strong> — Full truckload, parcel booking, GPS-tracked transit, computerized Lorry Receipts & GST billing. Trusted by India's leading manufacturers.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#track-shipment" className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-2xl text-sm transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-1">
                  <Search size={16} /> Track My Consignment
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="tel:+919315604357" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-4 rounded-2xl text-sm border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1">
                  <Phone size={16} className="text-emerald-400" /> +91 93156 04357
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: <ShieldCheck size={14} />, text: 'GST Registered' },
                  { icon: <Award size={14} />, text: 'Transit Insurance' },
                  { icon: <Globe size={14} />, text: 'Pan India Network' },
                ].map(badge => (
                  <div key={badge.text} className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    <span className="text-blue-400">{badge.icon}</span> {badge.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Tracking Widget + Stats */}
            <div className="space-y-5">

              {/* Track Widget */}
              <div id="track-shipment" className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Track Your Consignment</p>
                    <p className="text-slate-400 text-xs">Enter LR / GR Number</p>
                  </div>
                </div>
                <form onSubmit={handleTrackSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. LR-2026-00101"
                      value={lrInput}
                      onChange={e => setLrInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/40 flex items-center gap-1 shrink-0">
                    Track <ChevronRight size={15} />
                  </button>
                </form>
                <p className="text-slate-500 text-xs mt-3 text-center">Free public tracking — no login required</p>
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '🚛', label: 'Routes', value: '500+', sub: 'Pan-India', color: 'from-blue-500/20 to-blue-700/20 border-blue-500/30' },
                  { emoji: '📋', label: 'LR/GR', value: '100%', sub: 'Computerized', color: 'from-emerald-500/20 to-teal-700/20 border-emerald-500/30' },
                  { emoji: '⏱️', label: 'Tracking', value: '24/7', sub: 'Live Updates', color: 'from-amber-500/20 to-orange-700/20 border-amber-500/30' },
                  { emoji: '✅', label: 'On-Time', value: '99%', sub: 'Deliveries', color: 'from-indigo-500/20 to-purple-700/20 border-indigo-500/30' },
                ].map(card => (
                  <div key={card.label} className={`bg-gradient-to-br ${card.color} border backdrop-blur-sm p-4 rounded-2xl`}>
                    <div className="text-2xl mb-1">{card.emoji}</div>
                    <p className="text-2xl font-black text-white">{card.value}</p>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">{card.label}</p>
                    <p className="text-xs text-slate-400">{card.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center mt-16">
            <a href="#services" className="flex flex-col items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors animate-bounce">
              <span className="text-xs uppercase tracking-widest font-semibold">Explore</span>
              <ChevronDown size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-3">Our Services</span>
            <h2 className="text-4xl font-black text-gray-900">Comprehensive Freight Solutions</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">From single-crate parcels to full multi-axle truck dispatches — we move every size of goods, efficiently and reliably.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 100}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-2 group h-full">
                  <div className={`bg-gradient-to-br ${svc.color} p-6 relative overflow-hidden`}>
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full" />
                    <div className="text-white relative z-10">{svc.icon}</div>
                    <span className="mt-3 inline-block text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full relative z-10">{svc.tag}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{svc.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.desc}</p>
                    <ul className="space-y-2">
                      {svc.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO SPLIT SECTION ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          {/* Photo */}
          <div className="relative min-h-[300px] lg:min-h-auto overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=900&q=85&auto=format&fit=crop"
              alt="Heavy truck on highway"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-950/30" />
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-900">On-Time Delivery</span>
              </div>
              <p className="text-2xl font-black text-gray-900">99.4%</p>
              <p className="text-xs text-gray-500">Safe delivery rate across all routes</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-slate-900 text-white p-10 lg:p-16 flex flex-col justify-center">
            <Reveal>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-4">Why Choose Us</span>
              <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">
                Precision Logistics Backed by Technology
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Every shipment is backed by our proprietary transport management system — from the first booking entry to final Proof-of-Delivery signature.
              </p>

              <div className="space-y-5">
                {[
                  { icon: '📄', title: 'Computerized LR/GR Receipts', desc: 'GST-compliant bilty generated instantly with auto LR numbers.' },
                  { icon: '📍', title: 'Live Transit Checkpoints', desc: 'Route updates from Kala-Amb hub to destination doorstep.' },
                  { icon: '💰', title: 'Transparent Freight Billing', desc: 'Itemized GST invoices. No hidden freight charges.' },
                  { icon: '🛡️', title: 'Goods Transit Insurance', desc: 'Declared value coverage on FTL and PTL consignments.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <p className="font-bold text-white text-sm">{item.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: c1, suffix: ' Ton', label: 'Max Truck Capacity', icon: '🏋️' },
              { value: c2, suffix: '%', label: 'On-Time Delivery Rate', icon: '✅' },
              { value: c3, suffix: '+', label: 'Direct Routes Covered', icon: '🗺️' },
              { value: c4.toLocaleString('en-IN'), suffix: '+', label: 'Consignments Delivered', icon: '📦' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-4xl font-black">{stat.value}<span className="text-blue-200">{stat.suffix}</span></p>
                <p className="text-blue-200 text-sm font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US GRID ──────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-3">Why Express Logistics</span>
            <h2 className="text-4xl font-black text-gray-900">What Makes Us Different</h2>
            <p className="text-gray-500 mt-4">Built for Indian road freight — with the documentation, compliance, and billing features that actually matter.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="group bg-gray-50 hover:bg-white p-7 rounded-3xl border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={`w-11 h-11 ${item.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO + ABOUT SPLIT ───────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-4">About Express Logistics</span>
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                Powering Freight <br/>from Kala-Amb <br/>
                <span className="text-blue-600">to Every Corner of India</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Express Logistics</strong>, founded and operated by <strong className="text-gray-900">Jitendar Singh</strong>, is a full-service road transport and freight agency based at <strong className="text-gray-900">Main Chowk, Kala-Amb, Himachal Pradesh</strong>. With a GST-registered operation under GSTIN <strong className="font-mono text-gray-900">06BHWPS1453H2ZU</strong>, we provide reliable commercial goods movement across India's industrial belt.
                </p>
                <p>
                  From single-crate part-load parcels to full 32-ton truck dispatches, every consignment is managed end-to-end with computerized LR/GR documentation, live transit tracking, and transparent GST invoicing.
                </p>
              </div>

              {/* GSTIN Badge */}
              <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Registered Firm</p>
                  <p className="font-bold text-gray-900 text-sm">Express Logistics</p>
                  <p className="text-xs text-gray-500 font-mono">GSTIN: 06BHWPS1453H2ZU</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: 'Proprietor', value: 'Jitendar Singh' },
                  { label: 'Location', value: 'Kala-Amb, HP' },
                  { label: 'Network', value: 'Pan India' },
                  { label: 'GSTIN', value: '06BHWPS1453H2ZU' },
                ].map(item => (
                  <div key={item.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=85&auto=format&fit=crop"
                  alt="Logistics warehouse operations"
                  className="rounded-3xl shadow-2xl w-full object-cover h-[520px]"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-5 max-w-[220px] border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <TrendingUp size={16} className="text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">Monthly Stats</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Deliveries</span>
                      <span className="font-bold text-gray-900">50,000+</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '99%' }} />
                    </div>
                    <p className="text-xs text-gray-400">99.4% on-time performance</p>
                  </div>
                </div>
                {/* Route badge */}
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl p-4 shadow-xl text-center">
                  <p className="text-2xl font-black">500+</p>
                  <p className="text-xs font-semibold text-blue-200">Routes</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-3">Client Testimonials</span>
            <h2 className="text-4xl font-black text-gray-900">What Our Clients Say</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=70&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-blue-700/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest block mb-4">Ready to Ship?</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Get Your Goods Moving Today
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
              Call our dispatch team or visit our office at Main Chowk, Kala-Amb. Instant booking confirmation with computerized LR receipt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919315604357" className="group flex items-center justify-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-black px-8 py-4 rounded-2xl text-sm transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1">
                <Phone size={18} className="text-blue-600" />
                Call Now: +91 93156 04357
              </a>
              <Link to="/login" className="flex items-center justify-center gap-2 bg-blue-900/50 hover:bg-blue-900/70 text-white font-bold px-8 py-4 rounded-2xl text-sm border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-1">
                Staff Login <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-3">Contact Us</span>
            <h2 className="text-4xl font-black text-gray-900">Our Operations Desk</h2>
            <p className="text-gray-500 mt-4">Freight inquiry, booking, or corporate transport requirement? Reach us directly.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <MapPin size={24} />, color: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-700',
                title: 'Office Address',
                lines: ['Express Logistics, Main Chowk', 'Kala-Amb, Sirmaur District', 'Himachal Pradesh — 173030'],
              },
              {
                icon: <Phone size={24} />, color: 'bg-emerald-600', iconBg: 'bg-emerald-50 text-emerald-700',
                title: 'Dispatch Helpline',
                lines: ['+91 93156 04357', 'Jitendar Singh (Proprietor)', 'Mon–Sat: 8 AM – 8 PM'],
              },
              {
                icon: <Building2 size={24} />, color: 'bg-indigo-600', iconBg: 'bg-indigo-50 text-indigo-700',
                title: 'GST & Firm Details',
                lines: ['GSTIN: 06BHWPS1453H2ZU', 'Express Logistics', 'Registered: Himachal Pradesh'],
              },
            ].map(card => (
              <Reveal key={card.title}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className={`${card.color} h-1.5 w-full`} />
                  <div className="p-7">
                    <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center mb-5`}>
                      {card.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">{card.title}</h3>
                    <div className="space-y-1">
                      {card.lines.map((line, i) => (
                        <p key={i} className={`text-sm ${i === 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Truck size={20} className="text-white" />
                </div>
                <div>
                  <span className="text-white font-black text-lg">Express<span className="text-blue-400">Logistics</span></span>
                  <div className="text-slate-500 text-xs">Kala-Amb, Himachal Pradesh</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed">
                Full-service road freight agency — FTL, PTL, contract logistics and warehousing. GST compliant, digitally managed.
              </p>
              <p className="text-xs mt-3 font-mono text-slate-500">GSTIN: 06BHWPS1453H2ZU</p>
            </div>

            {/* Quick Links */}
            <div>
              <p className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Quick Links</p>
              <div className="space-y-2 text-xs">
                <a href="#services" className="block hover:text-white transition-colors">Our Services</a>
                <a href="#about" className="block hover:text-white transition-colors">About Express Logistics</a>
                <a href="#track-shipment" className="block hover:text-white transition-colors">Track Consignment</a>
                <a href="#contact" className="block hover:text-white transition-colors">Contact & Address</a>
                <Link to="/login" className="block hover:text-white transition-colors">Staff Portal Login</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-bold text-sm mb-4 uppercase tracking-wide">Contact</p>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>Express Logistics, Main Chowk, Kala-Amb, Himachal Pradesh 173030</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400 shrink-0" />
                  <a href="tel:+919315604357" className="hover:text-white transition-colors">+91 93156 04357</a>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-400 shrink-0" />
                  <span>Jitendar Singh (Proprietor)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} Express Logistics, Kala-Amb. All rights reserved. Powered by TransportPro EMS.</p>
            <div className="flex items-center gap-6">
              <Link to="/track" className="hover:text-white transition-colors">Public Tracking</Link>
              <Link to="/login" className="hover:text-white transition-colors">Staff Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
