import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/api';

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold">
              BadmintonPro
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Home
              </Link>
              <Link
                to="/courts"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Courts
              </Link>
              <Link
                to="/bookings"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                My Bookings
              </Link>
            </div>
          </div>

          {/* Auth Links */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {token ? (
                <>
                  <span className="mr-4 text-sm font-medium">
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
          >
            Home
          </Link>
          <Link
            to="/courts"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
          >
            Courts
          </Link>
          {token ? (
            <>
              <Link
                to="/bookings"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;