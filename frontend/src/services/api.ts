import axios from 'axios'
import { demoStore } from './demoStore'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token && token !== 'demo-token-active') {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

// Helper to determine if we should fall back to demo mode (Vercel static host or offline)
const shouldFallback = (err: any) => {
  if (!err.response) return true
  const s = err.response.status
  return s === 404 || s === 405 || s === 502 || s === 503 || s === 504
}

export { api }
export default api

// Auth
export const login = async (email: string, password: string) => {
  try {
    return await api.post('/auth/login/', { email, password })
  } catch (err: any) {
    if (shouldFallback(err)) {
      if (email.toLowerCase() === 'admin@transportpro.com' && password === 'Admin@12345') {
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
    }
    throw err
  }
}

export const logout = async () => {
  try {
    return await api.post('/auth/logout/')
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { detail: 'Logged out' } }
    throw err
  }
}

export const getMe = async () => {
  try {
    return await api.get('/auth/me/')
  } catch (err: any) {
    if (shouldFallback(err)) {
      const demoUser = {
        id: 1,
        email: 'admin@transportpro.com',
        first_name: 'Vikram',
        last_name: 'Singhania',
        agency: { id: 1, name: 'National Express Logistics' },
        is_staff: true,
      }
      return { data: demoUser }
    }
    throw err
  }
}

// Customers
export const getCustomers = async (params?: object) => {
  try {
    return await api.get('/customers/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getCustomers() } }
    throw err
  }
}

export const createCustomer = async (data: object) => {
  try {
    return await api.post('/customers/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addCustomer(data) }
    throw err
  }
}

export const updateCustomer = (id: number, data: object) => api.patch(`/customers/${id}/`, data)
export const getCustomer = (id: number) => api.get(`/customers/${id}/`)

// Vehicles
export const getVehicles = async (params?: object) => {
  try {
    return await api.get('/vehicles/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getVehicles() } }
    throw err
  }
}

export const createVehicle = async (data: object) => {
  try {
    return await api.post('/vehicles/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addVehicle(data) }
    throw err
  }
}

export const updateVehicle = (id: number, data: object) => api.patch(`/vehicles/${id}/`, data)

// Drivers
export const getDrivers = async (params?: object) => {
  try {
    return await api.get('/drivers/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getDrivers() } }
    throw err
  }
}

export const createDriver = async (data: object) => {
  try {
    return await api.post('/drivers/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addDriver(data) }
    throw err
  }
}

export const updateDriver = (id: number, data: object) => api.patch(`/drivers/${id}/`, data)

// Bookings
export const getBookings = async (params?: object) => {
  try {
    return await api.get('/bookings/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getBookings() } }
    throw err
  }
}

export const createBooking = async (data: object) => {
  try {
    return await api.post('/bookings/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addBooking(data) }
    throw err
  }
}

export const getBooking = async (id: number) => {
  try {
    return await api.get(`/bookings/${id}/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getBooking(id) }
    throw err
  }
}

export const confirmBooking = async (id: number) => {
  try {
    return await api.post(`/bookings/${id}/confirm/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateBookingStatus(id, 'confirmed') }
    throw err
  }
}

export const cancelBooking = async (id: number) => {
  try {
    return await api.post(`/bookings/${id}/cancel/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateBookingStatus(id, 'cancelled') }
    throw err
  }
}

// Trips
export const getTrips = async (params?: object) => {
  try {
    return await api.get('/trips/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getTrips() } }
    throw err
  }
}

export const createTrip = async (data: object) => {
  try {
    return await api.post('/trips/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addTrip(data) }
    throw err
  }
}

export const getTrip = (id: number) => api.get(`/trips/${id}/`)

export const dispatchTrip = async (id: number) => {
  try {
    return await api.post(`/trips/${id}/dispatch/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateTripStatus(id, 'in_transit') }
    throw err
  }
}

export const completeTrip = async (id: number) => {
  try {
    return await api.post(`/trips/${id}/complete/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.updateTripStatus(id, 'completed') }
    throw err
  }
}

export const addBookingToTrip = (tripId: number, bookingId: number) =>
  api.post(`/trips/${tripId}/add-booking/`, { booking_id: bookingId })

// Tracking
export const getTracking = (bookingId: number) =>
  api.get('/tracking/', { params: { booking: bookingId } })
export const addTrackingEvent = (data: object) => api.post('/tracking/', data)

export const publicTracking = async (lrNumber: string) => {
  try {
    return await api.get(`/public/tracking/${lrNumber}/`)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getTracking(lrNumber) }
    throw err
  }
}

// Invoices
export const getInvoices = async (params?: object) => {
  try {
    return await api.get('/invoices/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getInvoices() } }
    throw err
  }
}

export const createInvoice = async (data: object) => {
  try {
    return await api.post('/invoices/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addInvoice(data) }
    throw err
  }
}

export const getInvoice = (id: number) => api.get(`/invoices/${id}/`)

// Payments
export const getPayments = (params?: object) => api.get('/payments/', { params })

export const createPayment = async (data: any) => {
  try {
    return await api.post('/payments/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.recordPayment(data.invoice, data.amount) }
    throw err
  }
}

// Expenses
export const getExpenses = async (params?: object) => {
  try {
    return await api.get('/expenses/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) return { data: { results: demoStore.getExpenses() } }
    throw err
  }
}

export const createExpense = async (data: object) => {
  try {
    return await api.post('/expenses/', data)
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.addExpense(data) }
    throw err
  }
}

// Reports & Dashboard
export const getDashboardStats = async () => {
  try {
    return await api.get('/dashboard/stats/')
  } catch (err: any) {
    if (shouldFallback(err)) return { data: demoStore.getStats() }
    throw err
  }
}

export const getRevenueReport = async (params?: object) => {
  try {
    return await api.get('/reports/revenue/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) {
      return {
        data: {
          total_invoiced: 84525,
          total_collected: 50000,
          invoice_count: 1,
        },
      }
    }
    throw err
  }
}

export const getExpenseReport = async (params?: object) => {
  try {
    return await api.get('/reports/expenses/', { params })
  } catch (err: any) {
    if (shouldFallback(err)) {
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
    throw err
  }
}

export const getOutstandingReport = async () => {
  try {
    return await api.get('/reports/outstanding/')
  } catch (err: any) {
    if (shouldFallback(err)) {
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
    throw err
  }
}
