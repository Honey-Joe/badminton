import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/';

axios.defaults.withCredentials = true;


export const loginAdmin = async (formdata) =>{
    const response = axios.post(`${API_URL}admin/login`, formdata)
    return response
}

export const logoutUser = async () => {
  const response = await axios.get(`${API_URL}admin/logout`);
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get(`${API_URL}admin/me`, {
    withCredentials: true
  });
  return response.data;
};

export const fetchUser = async ()=>{
  const response = await axios.get(`${API_URL}users`,{
    withCredentials:true
  })

  return response.data
}

export const fetchBooking = async ()=>{
  const response = await axios.get(`${API_URL}bookings`)

  return response.data
}

export const statsCombined = async ()=>{
  const response = await axios.get(`${API_URL}stats/overview`)

  return response.data
}