import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/Dashboard';
import UserManagement from '../components/UserMangement';
import BookingManagement from '../components/BookingManagement';

const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/bookings" element={<BookingManagement />} />
      </Routes>
    </AdminLayout>
    
  );
};

export default AdminPage;