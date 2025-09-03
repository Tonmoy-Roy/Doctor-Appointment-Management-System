import { useState } from "react";
import axiosInstance from "../../Lib/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAppointmentModal = ({ doctor, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Please select a date for your appointment");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/appointments", {
        doctorId: doctor._id,
        date: selectedDate,
      });
      
      toast.success("Appointment booked successfully!");
      setTimeout(() => {
        onClose();
        setSelectedDate("");
      }, 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Book Appointment with Dr. {doctor.name}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="date">
              Select Date and Time
            </label>
            <input
              type="datetime-local"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookAppointmentModal;