import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkMultipleAvailabilities, createBooking } from "../../services/api";
import { toast } from "react-toastify";
import Layout from "../../layouts/Layout";

const Booking = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState("Court 1");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [notes, setNotes] = useState(""); // Added notes state

  // Generate 1-hour time slots from 5AM to 12AM
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 5; // 5AM opening
    const endHour = 24; // 12AM midnight closing

    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push({
        time: timeString,
        displayTime: `${displayHour}:00 ${hour >= 12 ? "PM" : "AM"}`,
        isAvailable: false,
        isSelected: false,
      });
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  // Format date as "Mon, 07 Jul 2025"
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format date for API as "YYYY-MM-DD"
  const formatApiDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const isSlotInPast = (slotTime) => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();

    if (!isToday) return false;

    const [hours] = slotTime.split(":").map(Number);
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();

    // If current time is past this slot's start time
    return hours < currentHour || (hours === currentHour && 0 < currentMinutes);
  };

  // Check availability for all slots in parallel
  useEffect(() => {
    const checkAllSlots = async () => {
      setBatchLoading(true);
      const dateStr = formatApiDate(selectedDate);

      const slotsToCheck = timeSlots.map((slot) => ({
        court: selectedCourt,
        startTime: `${dateStr}T${slot.time}`,
        endTime: `${dateStr}T${(parseInt(slot.time.split(":")[0]) + 1)
          .toString()
          .padStart(2, "0")}:00`, // 1-hour slots
      }));

      try {
        const response = await checkMultipleAvailabilities({
          slots: slotsToCheck,
        });
        console.log("Availability response:", response);
        console.log("Slots to check:", slotsToCheck);

        setTimeSlots((prevSlots) =>
          prevSlots.map((slot, index) => ({
            ...slot,
            isAvailable: response.data.results[index].available,
            isSelected: false, // Reset selection when changing date/court
          }))
        );
        console.log("Updated time slots:", timeSlots);
        setSelectedSlots([]);
      } catch (error) {
        toast.error("Failed to check availability");
        console.error("Availability check error:", error);
      } finally {
        setBatchLoading(false);
      }
    };

    checkAllSlots();
  }, [selectedDate, selectedCourt]);

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    return date < today;
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);

    // Prevent navigating to past dates
    if (isPastDate(newDate)) {
      return;
    }

    setSelectedDate(newDate);
  };
  const handleSlotClick = (slot) => {
    if (!slot.isAvailable) return;

    setTimeSlots((prev) =>
      prev.map((s) =>
        s.time === slot.time ? { ...s, isSelected: !s.isSelected } : s
      )
    );

    setSelectedSlots((prev) => {
      if (prev.some((s) => s.time === slot.time)) {
        return prev.filter((s) => s.time !== slot.time);
      } else {
        return [...prev, slot];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSlots.length === 0 || !user) return;

    setLoading(true);
    try {
      const dateStr = formatApiDate(selectedDate);

      // Create all bookings in parallel
      const bookingPromises = selectedSlots.map((slot) => {
        const startTime = new Date(`${dateStr}T${slot.time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

        return createBooking({
          court: selectedCourt,
          date: dateStr,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: notes, // Include notes with each booking
        });
      });

      await Promise.all(bookingPromises);

      toast.success(`Successfully booked ${selectedSlots.length} slots!`);

      // Update availability for booked slots
      setTimeSlots((prev) =>
        prev.map((slot) =>
          selectedSlots.some((s) => s.time === slot.time)
            ? { ...slot, isAvailable: false, isSelected: false }
            : slot
        )
      );
      setSelectedSlots([]);
      setNotes(""); // Clear notes after successful booking
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total booking duration and price
  const totalHours = selectedSlots.length;
  const pricePerHour = 300; // Example pricing
  const totalPrice = totalHours * pricePerHour;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Badminton Court Booking</h1>
            <div className="text-sm">{formatDate(selectedDate)} ▼</div>
          </div>
        </div>

        {/* Court Selection */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Select Court</h2>
          <div className="flex space-x-2">
            {["Court 1", "Court 2", "Court 3"].map((court) => (
              <button
                key={court}
                onClick={() => setSelectedCourt(court)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCourt === court
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {court}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            Available Time Slots (1-hour)
          </h2>
          {batchLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Loading availability...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots
                .filter((slot) => {
                  // Hide completely if it's in the past
                  const isPast = isSlotInPast(slot.time);
                  return !isPast;
                })
                .map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!slot.isAvailable}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      slot.isSelected
                        ? "border-red-600 bg-red-50 shadow-md"
                        : slot.isAvailable
                        ? "border-gray-200 hover:border-red-400 hover:bg-red-50"
                        : "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-medium">{slot.displayTime}</div>
                    <div className="text-xs mt-1">₹{pricePerHour}</div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Booking Summary */}
        {selectedSlots.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <h2 className="text-lg font-semibold mb-2">Your Selection</h2>
            <div className="space-y-2 mb-4">
              {selectedSlots.map((slot) => (
                <div
                  key={slot.time}
                  className="flex justify-between items-center"
                >
                  <span>{slot.displayTime}</span>
                  <span className="font-medium">₹{pricePerHour}</span>
                </div>
              ))}
            </div>

            {/* Notes Section - Added this new section */}
            <div className="mb-4">
              <label
                htmlFor="booking-notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Notes (Optional)
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Any special requests or notes for your booking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-semibold">
                Total ({totalHours} hour{totalHours > 1 ? "s" : ""})
              </span>
              <span className="font-bold text-lg">₹{totalPrice}</span>
            </div>
          </div>
        )}

        {/* Date Navigation */}
        <div className="p-4 bg-gray-100 flex justify-between items-center">
          <button
            onClick={() => handleDateChange(-1)}
            disabled={batchLoading || isPastDate(selectedDate)}
            className={`px-4 py-2 rounded-md ${
              batchLoading || isPastDate(selectedDate)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Previous Day
          </button>
          <div className="font-medium">{formatDate(selectedDate)}</div>
          <button
            onClick={() => handleDateChange(1)}
            disabled={batchLoading}
            className={`px-4 py-2 rounded-md ${
              batchLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Next Day
          </button>
        </div>

        {/* Proceed Button */}
        <div className="p-4 bg-gray-100 border-t">
          <button
            onClick={handleBooking}
            disabled={selectedSlots.length === 0 || loading || batchLoading}
            className={`w-full py-3 rounded-md font-bold text-lg ${
              selectedSlots.length > 0 && !batchLoading
                ? "bg-red-600 text-white hover:bg-red-700 shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading
              ? `Booking ${selectedSlots.length} Slot${
                  selectedSlots.length > 1 ? "s" : ""
                }...`
              : `Book Now (₹${totalPrice})`}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
