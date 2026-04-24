import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

import DashboardPage from './pages/DashboardPage';
import CreateBookingPage from './pages/CreateBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import FacilitiesPage from './pages/catalogue/FacilitiesPage';

import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import NotificationsPage from './pages/NotificationsPage';

import CreateTicket from './components/ticket/CreateTicket';
import TicketList from './components/ticket/TicketList';
import EditTicket from './components/ticket/EditTicket';
import TicketDetail from './components/ticket/TicketDetail';
import TicketDashboard from './components/ticket/TicketDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected Layout */}
        <Route element={<AppShell />}>
          
          <Route path="/" element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          } />

          <Route path="/new" element={
            <RequireAuth>
              <CreateBookingPage />
            </RequireAuth>
          } />

          <Route path="/my-bookings" element={
            <RequireAuth>
              <MyBookingsPage />
            </RequireAuth>
          } />

          <Route path="/notifications" element={
            <RequireAuth>
              <NotificationsPage />
            </RequireAuth>
          } />

          <Route path="/admin" element={
            <RequireAuth>
              <RequireAdmin>
                <AdminBookingsPage />
              </RequireAdmin>
            </RequireAuth>
          } />

          {/* Ticket Routes */}
          <Route path="/tickets" element={
            <RequireAuth>
              <TicketDashboard />
            </RequireAuth>
          } />

          <Route path="/create-ticket" element={
            <RequireAuth>
              <CreateTicket />
            </RequireAuth>
          } />

          <Route path="/tickets-list" element={
            <RequireAuth>
              <TicketList />
            </RequireAuth>
          } />

          <Route path="/ticket-edit/:id" element={
            <RequireAuth>
              <EditTicket />
            </RequireAuth>
          } />

          <Route path="/ticket-detail/:id" element={
            <RequireAuth>
              <TicketDetail />
            </RequireAuth>
          } />

          {/* Facility Routes */}
          <Route path="/catalogue" element={
            <RequireAuth>
              <FacilitiesPage />
            </RequireAuth>
          } />

          <Route path="/facilities" element={
            <RequireAuth>
              <FacilitiesPage />
            </RequireAuth>
          } />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;