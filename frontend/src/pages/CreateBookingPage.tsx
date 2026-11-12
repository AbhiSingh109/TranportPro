import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCustomers, createBooking } from '../services/api'
import { ArrowLeft, Save, Package } from 'lucide-react'

export default function CreateBookingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers().then(r => r.data),
  })

  const [formData, setFormData] = useState({
    customer: '',
    booking_date: new Date().toISOString().split('T')[0],
    consignor_name: '',
    consignor_address: '',
    consignor_phone: '',
    consignee_name: '',
    consignee_address: '',
    consignee_phone: '',
    origin: '',
    destination: '',
    goods_description: '',
    quantity: '1',
    packaging_type: 'Cartons',
    actual_weight_kg: '100',
    declared_value: '10000',
    invoice_reference: '',
    eway_bill: '',
    freight_amount: '0',
    additional_charges: '0',
    payment_type: 'to_be_billed',
    special_instructions: '',
  })

  const mutation = useMutation({
    mutationFn: (data: object) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      navigate('/bookings')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/bookings')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Consignment Booking</h1>
          <p className="text-sm text-gray-500">Generate LR/GR receipt and book shipment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Route */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Client & Route Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Billed Customer *</label>
              <select
                required
                className="input"
                value={formData.customer}
                onChange={e => {
                  const custId = e.target.value
                  const c = customers?.results?.find((x: any) => x.id === Number(custId))
                  setFormData({
                    ...formData,
                    customer: custId,
                    consignor_name: c ? (c.company_name || c.customer_name) : formData.consignor_name,
                    consignor_phone: c ? c.phone_number : formData.consignor_phone,
                    consignor_address: c ? c.billing_address : formData.consignor_address,
                  })
                }}
              >
                <option value="">Select Customer...</option>
                {customers?.results?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.customer_name} ({c.company_name || 'Individual'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Booking Date *</label>
              <input
                required
                type="date"
                className="input"
                value={formData.booking_date}
                onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Payment Terms *</label>
              <select
                className="input"
                value={formData.payment_type}
                onChange={e => setFormData({ ...formData, payment_type: e.target.value })}
              >
                <option value="to_be_billed">To Be Billed (TBB)</option>
                <option value="to_pay">To Pay</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Origin City / Hub *</label>
              <input
                required
                type="text"
                placeholder="e.g. Pune"
                className="input"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Destination City / Hub *</label>
              <input
                required
                type="text"
                placeholder="e.g. Delhi NCR"
                className="input"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Consignor / Consignee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-3">
            <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Consignor (Sender)</h2>
            <div>
              <label className="label">Name / Firm *</label>
              <input
                required
                type="text"
                className="input"
                value={formData.consignor_name}
                onChange={e => setFormData({ ...formData, consignor_name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input
                type="tel"
                className="input"
                value={formData.consignor_phone}
                onChange={e => setFormData({ ...formData, consignor_phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Pickup Address</label>
              <textarea
                rows={2}
                className="input"
                value={formData.consignor_address}
                onChange={e => setFormData({ ...formData, consignor_address: e.target.value })}
              />
            </div>
          </div>

          <div className="card space-y-3">
            <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Consignee (Receiver)</h2>
            <div>
              <label className="label">Name / Firm *</label>
              <input
                required
                type="text"
                className="input"
                value={formData.consignee_name}
                onChange={e => setFormData({ ...formData, consignee_name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input
                type="tel"
                className="input"
                value={formData.consignee_phone}
                onChange={e => setFormData({ ...formData, consignee_phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Delivery Address</label>
              <textarea
                rows={2}
                className="input"
                value={formData.consignee_address}
                onChange={e => setFormData({ ...formData, consignee_address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Goods Description & Charges */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Consignment Goods & Valuation</h2>
          <div>
            <label className="label">Description of Goods *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. 50 Cartons Automotive Spare Parts"
              className="input"
              value={formData.goods_description}
              onChange={e => setFormData({ ...formData, goods_description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="label">Quantity *</label>
              <input
                required
                type="number"
                step="0.01"
                className="input"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Packaging Type</label>
              <input
                type="text"
                className="input"
                placeholder="Cartons, Crates, Bags"
                value={formData.packaging_type}
                onChange={e => setFormData({ ...formData, packaging_type: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Weight (Kg) *</label>
              <input
                required
                type="number"
                step="0.1"
                className="input"
                value={formData.actual_weight_kg}
                onChange={e => setFormData({ ...formData, actual_weight_kg: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Declared Goods Value (₹)</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={formData.declared_value}
                onChange={e => setFormData({ ...formData, declared_value: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="label">Customer Invoice Ref</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. INV-99012"
                value={formData.invoice_reference}
                onChange={e => setFormData({ ...formData, invoice_reference: e.target.value })}
              />
            </div>
            <div>
              <label className="label">E-Way Bill Number</label>
              <input
                type="text"
                className="input font-mono"
                placeholder="12-digit E-Way Bill"
                value={formData.eway_bill}
                onChange={e => setFormData({ ...formData, eway_bill: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="label">Agreed Freight Amount (₹) *</label>
              <input
                required
                type="number"
                step="0.01"
                className="input font-bold"
                value={formData.freight_amount}
                onChange={e => setFormData({ ...formData, freight_amount: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Additional Charges (₹)</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={formData.additional_charges}
                onChange={e => setFormData({ ...formData, additional_charges: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/bookings')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            <Save size={16} /> {mutation.isPending ? 'Generating LR & Saving...' : 'Generate Booking & LR'}
          </button>
        </div>
      </form>
    </div>
  )
}

