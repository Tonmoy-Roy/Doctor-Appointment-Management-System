import { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axiosInstance";
const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/appointments/doctor?page=${page}${
          statusFilter ? `&status=${statusFilter}` : ""
        }${dateFilter ? `&date=${dateFilter}` : ""}`
      );
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching doctor appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter, page]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    const confirm = window.confirm(`Mark this appointment as ${newStatus}?`);
    if (!confirm) return;

    try {
      await axiosInstance.patch("/appointments/update-status", {
        status: newStatus,
        appointment_id: appointmentId,
      });
      fetchAppointments(); // Refresh list
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Doctor Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* Status Filter */}
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          className="input input-bordered"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Appointment List */}
      {loading ? (
        <p className="text-center">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{appt.patient?.name}</h3>
                <p className="text-sm text-gray-600">
                  Date: {appt.date?.slice(0, 10)}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold mb-2 ${
                    appt.status === "PENDING"
                      ? "text-yellow-600"
                      : appt.status === "COMPLETED"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {appt.status}
                </p>

                {/* Update buttons (only if pending) */}
                {appt.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(appt._id, "COMPLETED")
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(appt._id, "CANCELLED")
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === 1}
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

export default Dashboard;
