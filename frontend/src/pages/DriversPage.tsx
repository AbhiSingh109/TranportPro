import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDrivers, createDriver } from '../services/api'
import { Plus, Search, UserCheck, Phone, CreditCard, ShieldCheck } from 'lucide-react'

export default function DriversPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    licence_number: '',
    licence_expiry: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    employment_status: 'active',
    notes: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => getDrivers().then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (newDriver: object) => createDriver(newDriver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      setIsModalOpen(false)
      setErrorMsg(null)
      setFormData({
        full_name: '',
        phone_number: '',
        address: '',
        licence_number: '',
        licence_expiry: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        employment_status: 'active',
        notes: '',
      })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.full_name?.[0] ||
                  err.response?.data?.licence_number?.[0] ||
                  err.response?.data?.detail ||
                  err.message ||
                  'Failed to add driver'
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const filtered = data?.results?.filter((d: any) =>
    d.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.licence_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone_number?.includes(searchTerm)
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Roster</h1>
          <p className="text-sm text-gray-500">Manage commercial driving licences, duty status, and emergency contacts</p>
        </div>
        <button
          onClick={() => {
            setErrorMsg(null)
            setIsModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by driver name, licence number, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading driver roster...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Driver Name', 'Phone Number', 'Driving Licence No.', 'Licence Expiry', 'Emergency Contact', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered?.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-indigo-600" />
                      {d.full_name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="flex items-center gap-1.5"><Phone size={13} /> {d.phone_number}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-mono font-medium">{d.licence_number}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {d.licence_expiry ? (
                      <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-600" /> {d.licence_expiry}</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {d.emergency_contact_phone ? `${d.emergency_contact_name || 'Contact'}: ${d.emergency_contact_phone}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${d.employment_status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                      {d.employment_status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {!filtered?.length && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No drivers registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Commercial Driver</h2>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Primary Phone *</label>
                  <input
                    required
                    type="tel"
                    className="input"
                    value={formData.phone_number}
                    onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Licence Number *</label>
                  <input
                    required
                    type="text"
                    className="input font-mono uppercase"
                    value={formData.licence_number}
                    onChange={e => setFormData({ ...formData, licence_number: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="label">Licence Expiry Date</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.licence_expiry}
                    onChange={e => setFormData({ ...formData, licence_expiry: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Emergency Contact Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.emergency_contact_name}
                    onChange={e => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.emergency_contact_phone}
                    onChange={e => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Permanent Residential Address</label>
                <textarea
                  rows={2}
                  className="input"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Saving...' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

