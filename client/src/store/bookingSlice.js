import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  status: 'idle',
  error: null,
  loading: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = true;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
      state.loading = false;    
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
        state.loading = false;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
        state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
        state.loading = false;
    }
  }
});

export const { setBookings, setLoading, addBooking, removeBooking, setStatus, setError } = bookingSlice.actions;
export default bookingSlice.reducer;

// Selectors
export const selectBookings = (state) => state.booking.bookings;
export const selectBookingStatus = (state) => state.booking.status;
export const selectBookingError = (state) => state.booking.error;
export const selectBookingLoading = (state) => state.booking.loading;

// Export the reducer to be used in the store
export const bookingReducer = bookingSlice.reducer;
