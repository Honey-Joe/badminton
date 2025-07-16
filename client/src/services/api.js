import axios from 'axios';

// export const API_URL = 'http://localhost:3000/api/v1';

export const API_URL = 'https://badminton-project-api.vercel.app/api/v1';

axios.defaults.withCredentials = true;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};
// services/api.js
export const getMe = async () => {
  const response = await axios.get(`${API_URL}/users/me`, {
    withCredentials: true
  });
  return response.data;
};
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.get(`${API_URL}/auth/logout`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axios.post(`${API_URL}/bookings`, bookingData);
  return response.data;
};

export const getBookings = async () => {
  const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
    withCredentials: true
  });
  return response.data;
}

export const cancelBooking = async (bookingId) => {
  const response = await axios.delete(`${API_URL}/bookings/${bookingId}/cancel`);
  return response.data;
};

export const checkAvailability = async (court, startTime, endTime) => {
  const response = await axios.post(`${API_URL}/bookings/check-availability`, {
    court,
    startTime,
    endTime
  });
  return response.data.data.available;
};
export const checkMultipleAvailabilities = async (slotsData) => {
  const response = await axios.post(`${API_URL}/bookings/check-multiple-availabilities`, 
    slotsData,
  );
  return response.data;
};

