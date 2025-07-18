import React, { useEffect } from "react";
import Layout from "../../layouts/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooking as cancelBookingApi,
  getBookings,
} from "../../services/api";
import { setBookings, setError, setStatus } from "../../store/bookingSlice";
import { Clock, Calendar, CheckCircle, XCircle, Clock4 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { error, bookings } = useSelector((state) => state.booking);

  const navigate = useNavigate();
  const fetchBookings = async () => {
    try {
      dispatch(setError(null));
      const response = await getBookings();
      dispatch(setBookings(response.data));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      dispatch(setError(error.message));
    } finally {
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      dispatch(setError(null));
      if (window.confirm("Are you sure you want to cancel this booking?")) {
        const response = await cancelBookingApi(bookingId);
      }
      setStatus("cancelled");
      toast.success("Booking cancelled successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      dispatch(setError(error.message));
    } finally {
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock4 className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!bookings?.bookings || bookings.bookings.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">You haven't made any bookings yet.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-[90%] lg:w-[80%] mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            My Bookings
          </h1>
        </div>

        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          {bookings.bookings.map((booking) =>
            booking.status.toLowerCase() === "confirmed" ? (
              <>
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">
                            {booking.court}
                          </h3>
                          <span className="inline-flex items-center">
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 text-sm font-medium">
                              {booking.status}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          <span>
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-md p-3 text-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1.5" />
                          <span>
                            {new Date(booking.startTime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          <span className="mx-1">-</span>
                          <span>
                            {new Date(booking.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end w-full">
                        {booking.status.toLowerCase() !== "cancelled" && (
                          <button
                            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Only render bookings that are not cancelled
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
               
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">
                          {booking.court}
                        </h3>
                        <span className="inline-flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 text-sm font-medium">
                            {booking.status}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-md p-3 text-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>
                          {new Date(booking.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="mx-1">-</span>
                        <span>
                          {new Date(booking.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end w-full">
                      {booking.status.toLowerCase() !== "cancelled" && (
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>{" "}
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;
