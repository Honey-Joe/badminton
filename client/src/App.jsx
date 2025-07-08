import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/auth/LoginForm';
import RegisterForm from './pages/auth/RegisterForm';
import Home from './components/Home';
import { toast, ToastContainer } from 'react-toastify';
import BookingForm from './pages/booking/Booking';
import { useEffect } from 'react';
import { getMe } from './services/api';
import { setCredentials } from './store/authSlice';
import MyBookings from './pages/booking/MyBookings';

function App() {

  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const response = await getMe();
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  })
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Home />} />
                    <Route path="/courts" element={<BookingForm />} />
          <Route path="/bookings" element={<MyBookings />} />

        </Routes>
      </Router>
    
    </>
   
  );
}

export default App;