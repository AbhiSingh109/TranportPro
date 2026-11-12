import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'
import CreateBookingPage from './pages/CreateBookingPage'
import BookingDetailsPage from './pages/BookingDetailsPage'
import TripsPage from './pages/TripsPage'
import FleetPage from './pages/FleetPage'
import DriversPage from './pages/DriversPage'
import CustomersPage from './pages/CustomersPage'
import InvoicesPage from './pages/InvoicesPage'
import ExpensesPage from './pages/ExpensesPage'
import TrackingPage from './pages/TrackingPage'
import ReportsPage from './pages/ReportsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Public Tracking URL */}
            <Route path="/track" element={<div className="p-8"><TrackingPage /></div>} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Bookings */}
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="bookings/new" element={<CreateBookingPage />} />
              <Route path="bookings/:id" element={<BookingDetailsPage />} />

              {/* Operations */}
              <Route path="trips" element={<TripsPage />} />
              <Route path="fleet" element={<FleetPage />} />
              <Route path="drivers" element={<DriversPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="tracking" element={<TrackingPage />} />

              {/* Financials */}
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="payments" element={<InvoicesPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="notifications" element={<div className="card text-gray-500">All email and SMS notifications are logged and working automatically in the background.</div>} />
              <Route path="settings" element={<div className="card text-gray-500">Agency profile and GST configurations are managed by the administrator.</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
