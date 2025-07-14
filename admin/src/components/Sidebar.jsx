import { NavLink , useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  CogIcon, 
  ChartBarIcon,
  LogoutIcon 
} from '@heroicons/react/outline';
import { logoutUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handleLogout = async () => {
      try {
        await logoutUser();
        dispatch(logout());
        navigate("/")
        setIsMenuOpen(false); // Close menu after logout
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed lg:static lg:h-screen inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed lg:static lg:h-screen inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out bg-indigo-700 text-white overflow-y-auto`}>
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-800">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav className="px-4 py-6">
          <div className="space-y-1">
            <NavLink
              to="/admin"
              exact
              className="flex items-center px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              activeClassName="bg-indigo-600"
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
            </NavLink>
            
            <NavLink
              to="/admin/users"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              activeClassName="bg-indigo-600"
            >
              <UsersIcon className="w-5 h-5 mr-3" />
              User Management
            </NavLink>
            
            <NavLink
              to="/admin/bookings"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              activeClassName="bg-indigo-600"
            >
              <CalendarIcon className="w-5 h-5 mr-3" />
              Booking Management
            </NavLink>
            
            <NavLink
              to="/admin/reports"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              activeClassName="bg-indigo-600"
            >
              <ChartBarIcon className="w-5 h-5 mr-3" />
              Reports
            </NavLink>
            
            <NavLink
              to="/admin/settings"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              activeClassName="bg-indigo-600"
            >
              <CogIcon className="w-5 h-5 mr-3" />
              Settings
            </NavLink>
          </div>
          
          <div className="mt-12 pt-6 border-t border-indigo-600">
            <button className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors" onClick={handleLogout}>
              <LogoutIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;