import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BookingsPage from './pages/BookingsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="card text-gray-500">This section is coming soon.</div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
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
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="bookings/:id" element={<PlaceholderPage title="Booking Details" />} />
              <Route path="bookings/new" element={<PlaceholderPage title="Create Booking" />} />
              <Route path="trips" element={<PlaceholderPage title="Trips" />} />
              <Route path="fleet" element={<PlaceholderPage title="Fleet Management" />} />
              <Route path="drivers" element={<PlaceholderPage title="Drivers" />} />
              <Route path="customers" element={<PlaceholderPage title="Customers" />} />
              <Route path="tracking" element={<PlaceholderPage title="Shipment Tracking" />} />
              <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
              <Route path="payments" element={<PlaceholderPage title="Payments" />} />
              <Route path="expenses" element={<PlaceholderPage title="Expenses" />} />
              <Route path="reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

