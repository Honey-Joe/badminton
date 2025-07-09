import { MenuIcon, BellIcon, SearchIcon } from '@heroicons/react/outline';

const Navbar = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <button
          className="lg:hidden text-gray-500 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        
        <div className="relative max-w-md w-full mx-4 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
            <BellIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Admin User</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://via.placeholder.com/150"
                  alt="User profile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;