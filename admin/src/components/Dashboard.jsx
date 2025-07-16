import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/outline';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { API_URL } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingsByCourt, setBookingsByCourt] = useState([]);
  const [bookingsTrend, setBookingsTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(API_URL+'stats/overview');
        const detailedStats = await axios.get(API_URL+'stats/bookings');
        console.log(data, detailedStats);
        
        setStats(data.data);
        setBookingsByCourt(detailedStats.data.data.bookingsByCourt);
        
        // Process bookings trend data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendData = detailedStats.data.data.bookingsByMonth.map(item => ({
          month: months[item._id - 1],
          count: item.count,
          revenue: item.revenue
        }));
        setBookingsTrend(trendData);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error: {error}</div>;

  // Prepare data for charts
  const courtChartData = {
    labels: bookingsByCourt.map(item => item._id),
    datasets: [
      {
        label: 'Bookings',
        data: bookingsByCourt.map(item => item.count),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
      },
      {
        label: 'Revenue',
        data: bookingsByCourt.map(item => item.revenue),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  const trendChartData = {
    labels: bookingsTrend.map(item => item.month),
    datasets: [
      {
        label: 'Bookings',
        data: bookingsTrend.map(item => item.count),
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Revenue',
        data: bookingsTrend.map(item => item.revenue),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const statCards = [
    { 
      id: 1, 
      name: 'Total Users', 
      value: stats?.users?.stats?.totalUsers || 0, 
      icon: UserGroupIcon,
      change: '+12%',
      changeType: 'increase'
    },
    
    { 
      id: 3, 
      name: 'Total Bookings', 
      value: stats?.bookings?.stats?.totalBookings || 0, 
      icon: CalendarIcon,
      change: '+5%',
      changeType: 'increase'
    },
   
  

  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
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
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings by Court */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Bookings by Court</h3>
          <div className="h-80">
            <Bar 
              data={courtChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.dataset.label + ': ' + 
                          (context.dataset.label === 'Revenue' ? 
                           '$' + context.raw.toLocaleString() : 
                           context.raw);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return this.getLabelForValue(value).toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Bookings Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Bookings Trend (Last 6 Months)</h3>
          <div className="h-80">
            <Line 
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.dataset.label + ': ' + 
                          (context.dataset.label === 'Revenue' ? 
                           '$' + context.raw.toLocaleString() : 
                           context.raw);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return this.getLabelForValue(value).toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
    
    </div>
  );
};

export default Dashboard;