import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import RequireAdmin from './components/RequireAdmin';
import DashboardPage from './pages/DashboardPage';
import CreateBookingPage from './pages/CreateBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import FacilitiesPage from './pages/catalogue/FacilitiesPage';


function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new" element={<CreateBookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminBookingsPage />
            </RequireAdmin>
          } />
          {/* Facility Catalogue Routes - Added by Dinuja */}
          <Route path="/catalogue" element={<FacilitiesPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />

        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
