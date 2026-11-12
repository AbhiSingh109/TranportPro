import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCustomers, createCustomer } from '../services/api'
import { Plus, Search, Building2, Phone, Mail, FileText, CheckCircle2, XCircle } from 'lucide-react'

export default function CustomersPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    company_name: '',
    phone_number: '',
    email: '',
    gstin: '',
    billing_address: '',
    contact_person: '',
    credit_limit: '0',
    notes: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers().then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (newCustomer: object) => createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setIsModalOpen(false)
      setFormData({
        customer_name: '',
        company_name: '',
        phone_number: '',
        email: '',
        gstin: '',
        billing_address: '',
        contact_person: '',
        credit_limit: '0',
        notes: '',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const filtered = data?.results?.filter((c: any) =>
    c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone_number?.includes(searchTerm)
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers & Consignors</h1>
          <p className="text-sm text-gray-500">Manage clients, billing records, and consignor/consignee entities</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, company, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading customer records...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Customer / Company', 'Contact Person', 'Phone / Email', 'GSTIN', 'Credit Limit (₹)', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered?.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div>{c.customer_name}</div>
                    {c.company_name && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 size={12} /> {c.company_name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{c.contact_person || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-1.5"><Phone size={12} /> {c.phone_number}</div>
                    {c.email && <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {c.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{c.gstin || 'Unregistered'}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">₹{Number(c.credit_limit || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    {c.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered?.length && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Customer Name *</label>
                  <input
                    required
                    type="text"
                    className="input"
                    value={formData.customer_name}
                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.company_name}
                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    className="input"
                    value={formData.phone_number}
                    onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">GSTIN (15 Digits)</label>
                  <input
                    type="text"
                    maxLength={15}
                    className="input font-mono uppercase"
                    value={formData.gstin}
                    onChange={e => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="label">Credit Limit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.credit_limit}
                    onChange={e => setFormData({ ...formData, credit_limit: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Billing Address</label>
                <textarea
                  rows={2}
                  className="input"
                  value={formData.billing_address}
                  onChange={e => setFormData({ ...formData, billing_address: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
