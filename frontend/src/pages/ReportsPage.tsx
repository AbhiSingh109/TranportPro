import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRevenueReport, getExpenseReport, getOutstandingReport } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle, FileText } from 'lucide-react'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280']

export default function ReportsPage() {
  const { data: rev } = useQuery({
    queryKey: ['report-revenue'],
    queryFn: () => getRevenueReport().then(r => r.data),
  })

  const { data: exp } = useQuery({
    queryKey: ['report-expenses'],
    queryFn: () => getExpenseReport().then(r => r.data),
  })

  const { data: out } = useQuery({
    queryKey: ['report-outstanding'],
    queryFn: () => getOutstandingReport().then(r => r.data),
  })

  const comparisonData = [
    { name: 'Total Invoiced', amount: Number(rev?.total_invoiced || 0) },
    { name: 'Total Collected', amount: Number(rev?.total_collected || 0) },
    { name: 'Operating Expenses', amount: Number(exp?.total_expenses || 0) },
  ]

  const expensePieData = exp?.by_category?.map((c: any) => ({
    name: c.category?.replace(/_/g, ' '),
    value: Number(c.total || 0),
  })) || []

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports & Performance</h1>
        <p className="text-sm text-gray-500">Revenue aggregation, collection metrics, expense breakdown, and unpaid receivables</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Invoiced</span>
            <TrendingUp size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{Number(rev?.total_invoiced || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-gray-500">{rev?.invoice_count || 0} Invoices Generated</span>
        </div>

        <div className="card border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Cash Inflow</span>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            ₹{Number(rev?.total_collected || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-gray-500">Payments Realized</span>
        </div>

        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Operating Expenses</span>
            <TrendingDown size={18} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹{Number(exp?.total_expenses || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-gray-500">{exp?.expense_count || 0} Expenses Logged</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-bold text-gray-900 mb-4">Cash Flow Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-bold text-gray-900 mb-4">Expenses by Category</h2>
          {expensePieData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {expensePieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">No expense breakdown data.</div>
          )}
        </div>
      </div>

      {/* Outstanding Receivables Table */}
      <div className="card">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" /> Outstanding Receivables
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Invoice No.', 'Customer', 'Invoice Date', 'Total Amount', 'Received', 'Unpaid Balance'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {out?.outstanding_invoices?.map((i: any) => (
                <tr key={i.invoice_number}>
                  <td className="px-4 py-2.5 font-mono font-bold text-blue-700">{i.invoice_number}</td>
                  <td className="px-4 py-2.5 text-gray-800 font-medium">{i.customer}</td>
                  <td className="px-4 py-2.5 text-gray-600">{i.invoice_date}</td>
                  <td className="px-4 py-2.5 font-medium">₹{i.total_amount?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2.5 text-emerald-600">₹{i.amount_paid?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2.5 font-bold text-red-600">₹{i.outstanding_amount?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {!out?.outstanding_invoices?.length && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">All customer invoices are fully settled!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
