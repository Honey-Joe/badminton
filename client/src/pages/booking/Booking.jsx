import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, setError } from '../../store/authSlice';
import { createBooking, checkAvailability } from '../../services/api';
import { toast } from 'react-toastify';
import Layout from '../../layouts/Layout';

const BookingForm = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [availability, setAvailability] = useState(null);
  
  const [formData, setFormData] = useState({
    court: 'Court 1',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      date: dateStr,
      startTime: `${dateStr}T10:00`,
      endTime: `${dateStr}T11:00`
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) return;
    
    dispatch(setStatus('loading'));
    try {
      const isAvailable = await checkAvailability(
        formData.court,
        new Date(formData.startTime),
        new Date(formData.endTime)
      );
      setAvailability(isAvailable);
      console.log('Availability:', isAvailable);
      dispatch(setStatus('succeeded'));
      toast.success(isAvailable ? 'Court is available!' : 'Court is not available');
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setStatus('failed'));
      toast.error(error.message.data || 'Failed to check availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setStatus('loading'));
    
    try {
      await createBooking({
        ...formData,
      });
      dispatch(setStatus('succeeded'));
      alert('Booking created successfully!');
      // Reset form
      setFormData({
        court: 'Court 1',
        date: '',
        startTime: '',
        endTime: '',
        notes: ''
      });
      setAvailability(null);
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Booking failed'));
      dispatch(setStatus('failed'));
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <Layout>

    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Book a Court</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Court Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Court</label>
          <select
            name="court"
            value={formData.court}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>Court 1</option>
            <option>Court 2</option>
            <option>Court 3</option>
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            min={`${formData.date}T06:00`}
            max={`${formData.date}T22:00`}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            min={formData.startTime || `${formData.date}T06:00`}
            max={`${formData.date}T22:00`}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Availability Check */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCheckAvailability}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Check Availability
          </button>
          
          {availability !== null && (
            <span className={`text-sm font-medium ${availability ? 'text-green-600' : 'text-red-600'}`}>
              {availability ? 'Available!' : 'Not Available'}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={availability === false}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${availability === false ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
          >
            Book Court
          </button>
        </div>
      </form>
    </div>

    </Layout>
  );
};

export default BookingForm;