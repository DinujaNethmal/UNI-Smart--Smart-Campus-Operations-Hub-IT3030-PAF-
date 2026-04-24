import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import RequireAdmin from './components/RequireAdmin';
import DashboardPage from './pages/DashboardPage';
import CreateBookingPage from './pages/CreateBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import FacilitiesPage from './pages/catalogue/FacilitiesPage';
import RequireAuth from './components/RequireAuth'; 


import CreateTicket from './components/ticket/CreateTicket';
import TicketList from './components/ticket/TicketList';
import EditTicket from './components/ticket/EditTicket';
import TicketDetail from './components/ticket/TicketDetail';
import TicketDashboard from './components/ticket/TicketDashboard';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new" element={<CreateBookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          
          {/* Facility Catalogue Routes */}
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/catalogue" element={<FacilitiesPage />} />
          
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminBookingsPage />
            </RequireAdmin>
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

        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
