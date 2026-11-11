import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBookings } from '../services/api'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  lr_generated: 'bg-indigo-100 text-indigo-700',
  ready_for_dispatch: 'bg-yellow-100 text-yellow-700',
  assigned_to_trip: 'bg-orange-100 text-orange-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  closed: 'bg-gray-200 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default function BookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings().then(r => r.data),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <Link to="/bookings/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Booking
        </Link>
      </div>

      {isLoading ? (
        <div className="text-gray-400 text-center py-12">Loading bookings...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Booking No.', 'Date', 'Customer', 'Origin → Destination', 'Payment', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.results?.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-700">
                    <Link to={`/bookings/${b.id}`}>{b.booking_number}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.booking_date}</td>
                  <td className="px-4 py-3 text-gray-800">{b.customer_name || b.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{b.origin} → {b.destination}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-gray-600">{b.payment_type?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {!data?.results?.length && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

