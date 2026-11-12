import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Building2, User, Shield, Save, Check } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  const [agencySettings, setAgencySettings] = useState({
    agency_name: user?.agency?.name || 'National Express Logistics',
    gstin: '23AABCN1234F1Z9',
    pan_number: 'AABCN1234F',
    phone: '+91 98931 23456',
    email: 'contact@transportpro.com',
    address: 'Transport Nagar, Ring Road, Indore, Madhya Pradesh 452010',
    lr_prefix: 'LR',
    inv_prefix: 'INV',
    default_gst_rate: '5.00',
    terms_and_conditions: '1. All consignments carried at owner\'s risk unless insured.\n2. Demurrage charges applicable after 48 hours of destination arrival.\n3. Goods strictly subject to Indore Jurisdiction.',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agency Settings & Preferences</h1>
        <p className="text-sm text-gray-500">Configure agency identity, tax rates, Lorry Receipt formats, and billing rules</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Identity */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 text-base font-bold text-gray-900">
            <User size={18} className="text-blue-600" />
            <span>Administrator Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                disabled
                type="text"
                className="input bg-gray-50 text-gray-600"
                value={`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Admin'}
              />
            </div>
            <div>
              <label className="label">Registered Email</label>
              <input
                disabled
                type="email"
                className="input bg-gray-50 text-gray-600 font-mono"
                value={user?.email || 'admin@transportpro.com'}
              />
            </div>
          </div>
        </div>

        {/* Agency Legal Profile */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 text-base font-bold text-gray-900">
            <Building2 size={18} className="text-blue-600" />
            <span>Agency Information (Printed on LR & Invoices)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Transport Agency Legal Name *</label>
              <input
                required
                type="text"
                className="input"
                value={agencySettings.agency_name}
                onChange={e => setAgencySettings({ ...agencySettings, agency_name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Agency GSTIN *</label>
              <input
                required
                type="text"
                maxLength={15}
                className="input font-mono uppercase"
                value={agencySettings.gstin}
                onChange={e => setAgencySettings({ ...agencySettings, gstin: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Dispatch Phone / Helpline</label>
              <input
                type="text"
                className="input"
                value={agencySettings.phone}
                onChange={e => setAgencySettings({ ...agencySettings, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Operations Email</label>
              <input
                type="email"
                className="input"
                value={agencySettings.email}
                onChange={e => setAgencySettings({ ...agencySettings, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Central Head Office Address</label>
            <textarea
              rows={2}
              className="input"
              value={agencySettings.address}
              onChange={e => setAgencySettings({ ...agencySettings, address: e.target.value })}
            />
          </div>
        </div>

        {/* Operational & Document Defaults */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 text-base font-bold text-gray-900">
            <Shield size={18} className="text-blue-600" />
            <span>Taxation & LR Declarations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Default GST Rate (%)</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={agencySettings.default_gst_rate}
                onChange={e => setAgencySettings({ ...agencySettings, default_gst_rate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">LR Number Prefix</label>
              <input
                type="text"
                className="input font-mono uppercase"
                value={agencySettings.lr_prefix}
                onChange={e => setAgencySettings({ ...agencySettings, lr_prefix: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Invoice Number Prefix</label>
              <input
                type="text"
                className="input font-mono uppercase"
                value={agencySettings.inv_prefix}
                onChange={e => setAgencySettings({ ...agencySettings, inv_prefix: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Standard Terms & Conditions on Lorry Receipt</label>
            <textarea
              rows={4}
              className="input font-mono text-xs"
              value={agencySettings.terms_and_conditions}
              onChange={e => setAgencySettings({ ...agencySettings, terms_and_conditions: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
              <Check size={16} /> Agency settings saved successfully!
            </span>
          ) : <span></span>}

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

