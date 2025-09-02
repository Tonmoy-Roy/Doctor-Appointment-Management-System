import React, { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axiosInstance";
const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [status, setStatus] = useState(""); // '', 'PENDING', 'COMPLETED', 'CANCELLED'
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `/appointments/patient?page=${page}${status ? `&status=${status}` : ""}`
            );
            setAppointments(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, page]);

    const handleCancel = async (appointmentId) => {
        const confirm = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirm) return;

        try {
            await axiosInstance.patch("/appointments/update-status", {
                status: "CANCELLED",
                appointment_id: appointmentId,
            });
            fetchAppointments(); // refresh list
        } catch (err) {
            console.error("Cancel failed", err);
        }
    };

    return (
        <div className="px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">My Appointments</h2>

            {/* Status Tabs */}
            <div className="flex justify-center space-x-4 mb-6">
                {["", "PENDING", "COMPLETED", "CANCELLED"].map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setStatus(s);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded ${status === s
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        {s === "" ? "All" : s}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading ? (
                <p className="text-center">Loading appointments...</p>
            ) : appointments.length === 0 ? (
                <p className="text-center text-gray-500">No appointments found.</p>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appt) => (
                        <div
                            key={appt._id}
                            className="bg-white p-4 shadow rounded flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{appt.doctor?.name}</h3>
                                <p className="text-sm text-gray-500">{appt.doctor?.specialization}</p>
                                <p className="text-sm mt-1">Date: {appt.date?.slice(0, 10)}</p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`font-bold ${appt.status === "PENDING"
                                        ? "text-yellow-600"
                                        : appt.status === "COMPLETED"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {appt.status}
                                </p>
                                {appt.status === "PENDING" && (
                                    <button
                                        onClick={() => handleCancel(appt._id)}
                                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls (optional) */}
            <div className="flex justify-center space-x-4 mt-8">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="self-center">Page {page}</span>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PatientAppointments;
