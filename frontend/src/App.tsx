import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'

// Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

// ERP Portal Pages
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
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/track" element={<div className="p-8 max-w-4xl mx-auto"><TrackingPage /></div>} />

            {/* Protected ERP Portal Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/bookings/new" element={<CreateBookingPage />} />
              <Route path="/bookings/:id" element={<BookingDetailsPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/payments" element={<InvoicesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
