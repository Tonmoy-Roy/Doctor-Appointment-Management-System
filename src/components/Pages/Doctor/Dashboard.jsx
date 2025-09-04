import { useEffect, useState } from "react";
import axiosInstance from "../../Lib/axiosInstance";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      
      if (dateFilter) {
        params.append("date", dateFilter);
      }

      const res = await axiosInstance.get(`/appointments/doctor?${params.toString()}`);
      
      console.log("Doctor Appointments API Response:", res.data);
      
      const appointmentsData = res.data.data || res.data.appointments || res.data || [];
      setAppointments(appointmentsData);
      
      setHasMore(appointmentsData.length > 0); 
    } catch (err) {
      console.error("Error fetching doctor appointments", err);
      if (err.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error("Failed to fetch appointments");
      }
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
      
      toast.success(`Appointment marked as ${newStatus}`);
      fetchAppointments(); 
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Failed to update appointment status");
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Doctor Dashboard</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
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

        <input
          type="date"
          className="input input-bordered"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        />
        
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 mb-4">
        Showing page {page} • Filter: {statusFilter || "All"} • Date: {dateFilter || "Any"}
      </div>

      {loading ? (
        <p className="text-center py-4">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No appointments found. {statusFilter || dateFilter ? "Try changing filters." : ""}
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {appt.patient?.name || appt.patientName || "Unknown Patient"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Date: {formatDisplayDate(appt.date)}
                  </p>
                  {appt.patient?.email && (
                    <p className="text-sm text-gray-500">
                      Email: {appt.patient.email}
                    </p>
                  )}
                  {appt.patient?.phone && (
                    <p className="text-sm text-gray-500">
                      Phone: {appt.patient.phone}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${appt.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : appt.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {appt.status}
                  </span>

                  {appt.status === "PENDING" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleUpdateStatus(appt._id, "COMPLETED")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt._id, "CANCELLED")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span className="self-center font-medium">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={!hasMore || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;