import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react'

export default function NotificationsPage() {
  const [filterChannel, setFilterChannel] = useState('all')

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications/').then(r => r.data),
  })

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare size={16} className="text-emerald-600" />
      case 'in_app':
        return <Smartphone size={16} className="text-blue-600" />
      default:
        return <Mail size={16} className="text-indigo-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle size={12} /> Sent
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <Clock size={12} /> Pending
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
            <AlertTriangle size={12} /> Failed
          </span>
        )
      default:
        return <span className="text-xs text-gray-500">{status}</span>
    }
  }

  const filtered = notifications?.results?.filter((n: any) =>
    filterChannel === 'all' || n.channel === filterChannel
  )

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Logs & Dispatch</h1>
          <p className="text-sm text-gray-500">Audit trail of automated SMS, WhatsApp, and Email alerts sent to consignors and drivers</p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'email', 'whatsapp', 'in_app'].map(c => (
            <button
              key={c}
              onClick={() => setFilterChannel(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterChannel === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-400 py-12 text-center">Loading notification dispatch logs...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Event Trigger', 'Channel', 'Recipient', 'Message Preview', 'Dispatched At', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered?.map((n: any) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 capitalize">
                    {n.event?.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 capitalize">
                      {getChannelIcon(n.channel)}
                      {n.channel?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{n.recipient}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-md truncate" title={n.message}>
                    {n.subject && <span className="font-semibold text-gray-900 mr-1">[{n.subject}]</span>}
                    {n.message}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {n.created_at ? new Date(n.created_at).toLocaleString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(n.status)}</td>
                </tr>
              ))}
              {!filtered?.length && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No notification logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
