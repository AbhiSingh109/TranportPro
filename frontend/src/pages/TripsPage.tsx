import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTrips, createTrip, dispatchTrip, completeTrip, getVehicles, getDrivers } from '../services/api'
import { Plus, Search, Truck, Navigation, CheckCircle, Play } from 'lucide-react'

export default function TripsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: new Date().toISOString().split('T')[0],
    expected_arrival: '',
    vehicle: '',
    driver: '',
    remarks: '',
  })

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => getTrips().then(r => r.data),
  })

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: () => getVehicles().then(r => r.data),
  })

  const { data: drivers } = useQuery({
    queryKey: ['drivers', 'active'],
    queryFn: () => getDrivers().then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (newTrip: object) => createTrip(newTrip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      setIsModalOpen(false)
    },
  })

  const dispatchMutation = useMutation({
    mutationFn: (id: number) => dispatchTrip(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => completeTrip(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Planned</span>
      case 'dispatched':
      case 'in_transit':
        return <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">In Transit</span>
      case 'completed':
        return <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Completed</span>
      default:
        return <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip & Dispatch Management</h1>
          <p className="text-sm text-gray-500">Plan routes, assign fleet trucks and commercial drivers, and track transit dispatches</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Create Trip
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by trip number, route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading trips...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Trip No.', 'Route', 'Departure Date', 'Vehicle Assigned', 'Driver', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips?.results?.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{t.trip_number}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{t.origin} ➔ {t.destination}</td>
                  <td className="px-4 py-3 text-gray-600">{t.departure_date}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {t.vehicle ? <span className="font-mono">{t.vehicle}</span> : <span className="text-gray-400 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{t.driver || <span className="text-gray-400 italic">Unassigned</span>}</td>
                  <td className="px-4 py-3">{getStatusBadge(t.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {['planned', 'assigned'].includes(t.status) && (
                        <button
                          onClick={() => dispatchMutation.mutate(t.id)}
                          disabled={dispatchMutation.isPending}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1"
                        >
                          <Play size={12} /> Dispatch
                        </button>
                      )}
                      {['dispatched', 'in_transit'].includes(t.status) && (
                        <button
                          onClick={() => completeMutation.mutate(t.id)}
                          disabled={completeMutation.isPending}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Mark Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!trips?.results?.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No trips recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Origin City *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="e.g. Pune"
                    value={formData.origin}
                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Destination City *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="e.g. Delhi NCR"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Departure Date *</label>
                  <input
                    required
                    type="date"
                    className="input"
                    value={formData.departure_date}
                    onChange={e => setFormData({ ...formData, departure_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Expected Arrival Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.expected_arrival}
                    onChange={e => setFormData({ ...formData, expected_arrival: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Assign Vehicle</label>
                <select
                  className="input"
                  value={formData.vehicle}
                  onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                >
                  <option value="">Select available vehicle...</option>
                  {vehicles?.results?.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.registration_number} ({v.vehicle_type} - {v.capacity_tons}T)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Assign Driver</label>
                <select
                  className="input"
                  value={formData.driver}
                  onChange={e => setFormData({ ...formData, driver: e.target.value })}
                >
                  <option value="">Select active driver...</option>
                  {drivers?.results?.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.full_name} ({d.licence_number})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Route Remarks / Waypoints</label>
                <textarea
                  rows={2}
                  className="input"
                  placeholder="e.g. Via NH52 expressway"
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Planning Trip...' : 'Plan Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
