import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBooking, confirmBooking, cancelBooking } from '../services/api'
import { ArrowLeft, Printer, CheckCircle, XCircle, Truck, MapPin, Calendar, FileText } from 'lucide-react'

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: b, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(Number(id)).then(r => r.data),
    enabled: !!id,
  })

  const confirmMutation = useMutation({
    mutationFn: () => confirmBooking(Number(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] }),
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(Number(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['booking', id] }),
  })

  if (isLoading) return <div className="text-gray-400 py-12 text-center">Loading consignment record...</div>
  if (!b) return <div className="text-red-500 py-12 text-center">Consignment booking not found.</div>

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Top action bar - Hidden during print */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/bookings')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{b.booking_number}</h1>
            <p className="text-sm text-gray-500">Booking Reference & Lorry Receipt</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {b.status === 'draft' && (
            <button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <CheckCircle size={16} /> Confirm Booking
            </button>
          )}
          {['draft', 'confirmed'].includes(b.status) && (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-1.5"
            >
              <XCircle size={16} /> Cancel
            </button>
          )}
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <Printer size={16} /> Print LR
          </button>
        </div>
      </div>

      {/* Official Indian Goods Transport Agency Lorry Receipt (LR / GR) Printable Format */}
      <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* LR Header */}
        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-gray-900">
                TransportPro Logistics
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Fleet Operators, Daily Parcel & Full Truckload Services Across India
              </p>
              <p className="text-xs text-gray-500">
                Central Booking Office • GST Registered • Pan-India Coverage
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block border-2 border-blue-900 bg-blue-50 text-blue-900 font-bold px-3 py-1 rounded text-sm mb-1 uppercase">
                Consignment Note / L.R.
              </span>
              <p className="font-mono text-sm font-bold text-gray-900 mt-1">{b.booking_number}</p>
              <p className="text-xs text-gray-500">Date: {b.booking_date}</p>
            </div>
          </div>
        </div>

        {/* Route Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 grid grid-cols-3 text-center text-sm">
          <div>
            <span className="text-xs text-gray-500 uppercase block font-semibold">Origin</span>
            <span className="font-bold text-gray-800">{b.origin}</span>
          </div>
          <div className="flex items-center justify-center font-bold text-gray-400">
            ➔ ➔ ➔
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase block font-semibold">Destination</span>
            <span className="font-bold text-gray-800">{b.destination}</span>
          </div>
        </div>

        {/* Consignor / Consignee Table */}
        <div className="grid grid-cols-2 gap-4 border border-gray-300 rounded-lg mb-6 overflow-hidden">
          <div className="p-4 border-r border-gray-300">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Consignor (Sender)</span>
            <p className="font-bold text-gray-900 text-sm">{b.consignor_name}</p>
            <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{b.consignor_address || 'Address on file'}</p>
            {b.consignor_phone && <p className="text-xs text-gray-600 mt-1">Phone: {b.consignor_phone}</p>}
          </div>
          <div className="p-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Consignee (Receiver)</span>
            <p className="font-bold text-gray-900 text-sm">{b.consignee_name}</p>
            <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{b.consignee_address || 'Address on file'}</p>
            {b.consignee_phone && <p className="text-xs text-gray-600 mt-1">Phone: {b.consignee_phone}</p>}
          </div>
        </div>

        {/* Goods Particulars Table */}
        <table className="w-full text-xs border border-gray-300 mb-6">
          <thead className="bg-gray-100 border-b border-gray-300 text-gray-700">
            <tr>
              <th className="p-2.5 text-left border-r border-gray-300">Packages</th>
              <th className="p-2.5 text-left border-r border-gray-300">Description of Goods</th>
              <th className="p-2.5 text-right border-r border-gray-300">Actual Weight</th>
              <th className="p-2.5 text-left border-r border-gray-300">E-Way Bill / Inv No.</th>
              <th className="p-2.5 text-right">Declared Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2.5 border-r border-gray-300 font-medium">
                {b.quantity} {b.packaging_type}
              </td>
              <td className="p-2.5 border-r border-gray-300 font-medium text-gray-800">
                {b.goods_description}
              </td>
              <td className="p-2.5 border-r border-gray-300 text-right font-medium">
                {b.actual_weight_kg} Kg
              </td>
              <td className="p-2.5 border-r border-gray-300 font-mono text-gray-600">
                {b.eway_bill ? `EWB: ${b.eway_bill}` : b.invoice_reference || 'N/A'}
              </td>
              <td className="p-2.5 text-right font-medium">
                ₹{Number(b.declared_value || 0).toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Freight & Payment Summary */}
        <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-4 mb-8">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Payment Mode</span>
            <span className="inline-block px-3 py-1 bg-gray-100 rounded text-xs font-bold uppercase text-gray-800">
              {b.payment_type?.replace(/_/g, ' ')}
            </span>
            {b.special_instructions && (
              <p className="text-xs text-gray-500 mt-3">
                <span className="font-semibold">Instructions:</span> {b.special_instructions}
              </p>
            )}
          </div>
          <div className="space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-gray-600">
              <span>Freight Charge:</span>
              <span className="font-medium">₹{Number(b.freight_amount || 0).toLocaleString('en-IN')}</span>
            </div>
            {Number(b.additional_charges) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Additional Charges:</span>
                <span className="font-medium">₹{Number(b.additional_charges || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-300 pt-1.5">
              <span>Total Booking Amount:</span>
              <span>₹{(Number(b.freight_amount || 0) + Number(b.additional_charges || 0)).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-300 text-center text-xs text-gray-600">
          <div>
            <div className="border-b border-gray-400 mb-1 h-6"></div>
            <span>Consignor's Signature</span>
          </div>
          <div>
            <div className="border-b border-gray-400 mb-1 h-6"></div>
            <span>Booking Clerk / In-Charge</span>
          </div>
          <div>
            <div className="border-b border-gray-400 mb-1 h-6"></div>
            <span>Receiver's Signature on Delivery</span>
          </div>
        </div>
      </div>
    </div>
  )
}

