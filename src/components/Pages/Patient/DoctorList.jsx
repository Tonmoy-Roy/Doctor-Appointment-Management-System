import React, { useState } from "react";
import axiosInstance from "../../Lib/axiosInstance";
const DoctorCard = ({ doctor }) => {
    const [showModal, setShowModal] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        if (!appointmentDate) {
            alert("Please select a date.");
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post("/appointments", {
                doctorId: doctor._id,
                date: appointmentDate,
            });

            alert("Appointment booked successfully!");
            setShowModal(false);
            setAppointmentDate("");
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Failed to book appointment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Doctor Card */}
            <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
                <img
                    src={doctor.photo_url || "https://via.placeholder.com/100"}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                <h3 className="text-center font-bold text-lg mt-2">{doctor.name}</h3>
                <p className="text-center text-sm text-gray-500">{doctor.specialization}</p>
                <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Book Appointment
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
                        <p className="mb-2">
                            Doctor: <span className="font-medium">{doctor.name}</span>
                        </p>
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="input input-bordered w-full mb-4"
                        />
                        <button
                            onClick={handleBook}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorCard;
