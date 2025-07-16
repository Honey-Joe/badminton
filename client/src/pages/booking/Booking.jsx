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
  const [notes, setNotes] = useState("");

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 5;
    const endHour = 24;

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

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
    return hours < currentHour || (hours === currentHour && 0 < currentMinutes);
  };

  // ⬇️ Availability Check with UTC ISO strings
  useEffect(() => {
    const checkAllSlots = async () => {
      setBatchLoading(true);
      const dateStr = formatApiDate(selectedDate);

      const slotsToCheck = timeSlots.map((slot) => {
        const startTime = new Date(`${dateStr}T${slot.time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        return {
          court: selectedCourt,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        };
      });

      console.log("🧪 Checking availability for:", slotsToCheck);

      try {
        const response = await checkMultipleAvailabilities({ slots: slotsToCheck });
        const results = response?.data?.results || [];

        setTimeSlots((prevSlots) =>
          prevSlots.map((slot, index) => ({
            ...slot,
            isAvailable: results[index]?.available ?? false,
            isSelected: false,
          }))
        );
        setSelectedSlots([]);
      } catch (error) {
        console.error("❌ Availability check failed:", error);
        toast.error("Availability check failed");
      } finally {
        setBatchLoading(false);
      }
    };

    checkAllSlots();
  }, [selectedDate, selectedCourt]);

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    if (isPastDate(newDate)) return;
    setSelectedDate(newDate);
  };

  const handleSlotClick = (slot) => {
    if (!slot.isAvailable) return;

    setTimeSlots((prev) =>
      prev.map((s) => s.time === slot.time ? { ...s, isSelected: !s.isSelected } : s)
    );

    setSelectedSlots((prev) =>
      prev.some((s) => s.time === slot.time)
        ? prev.filter((s) => s.time !== slot.time)
        : [...prev, slot]
    );
  };

  const handleBooking = async () => {
    if (selectedSlots.length === 0 || !user) return;
    setLoading(true);

    try {
      const dateStr = formatApiDate(selectedDate);

      const bookingPromises = selectedSlots.map((slot) => {
        const startTime = new Date(`${dateStr}T${slot.time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        return createBooking({
          court: selectedCourt,
          date: dateStr,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes,
        });
      });

      await Promise.all(bookingPromises);
      toast.success(`Booked ${selectedSlots.length} slot(s) successfully`);

      setTimeSlots((prev) =>
        prev.map((slot) =>
          selectedSlots.some((s) => s.time === slot.time)
            ? { ...slot, isAvailable: false, isSelected: false }
            : slot
        )
      );
      setSelectedSlots([]);
      setNotes("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const totalHours = selectedSlots.length;
  const pricePerHour = 300;
  const totalPrice = totalHours * pricePerHour;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Badminton Court Booking</h1>
          <div className="text-sm">{formatDate(selectedDate)} ▼</div>
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
          <h2 className="text-lg font-semibold mb-2">Available Time Slots (1-hour)</h2>
          {batchLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Checking availability...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots
                .filter((slot) => !isSlotInPast(slot.time))
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
                <div key={slot.time} className="flex justify-between items-center">
                  <span>{slot.displayTime}</span>
                  <span className="font-medium">₹{pricePerHour}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label htmlFor="booking-notes" className="block text-sm font-medium mb-1">
                Notes (optional)
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Any special requests or notes..."
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

        {/* Submit */}
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
              ? `Booking ${selectedSlots.length} slot(s)...`
              : `Book Now (₹${totalPrice})`}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
