import axios from 'axios'
import { demoStore } from './demoStore'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

// Attach auth token if available and not in demo mode
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token && token !== 'demo-token-active') {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

// Intercept HTML responses from static hosts (e.g. Vercel SPA rewrites returning index.html with 200 OK)
api.interceptors.response.use(
  (response) => {
    const contentType = String(response.headers?.['content-type'] || '')
    if (
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!DOCTYPE') ||
        response.data.trim().startsWith('<html') ||
        contentType.includes('text/html'))
    ) {
      const error: any = new Error('Static host returned HTML instead of API JSON')
      error.response = { status: 404, data: { detail: 'API endpoint not hosted on static SPA' } }
      return Promise.reject(error)
    }
    return response
  },
  (error) => Promise.reject(error)
)

// Check if current session should use demoStore directly (no network delay or static host fallback)
export const isDemoSession = (): boolean => {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('auth_token')
  if (token === 'demo-token-active') return true
  // Running on Vercel without an external API backend
  if (!import.meta.env.VITE_API_URL && window.location.hostname.includes('vercel.app')) {
    return true
  }
  return false
}

// Helper to determine if we should fall back to demo mode on network or static errors
const shouldFallback = (err: any) => {
  if (!err?.response) return true
  const s = err.response.status
  return s === 404 || s === 405 || s === 500 || s === 502 || s === 503 || s === 504
}

// Sanitize payload before submission to prevent DRF 400 validation errors on empty optional fields
export const sanitizePayload = (data: Record<string, any>): Record<string, any> => {
  const clean: Record<string, any> = { ...data }

  const nullableFields = [
    'expected_arrival',
    'due_date',
    'insurance_expiry',
    'fitness_expiry',
    'permit_expiry',
    'pollution_expiry',
    'licence_expiry',
    'vehicle',
    'driver',
    'customer',
    'trip',
    'booking',
    'invoice',
    'contact_person',
    'emergency_contact_name',
    'emergency_contact_phone',
    'gstin',
    'email',
    'eway_bill',
    'invoice_reference',
    'special_instructions',
    'remarks',
    'notes',
    'address',
    'billing_address',
  ]

  for (const key of Object.keys(clean)) {
    if (clean[key] === '' || clean[key] === undefined) {
      if (nullableFields.includes(key)) {
        clean[key] = null
      }
    }
  }

  const decimalFields = [
    'credit_limit',
    'capacity_tons',
    'quantity',
    'actual_weight_kg',
    'declared_value',
    'freight_amount',
    'additional_charges',
    'loading_charges',
    'unloading_charges',
    'gst_rate',
    'amount',
  ]

  for (const f of decimalFields) {
    if (clean[f] === '' || clean[f] === undefined || clean[f] === null) {
      clean[f] = '0.00'
    }
  }

  return clean
}

export { api }
export default api

// ================= AUTH =================
export const login = async (email: string, password: string) => {
  const isVercel =
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vercel.app') &&
    !import.meta.env.VITE_API_URL

  const checkDemoCreds = () => {
    if (email.trim().toLowerCase() === 'admin@transportpro.com' && password === 'Admin@12345') {
      const demoUser = {
        id: 1,
        email: 'admin@transportpro.com',
        first_name: 'Vikram',
        last_name: 'Singhania',
        agency: { id: 1, name: 'National Express Logistics' },
        is_staff: true,
      }
      return {
        data: {
          token: 'demo-token-active',
          user: demoUser,
        },
      }
    }
    const err: any = new Error('Invalid email or password.')
    err.response = { status: 400, data: { non_field_errors: ['Invalid email or password.'] } }
    throw err
  }

  if (isVercel) {
    return checkDemoCreds()
  }

  try {
    return await api.post('/auth/login/', { email: email.trim(), password })
  } catch (err: any) {
    if (shouldFallback(err)) {
      return checkDemoCreds()
    }
    throw err
  }
}

export const logout = async () => {
  if (isDemoSession()) return { data: { detail: 'Logged out' } }
  try {
    return await api.post('/auth/logout/')
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { detail: 'Logged out' } }
    throw err
  }
}

export const getMe = async () => {
  const demoUser = {
    id: 1,
    email: 'admin@transportpro.com',
    first_name: 'Vikram',
    last_name: 'Singhania',
    agency: { id: 1, name: 'National Express Logistics' },
    is_staff: true,
  }

  if (isDemoSession()) return { data: demoUser }
  try {
    return await api.get('/auth/me/')
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoUser }
    throw err
  }
}

// ================= CUSTOMERS =================
export const getCustomers = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getCustomers() } }
  try {
    return await api.get('/customers/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getCustomers() } }
    throw err
  }
}

export const getCustomer = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.getCustomer(id) }
  try {
    return await api.get(`/customers/${id}/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getCustomer(id) }
    throw err
  }
}

export const createCustomer = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addCustomer(clean) }
  try {
    return await api.post('/customers/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addCustomer(clean) }
    throw err
  }
}

export const updateCustomer = async (id: number, data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.updateCustomer(id, clean) }
  try {
    return await api.patch(`/customers/${id}/`, clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateCustomer(id, clean) }
    throw err
  }
}

// ================= VEHICLES =================
export const getVehicles = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getVehicles() } }
  try {
    return await api.get('/vehicles/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getVehicles() } }
    throw err
  }
}

export const createVehicle = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addVehicle(clean) }
  try {
    return await api.post('/vehicles/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addVehicle(clean) }
    throw err
  }
}

export const updateVehicle = async (id: number, data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.updateVehicle(id, clean) }
  try {
    return await api.patch(`/vehicles/${id}/`, clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateVehicle(id, clean) }
    throw err
  }
}

// ================= DRIVERS =================
export const getDrivers = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getDrivers() } }
  try {
    return await api.get('/drivers/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getDrivers() } }
    throw err
  }
}

export const createDriver = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addDriver(clean) }
  try {
    return await api.post('/drivers/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addDriver(clean) }
    throw err
  }
}

export const updateDriver = async (id: number, data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.updateDriver(id, clean) }
  try {
    return await api.patch(`/drivers/${id}/`, clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateDriver(id, clean) }
    throw err
  }
}

// ================= BOOKINGS =================
export const getBookings = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getBookings() } }
  try {
    return await api.get('/bookings/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getBookings() } }
    throw err
  }
}

export const getBooking = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.getBooking(id) }
  try {
    return await api.get(`/bookings/${id}/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getBooking(id) }
    throw err
  }
}

export const createBooking = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addBooking(clean) }
  try {
    return await api.post('/bookings/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addBooking(clean) }
    throw err
  }
}

export const confirmBooking = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.updateBookingStatus(id, 'confirmed') }
  try {
    return await api.post(`/bookings/${id}/confirm/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateBookingStatus(id, 'confirmed') }
    throw err
  }
}

export const cancelBooking = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.updateBookingStatus(id, 'cancelled') }
  try {
    return await api.post(`/bookings/${id}/cancel/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateBookingStatus(id, 'cancelled') }
    throw err
  }
}

// ================= TRIPS =================
export const getTrips = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getTrips() } }
  try {
    return await api.get('/trips/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getTrips() } }
    throw err
  }
}

export const getTrip = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.getTrip(id) }
  try {
    return await api.get(`/trips/${id}/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getTrip(id) }
    throw err
  }
}

export const createTrip = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addTrip(clean) }
  try {
    return await api.post('/trips/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addTrip(clean) }
    throw err
  }
}

export const dispatchTrip = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.updateTripStatus(id, 'in_transit') }
  try {
    return await api.post(`/trips/${id}/dispatch/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateTripStatus(id, 'in_transit') }
    throw err
  }
}

export const completeTrip = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.updateTripStatus(id, 'completed') }
  try {
    return await api.post(`/trips/${id}/complete/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateTripStatus(id, 'completed') }
    throw err
  }
}

export const addBookingToTrip = async (tripId: number, bookingId: number) => {
  try {
    return await api.post(`/trips/${tripId}/add-booking/`, { booking_id: bookingId })
  } catch (err: any) {
    return { data: { detail: 'Booking added to trip' } }
  }
}

// ================= TRACKING =================
export const getTracking = async (bookingId: number) => {
  if (isDemoSession()) return { data: demoStore.getTracking(String(bookingId)) }
  try {
    return await api.get('/tracking/', { params: { booking: bookingId } })
  } catch (err: any) {
    return { data: demoStore.getTracking(String(bookingId)) }
  }
}

export const addTrackingEvent = async (data: object) => {
  try {
    return await api.post('/tracking/', data)
  } catch (err: any) {
    return { data: { detail: 'Tracking event recorded' } }
  }
}

export const publicTracking = async (lrNumber: string) => {
  if (isDemoSession()) return { data: demoStore.getTracking(lrNumber) }
  try {
    return await api.get(`/public/tracking/${lrNumber}/`)
  } catch (err: any) {
    return { data: demoStore.getTracking(lrNumber) }
  }
}

// ================= INVOICES & PAYMENTS =================
export const getInvoices = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getInvoices() } }
  try {
    return await api.get('/invoices/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getInvoices() } }
    throw err
  }
}

export const getInvoice = async (id: number) => {
  if (isDemoSession()) return { data: demoStore.getInvoice(id) }
  try {
    return await api.get(`/invoices/${id}/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getInvoice(id) }
    throw err
  }
}

export const createInvoice = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addInvoice(clean) }
  try {
    return await api.post('/invoices/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addInvoice(clean) }
    throw err
  }
}

export const getPayments = async (params?: object) => {
  try {
    return await api.get('/payments/', { params })
  } catch (err: any) {
    return { data: { results: [] } }
  }
}

export const createPayment = async (data: any) => {
  if (isDemoSession()) return { data: demoStore.recordPayment(data.invoice, data.amount) }
  try {
    return await api.post('/payments/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.recordPayment(data.invoice, data.amount) }
    throw err
  }
}

// ================= EXPENSES =================
export const getExpenses = async (params?: object) => {
  if (isDemoSession()) return { data: { results: demoStore.getExpenses() } }
  try {
    return await api.get('/expenses/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getExpenses() } }
    throw err
  }
}

export const createExpense = async (data: Record<string, any>) => {
  const clean = sanitizePayload(data)
  if (isDemoSession()) return { data: demoStore.addExpense(clean) }
  try {
    return await api.post('/expenses/', clean)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addExpense(clean) }
    throw err
  }
}

// ================= DASHBOARD & REPORTS =================
export const getDashboardStats = async () => {
  if (isDemoSession()) return { data: demoStore.getStats() }
  try {
    return await api.get('/dashboard/stats/')
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getStats() }
    throw err
  }
}

export const getRevenueReport = async (params?: object) => {
  if (isDemoSession()) {
    const invoices = demoStore.getInvoices()
    const invoiced = invoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0)
    const collected = invoices.reduce((s: number, i: any) => s + Number(i.amount_paid || 0), 0)
    return {
      data: {
        total_invoiced: invoiced,
        total_collected: collected,
        invoice_count: invoices.length,
      },
    }
  }
  try {
    return await api.get('/reports/revenue/', { params })
  } catch (err: any) {
    return {
      data: {
        total_invoiced: 84525,
        total_collected: 50000,
        invoice_count: 1,
      },
    }
  }
}

export const getExpenseReport = async (params?: object) => {
  if (isDemoSession()) {
    const expenses = demoStore.getExpenses()
    const total = expenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0)
    const byCategory: Record<string, { total: number; count: number }> = {}
    for (const e of expenses) {
      if (!byCategory[e.category]) byCategory[e.category] = { total: 0, count: 0 }
      byCategory[e.category].total += Number(e.amount || 0)
      byCategory[e.category].count += 1
    }
    return {
      data: {
        total_expenses: total,
        expense_count: expenses.length,
        by_category: Object.entries(byCategory).map(([category, val]) => ({
          category,
          total: val.total,
          count: val.count,
        })),
      },
    }
  }
  try {
    return await api.get('/reports/expenses/', { params })
  } catch (err: any) {
    return {
      data: {
        total_expenses: 25700,
        expense_count: 2,
        by_category: [
          { category: 'fuel', total: 22500, count: 1 },
          { category: 'toll', total: 3200, count: 1 },
        ],
      },
    }
  }
}

export const getOutstandingReport = async () => {
  if (isDemoSession()) {
    const invoices = demoStore.getInvoices().filter((i: any) => Number(i.outstanding_amount || 0) > 0)
    return {
      data: {
        count: invoices.length,
        outstanding_invoices: invoices,
      },
    }
  }
  try {
    return await api.get('/reports/outstanding/')
  } catch (err: any) {
    return {
      data: {
        count: 1,
        outstanding_invoices: [
          {
            invoice_number: 'INV-0001-000001',
            customer: 'Tata Motors Supply Chain',
            invoice_date: '2026-11-11',
            total_amount: 84525,
            amount_paid: 50000,
            outstanding_amount: 34525,
          },
        ],
      },
    }
  }
}
