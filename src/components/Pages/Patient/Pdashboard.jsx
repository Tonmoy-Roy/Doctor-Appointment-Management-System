import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import axiosInstance from "../../Lib/axiosInstance";
import PatientAppointments from "./PatientAppointments";
import BookAppointmentModal from "./BookAppointmentModal";

const Pdashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1);
    const [specialization, setSpecialization] = useState("");
    const limit = 3;
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [triggerSearch, setTriggerSearch] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(
                    `/doctors?page=${page}&limit=${limit}${specialization ? `&specialization=${specialization}` : ""
                    }`
                );
                const fetchedDoctors = response.data.data;
                setDoctors(fetchedDoctors);
                setHasMore(fetchedDoctors.length === limit);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [page, specialization]);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(
                    `/doctors?page=${page}&limit=${limit}${specialization ? `&specialization=${specialization}` : ""
                    }${searchTerm ? `&search=${searchTerm}` : ""}`
                );
                const fetchedDoctors = response.data.data;
                setDoctors(fetchedDoctors);
                setHasMore(fetchedDoctors.length === limit);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, specialization, triggerSearch]);

    const handleBookAppointment = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    const handleNext = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleSpecializationChange = (e) => {
        setSpecialization(e.target.value);
        setPage(1);
    };

    return (
        <div className="px-4">
            <p className='text-2xl font-bold mb-6 text-center mt-10'>Doctor List</p>
            <div className='md:flex justify-center items-center mb-8 '>
                <div className="mr-5 mb-2 ">
                    <div className="relative ">
                        <input
                            name="search"
                            type="text"
                            className="input pl-10 pr-4 py-2 rounded-xl border-black"
                            placeholder="Search by doctor name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setPage(1);
                                    setTriggerSearch(prev => !prev);
                                }
                            }}
                        />
                        <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    </div>
                </div>

                <div>
                    <select
                        value={specialization}
                        onChange={handleSpecializationChange}
                        className="select"
                    >
                        <option value="">All Specializations</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dentist">Dentist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Eye specialist">Eye specialist</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Orthopedics">Orthopedics</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-center py-10">Loading doctors...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor._id}
                            className="bg-white shadow-md p-6 rounded-lg text-center"
                        >
                            <img
                                src={doctor.photo_url || "https://i.pravatar.cc/150"}
                                alt={doctor.name}
                                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                            />
                            <h2 className="text-lg font-bold">{doctor.name}</h2>
                            <p className="text-gray-600">{doctor.specialization}</p>
                            <button
                                onClick={() => handleBookAppointment(doctor)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="md:flex justify-center mt-8 space-x-4 mb-10">
                <button
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${page === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "btn bg-gray-300"
                        }`}
                >
                    Previous
                </button>
                <span className="self-center">Page {page}</span>
                <button
                    onClick={handleNext}
                    disabled={!hasMore}
                    className={`px-4 py-2 rounded ${!hasMore
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "btn bg-gray-300"
                        }`}
                >
                    Next
                </button>
            </div>

            {selectedDoctor && (
                <BookAppointmentModal
                    doctor={selectedDoctor}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            <div>
                <PatientAppointments />
            </div>
        </div>
    );
};

export default Pdashboard;