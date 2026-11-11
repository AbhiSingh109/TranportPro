import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../services/api'
import { Package, Truck, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats().then(r => r.data),
    refetchInterval: 30000,
  })

  if (isLoading) return <div className="text-gray-400 py-12 text-center">Loading dashboard...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Bookings Today" value={data?.bookings_today ?? 0} icon={Package} color="bg-blue-600" />
        <StatCard label="Bookings This Month" value={data?.bookings_this_month ?? 0} icon={Package} color="bg-indigo-600" />
        <StatCard label="Active Trips" value={data?.active_trips ?? 0} icon={Truck} color="bg-green-600" />
        <StatCard label="In Transit" value={data?.in_transit ?? 0} icon={Truck} color="bg-orange-500" />
        <StatCard label="Pending Deliveries" value={data?.pending_deliveries ?? 0} icon={Clock} color="bg-yellow-500" />
        <StatCard label="Completed Deliveries" value={data?.completed_deliveries ?? 0} icon={CheckCircle} color="bg-emerald-600" />
        <StatCard label="Monthly Revenue (₹)" value={`₹${Number(data?.monthly_revenue ?? 0).toLocaleString('en-IN')}`} icon={TrendingUp} color="bg-purple-600" />
        <StatCard label="Monthly Expenses (₹)" value={`₹${Number(data?.total_expenses_this_month ?? 0).toLocaleString('en-IN')}`} icon={AlertCircle} color="bg-red-500" />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Welcome to TransportPro</h2>
        <p className="text-gray-500 text-sm">
          Use the sidebar to navigate to Bookings, Trips, Fleet, Drivers, Customers, Billing, Payments, Expenses, and Reports.
        </p>
      </div>
    </div>
  )
}

