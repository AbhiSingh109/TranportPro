import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Truck, ShieldCheck, Clock, MapPin, Search, Phone, Mail,
  ArrowRight, CheckCircle2, ChevronRight, Package, Warehouse,
  Building2, Users, FileCheck
} from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lrInput, setLrInput] = useState('')

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (lrInput.trim()) {
      navigate(`/track?lr=${encodeURIComponent(lrInput.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md">
              <Truck size={22} />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Transport<span className="text-blue-700">Pro</span></span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-gray-400 ml-2 tracking-wider">Logistics & Fleet</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#services" className="hover:text-blue-700 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-700 transition-colors">About Us</a>
            <a href="#tracking" className="hover:text-blue-700 transition-colors">Track Shipment</a>
            <a href="#contact" className="hover:text-blue-700 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-xs sm:text-sm flex items-center gap-1.5 shadow-sm">
                Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary text-xs sm:text-sm flex items-center gap-1.5 shadow-sm">
                Staff & Client Portal
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Live Tracking Box */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-blue-400" /> Reliable Pan-India Road Freight
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Smart Goods Transport & Fleet Operations
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Full truckload, parcel bookings, computerized Lorry Receipts (LR/GR), real-time transit checkpoints, and transparent GST billing.
              </p>

              {/* Quick Tracking Widget */}
              <div id="tracking" className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-2">
                  Track Your Consignment (LR / GR Number)
                </span>
                <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. LR-2026-00101"
                      value={lrInput}
                      onChange={e => setLrInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-blue-600/30">
                    Track Now <ChevronRight size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Hero Stats Card */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <p className="text-3xl font-extrabold text-blue-400">100%</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">Computerized LR/GR</p>
                <p className="text-xs text-slate-500 mt-2">Zero ambiguity paperless receipts and GST tax compliance.</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <p className="text-3xl font-extrabold text-emerald-400">24/7</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">Status Checkpoints</p>
                <p className="text-xs text-slate-500 mt-2">Timely route updates from dispatch to doorstep delivery.</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <p className="text-3xl font-extrabold text-amber-400">500+</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">Direct Routes</p>
                <p className="text-xs text-slate-500 mt-2">Connecting commercial manufacturing hubs nationwide.</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <p className="text-3xl font-extrabold text-indigo-400">Instant</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">POD Confirmation</p>
                <p className="text-xs text-slate-500 mt-2">Proof of delivery captured digitally upon consignee receipt.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-2">Our Capabilities</span>
            <h2 className="text-3xl font-black text-gray-900">Comprehensive Transportation Solutions</h2>
            <p className="text-gray-500 text-sm mt-3">Tailored services designed for industrial manufacturers, retail distributors, and commercial suppliers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Full Truckload (FTL) Freight</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Dedicated multi-axle trucks, open-body trailers, and container fleets for high-volume commercial dispatches point-to-point.
              </p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Dedicated truck allocation</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Direct express transit</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> High-tonnage capacity (up to 32 Tons)</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-6">
                <Package size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Part Truckload (PTL / Parcel)</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Cost-effective parcel and consolidation services. Pay only for the space and weight your goods occupy.
              </p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Accurate weight & crate measurement</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Safe handling & packaging protection</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Scheduled regular dispatches</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <FileCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Contract Logistics & Billing</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Long-term enterprise contracts with monthly credit cycles, consolidated GST invoicing, and dedicated logistics coordinators.
              </p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Structured credit limits</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Instant GST e-invoices</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600" /> Dedicated ledger reconciliation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-2">About TransportPro</span>
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                Built to Power India's Road Transport Agencies
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  TransportPro is an end-to-end transport agency management platform that connects consignors, dispatchers, drivers, and consignees into one synchronized operational workflow.
                </p>
                <p>
                  From the moment goods are booked at the origin counter to final Proof-of-Delivery verification, every milestone is backed by verifiable digital audit trails, automated LR/GR generation, and financial precision.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100">
                <div>
                  <h4 className="text-2xl font-black text-gray-900">50,000+</h4>
                  <p className="text-xs text-gray-500 mt-1">Consignments Handled</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900">99.4%</h4>
                  <p className="text-xs text-gray-500 mt-1">On-Time Safe Deliveries</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-bold">Why Leading Shippers Choose TransportPro</h3>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Full Regulatory Compliance</p>
                      <p className="text-xs text-slate-400 mt-0.5">Automated validation of driver licences, fitness certificates, and 12-digit E-Way bills.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Zero Conflict Scheduling</p>
                      <p className="text-xs text-slate-400 mt-0.5">Database-level safeguards prevent double-booking vehicles or drivers on overlapping trips.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 size={20} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Consignor & Consignee Ledger</p>
                      <p className="text-xs text-slate-400 mt-0.5">Separate accounting balances, partial payment handling, and real-time outstanding tracking.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-2">Get in Touch</span>
            <h2 className="text-3xl font-black text-gray-900">Contact Our Operations Desk</h2>
            <p className="text-gray-500 text-sm mt-2">Have a freight inquiry, fleet booking, or corporate transport requirement? Speak with our dispatch team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center p-6 bg-white">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4">
                <MapPin size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Central Hub Address</h3>
              <p className="text-xs text-gray-500">Transport Nagar, Ring Road, Indore, Madhya Pradesh 452010</p>
            </div>

            <div className="card text-center p-6 bg-white">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <Phone size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Dispatch Helpline</h3>
              <p className="text-xs text-gray-500">+91 (022) 6665-8282 / +91 98931 23456</p>
            </div>

            <div className="card text-center p-6 bg-white">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-4">
                <Mail size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Email Inquiries</h3>
              <p className="text-xs text-gray-500">operations@transportpro.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Truck size={20} className="text-blue-500" />
            <span>TransportPro</span>
          </div>
          <p>© {new Date().getFullYear()} TransportPro – Transport Agency Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/track" className="hover:text-white transition-colors">Public Tracking</Link>
            <Link to="/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
