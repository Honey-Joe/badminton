import { 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon 
} from '@heroicons/react/outline';

const stats = [
  { id: 1, name: 'Total Users', value: '2,345', icon: UserGroupIcon, change: '+12%', changeType: 'increase' },
  { id: 2, name: 'Total Bookings', value: '1,234', icon: CalendarIcon, change: '+5%', changeType: 'increase' },
  { id: 3, name: 'Revenue', value: '$34,567', icon: CurrencyDollarIcon, change: '-2%', changeType: 'decrease' },
  { id: 4, name: 'Occupancy Rate', value: '78%', icon: ChartBarIcon, change: '+8%', changeType: 'increase' },
];

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Bookings</h3>
          {/* Recent bookings chart or list would go here */}
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Bookings chart or list</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">User Activity</h3>
          {/* User activity chart would go here */}
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">User activity chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;