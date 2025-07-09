import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className=" flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;