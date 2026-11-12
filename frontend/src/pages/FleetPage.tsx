import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVehicles, createVehicle } from '../services/api'
import { Plus, Search, Truck, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function FleetPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    registration_number: '',
    vehicle_type: '',
    capacity_tons: '10.00',
    ownership_type: 'owned',
    status: 'available',
    insurance_expiry: '',
    fitness_expiry: '',
    permit_expiry: '',
    pollution_expiry: '',
    notes: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles().then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (newVehicle: object) => createVehicle(newVehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      setIsModalOpen(false)
      setErrorMsg(null)
      setFormData({
        registration_number: '',
        vehicle_type: '',
        capacity_tons: '10.00',
        ownership_type: 'owned',
        status: 'available',
        insurance_expiry: '',
        fitness_expiry: '',
        permit_expiry: '',
        pollution_expiry: '',
        notes: '',
      })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.registration_number?.[0] ||
                  err.response?.data?.detail ||
                  err.message ||
                  'Failed to add vehicle'
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const filtered = data?.results?.filter((v: any) =>
    v.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">Available</span>
      case 'on_trip':
        return <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">On Trip</span>
      case 'maintenance':
        return <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">In Maintenance</span>
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet & Vehicles</h1>
          <p className="text-sm text-gray-500">Track company & leased trucks, tonnage capacities, and compliance expiry dates</p>
        </div>
        <button
          onClick={() => {
            setErrorMsg(null)
            setIsModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by registration number, model, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading fleet inventory...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Registration No.', 'Vehicle Model & Type', 'Payload (Tons)', 'Ownership', 'Insurance Expiry', 'Fitness Expiry', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered?.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-blue-600" />
                      {v.registration_number}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{v.vehicle_type}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{v.capacity_tons} Tons</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{v.ownership_type?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {v.insurance_expiry ? (
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" /> {v.insurance_expiry}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {v.fitness_expiry ? (
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" /> {v.fitness_expiry}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(v.status)}</td>
                </tr>
              ))}
              {!filtered?.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No vehicles found in fleet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Fleet Vehicle</h2>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Registration No. *</label>
                  <input
                    required
                    type="text"
                    className="input uppercase font-mono"
                    placeholder="e.g. MH12AB1234"
                    value={formData.registration_number}
                    onChange={e => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="label">Vehicle Model / Type *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    placeholder="e.g. Tata 1613 Heavy Truck"
                    value={formData.vehicle_type}
                    onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Capacity (Tons) *</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="input"
                    value={formData.capacity_tons}
                    onChange={e => setFormData({ ...formData, capacity_tons: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Ownership Type</label>
                  <select
                    className="input"
                    value={formData.ownership_type}
                    onChange={e => setFormData({ ...formData, ownership_type: e.target.value })}
                  >
                    <option value="owned">Owned</option>
                    <option value="leased">Leased</option>
                    <option value="third_party">Third Party</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    className="input"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="available">Available</option>
                    <option value="on_trip">On Trip</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Insurance Expiry Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.insurance_expiry}
                    onChange={e => setFormData({ ...formData, insurance_expiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Fitness Certificate Expiry</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.fitness_expiry}
                    onChange={e => setFormData({ ...formData, fitness_expiry: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Saving...' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

