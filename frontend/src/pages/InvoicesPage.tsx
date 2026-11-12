import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInvoices, createInvoice, createPayment, getCustomers } from '../services/api'
import { Plus, Search, Receipt, CreditCard, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'

export default function InvoicesPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const [invoiceForm, setInvoiceForm] = useState({
    customer: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    freight_amount: '0',
    loading_charges: '0',
    unloading_charges: '0',
    additional_charges: '0',
    gst_rate: '5.00',
    notes: '',
  })

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_mode: 'bank_transfer',
    reference_number: '',
    notes: '',
  })

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => getInvoices().then(r => r.data),
  })

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers().then(r => r.data),
  })

  const invoiceMutation = useMutation({
    mutationFn: (data: object) => createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      setIsInvoiceModalOpen(false)
    },
  })

  const paymentMutation = useMutation({
    mutationFn: (data: object) => createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      setIsPaymentModalOpen(false)
    },
  })

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    invoiceMutation.mutate(invoiceForm)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return
    paymentMutation.mutate({
      invoice: selectedInvoice.id,
      ...paymentForm,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Paid</span>
      case 'partially_paid':
        return <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Partially Paid</span>
      case 'unpaid':
        return <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Unpaid</span>
      default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Freight Billing & Invoices</h1>
          <p className="text-sm text-gray-500">Generate GST freight invoices, record customer payments, and track balances</p>
        </div>
        <button onClick={() => setIsInvoiceModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading invoices...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Invoice No.', 'Date', 'Customer', 'Subtotal (₹)', 'GST (5%)', 'Total (₹)', 'Paid (₹)', 'Balance (₹)', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices?.results?.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.invoice_date}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{inv.customer}</td>
                  <td className="px-4 py-3 text-gray-700">₹{Number(inv.subtotal || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600">₹{Number(inv.gst_amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{Number(inv.total_amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">₹{Number(inv.amount_paid || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-red-600 font-bold">₹{Number(inv.outstanding_amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">{getStatusBadge(inv.status)}</td>
                  <td className="px-4 py-3">
                    {Number(inv.outstanding_amount) > 0 && (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv)
                          setPaymentForm({ ...paymentForm, amount: inv.outstanding_amount })
                          setIsPaymentModalOpen(true)
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1"
                      >
                        <CreditCard size={12} /> Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!invoices?.results?.length && (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">No invoices issued yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Generate Freight Invoice</h2>
            <form onSubmit={handleInvoiceSubmit} className="space-y-4">
              <div>
                <label className="label">Customer *</label>
                <select
                  required
                  className="input"
                  value={invoiceForm.customer}
                  onChange={e => setInvoiceForm({ ...invoiceForm, customer: e.target.value })}
                >
                  <option value="">Select Customer...</option>
                  {customers?.results?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.customer_name} ({c.company_name || 'Individual'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Invoice Date *</label>
                  <input
                    required
                    type="date"
                    className="input"
                    value={invoiceForm.invoice_date}
                    onChange={e => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Due Date</label>
                  <input
                    type="date"
                    className="input"
                    value={invoiceForm.due_date}
                    onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Freight Amount (₹) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="input"
                    value={invoiceForm.freight_amount}
                    onChange={e => setInvoiceForm({ ...invoiceForm, freight_amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Loading Charges (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={invoiceForm.loading_charges}
                    onChange={e => setInvoiceForm({ ...invoiceForm, loading_charges: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Unloading Charges (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={invoiceForm.unloading_charges}
                    onChange={e => setInvoiceForm({ ...invoiceForm, unloading_charges: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">GST Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={invoiceForm.gst_rate}
                    onChange={e => setInvoiceForm({ ...invoiceForm, gst_rate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={invoiceMutation.isPending} className="btn-primary">
                  {invoiceMutation.isPending ? 'Generating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Record Payment</h2>
            <p className="text-xs text-gray-500 mb-4">
              Invoice <span className="font-mono font-bold text-gray-800">{selectedInvoice.invoice_number}</span> • Outstanding: ₹{Number(selectedInvoice.outstanding_amount).toLocaleString('en-IN')}
            </p>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="label">Amount Paid (₹) *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="input font-bold"
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Payment Date *</label>
                <input
                  required
                  type="date"
                  className="input"
                  value={paymentForm.payment_date}
                  onChange={e => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Payment Mode</label>
                <select
                  className="input"
                  value={paymentForm.payment_mode}
                  onChange={e => setPaymentForm({ ...paymentForm, payment_mode: e.target.value })}
                >
                  <option value="bank_transfer">Bank Transfer / NEFT / RTGS</option>
                  <option value="upi">UPI / QR</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Bank UTR / Reference No.</label>
                <input
                  type="text"
                  className="input font-mono"
                  placeholder="e.g. UTR10294819"
                  value={paymentForm.reference_number}
                  onChange={e => setPaymentForm({ ...paymentForm, reference_number: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={paymentMutation.isPending} className="btn-primary">
                  {paymentMutation.isPending ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
