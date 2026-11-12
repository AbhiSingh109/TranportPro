import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export { api }
export default api

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login/', { email, password })
export const logout = () => api.post('/auth/logout/')
export const getMe = () => api.get('/auth/me/')

// Customers
export const getCustomers = (params?: object) => api.get('/customers/', { params })
export const createCustomer = (data: object) => api.post('/customers/', data)
export const updateCustomer = (id: number, data: object) => api.patch(`/customers/${id}/`, data)
export const getCustomer = (id: number) => api.get(`/customers/${id}/`)

// Vehicles
export const getVehicles = (params?: object) => api.get('/vehicles/', { params })
export const createVehicle = (data: object) => api.post('/vehicles/', data)
export const updateVehicle = (id: number, data: object) => api.patch(`/vehicles/${id}/`, data)

// Drivers
export const getDrivers = (params?: object) => api.get('/drivers/', { params })
export const createDriver = (data: object) => api.post('/drivers/', data)
export const updateDriver = (id: number, data: object) => api.patch(`/drivers/${id}/`, data)

// Bookings
export const getBookings = (params?: object) => api.get('/bookings/', { params })
export const createBooking = (data: object) => api.post('/bookings/', data)
export const getBooking = (id: number) => api.get(`/bookings/${id}/`)
export const confirmBooking = (id: number) => api.post(`/bookings/${id}/confirm/`)
export const cancelBooking = (id: number) => api.post(`/bookings/${id}/cancel/`)

// Trips
export const getTrips = (params?: object) => api.get('/trips/', { params })
export const createTrip = (data: object) => api.post('/trips/', data)
export const getTrip = (id: number) => api.get(`/trips/${id}/`)
export const dispatchTrip = (id: number) => api.post(`/trips/${id}/dispatch/`)
export const completeTrip = (id: number) => api.post(`/trips/${id}/complete/`)
export const addBookingToTrip = (tripId: number, bookingId: number) =>
  api.post(`/trips/${tripId}/add-booking/`, { booking_id: bookingId })

// Tracking
export const getTracking = (bookingId: number) =>
  api.get('/tracking/', { params: { booking: bookingId } })
export const addTrackingEvent = (data: object) => api.post('/tracking/', data)
export const publicTracking = (lrNumber: string) =>
  api.get(`/public/tracking/${lrNumber}/`)

// Invoices
export const getInvoices = (params?: object) => api.get('/invoices/', { params })
export const createInvoice = (data: object) => api.post('/invoices/', data)
export const getInvoice = (id: number) => api.get(`/invoices/${id}/`)

// Payments
export const getPayments = (params?: object) => api.get('/payments/', { params })
export const createPayment = (data: object) => api.post('/payments/', data)

// Expenses
export const getExpenses = (params?: object) => api.get('/expenses/', { params })
export const createExpense = (data: object) => api.post('/expenses/', data)

// Reports
export const getDashboardStats = () => api.get('/dashboard/stats/')
export const getRevenueReport = (params?: object) => api.get('/reports/revenue/', { params })
export const getExpenseReport = (params?: object) => api.get('/reports/expenses/', { params })
export const getOutstandingReport = () => api.get('/reports/outstanding/')

