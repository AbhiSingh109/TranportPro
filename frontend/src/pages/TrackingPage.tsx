import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicTracking } from '../services/api'
import { Search, MapPin, Truck, CheckCircle2, Clock, PackageCheck } from 'lucide-react'

export default function TrackingPage() {
  const [searchParams] = useSearchParams()
  const initialLr = searchParams.get('lr') || ''
  const [lrInput, setLrInput] = useState(initialLr)
  const [searchedLr, setSearchedLr] = useState(initialLr)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['public-tracking', searchedLr],
    queryFn: () => publicTracking(searchedLr).then(r => r.data),
    enabled: !!searchedLr,
    retry: false,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lrInput.trim()) return
    setSearchedLr(lrInput.trim())
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Consignment Tracking Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your LR / GR Number to view live transit checkpoints and delivery milestones</p>
      </div>

      <div className="card p-6 mb-8 shadow-md border-blue-100 bg-gradient-to-r from-blue-50/50 to-white">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              required
              type="text"
              placeholder="e.g. LR-2026-00101"
              value={lrInput}
              onChange={e => setLrInput(e.target.value)}
              className="input pl-10 py-3 text-base font-mono uppercase"
            />
          </div>
          <button type="submit" className="btn-primary px-6 text-base font-semibold">
            Track Consignment
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-400">Locating consignment records...</div>
      )}

      {isError && (
        <div className="card text-center py-12 border-red-200 bg-red-50/30">
          <p className="text-red-700 font-semibold mb-1">No shipment found with reference "{searchedLr}"</p>
          <p className="text-xs text-gray-500">Please verify the LR number printed on your consignment note.</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Shipment Summary Card */}
          <div className="card border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 uppercase">LR Number</span>
                <p className="text-xl font-bold text-gray-900">{data.lr_number}</p>
                <p className="text-xs text-gray-500 font-mono">Ref: {data.booking_number}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-semibold text-gray-500 uppercase block">Status</span>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold capitalize">
                  {data.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
              <div>
                <span className="text-xs text-gray-500 block">Origin Hub</span>
                <span className="font-semibold text-gray-800">{data.origin}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Destination Hub</span>
                <span className="font-semibold text-gray-800">{data.destination}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> Transit Timeline
            </h2>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
              {data.events?.map((ev: any, idx: number) => (
                <div key={ev.id || idx} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm capitalize">
                        {ev.status?.replace(/_/g, ' ')}
                      </span>
                      {ev.location && (
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <MapPin size={10} /> {ev.location}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(ev.event_time).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {ev.remarks && (
                      <p className="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded border border-gray-100">
                        {ev.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {!data.events?.length && (
                <p className="text-sm text-gray-400 italic">No tracking updates recorded yet for this consignment.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

