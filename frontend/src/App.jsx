import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import RequireAdmin from './components/RequireAdmin';
import DashboardPage from './pages/DashboardPage';
import CreateBookingPage from './pages/CreateBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import CheckInPage from './pages/CheckInPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* QR check-in page renders WITHOUT the app shell (standalone verification screen) */}
        <Route path="/check-in/:id" element={<CheckInPage />} />

        {/* All other pages render inside the app shell */}
        <Route path="*" element={
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
            </Routes>
          </AppShell>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
