import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExpenses, createExpense, getVehicles, getTrips } from '../services/api'
import { Plus, Search, TrendingDown, Fuel, Shield, Wrench, DollarSign } from 'lucide-react'

export default function ExpensesPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    category: 'fuel',
    amount: '',
    description: '',
    vehicle: '',
    trip: '',
  })

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => getExpenses().then(r => r.data),
  })

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles().then(r => r.data),
  })

  const { data: trips } = useQuery({
    queryKey: ['trips'],
    queryFn: () => getTrips().then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (newExp: object) => createExpense(newExp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setIsModalOpen(false)
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        category: 'fuel',
        amount: '',
        description: '',
        vehicle: '',
        trip: '',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      ...formData,
      vehicle: formData.vehicle || null,
      trip: formData.trip || null,
    })
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'fuel':
        return <Fuel size={14} className="text-orange-500" />
      case 'toll':
        return <Shield size={14} className="text-blue-500" />
      case 'vehicle_repair':
      case 'maintenance':
        return <Wrench size={14} className="text-amber-500" />
      default:
        return <DollarSign size={14} className="text-gray-500" />
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operating Expenses</h1>
          <p className="text-sm text-gray-500">Record fuel, toll, driver allowances, maintenance, and vehicle repairs</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search expense description, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading expenses...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Date', 'Category', 'Amount (₹)', 'Description', 'Vehicle', 'Trip'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses?.results?.map((e: any) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{e.expense_date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 capitalize text-gray-800">
                      {getCategoryIcon(e.category)}
                      {e.category?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-red-600">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-700">{e.description || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.vehicle || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.trip || '—'}</td>
                </tr>
              ))}
              {!expenses?.results?.length && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No expenses recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Log Operating Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expense Date *</label>
                  <input
                    required
                    type="date"
                    className="input"
                    value={formData.expense_date}
                    onChange={e => setFormData({ ...formData, expense_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="fuel">Fuel (Diesel/Petrol)</option>
                    <option value="toll">FASTag / Toll Plaza</option>
                    <option value="driver_allowance">Driver Allowance / Fooding</option>
                    <option value="vehicle_repair">Vehicle Breakdown & Repair</option>
                    <option value="maintenance">Routine Fleet Maintenance</option>
                    <option value="loading">Loading Charges</option>
                    <option value="unloading">Unloading Charges</option>
                    <option value="parking">Parking / Halting Fee</option>
                    <option value="other">Other Incidentals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Amount (₹) *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="input font-bold"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Description / Vendor Notes</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Diesel at Indian Oil Nashik bypass"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Related Vehicle</label>
                  <select
                    className="input"
                    value={formData.vehicle}
                    onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                  >
                    <option value="">General / None</option>
                    {vehicles?.results?.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.registration_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Related Trip</label>
                  <select
                    className="input"
                    value={formData.trip}
                    onChange={e => setFormData({ ...formData, trip: e.target.value })}
                  >
                    <option value="">None</option>
                    {trips?.results?.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.trip_number} ({t.origin}➔{t.destination})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Saving...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
