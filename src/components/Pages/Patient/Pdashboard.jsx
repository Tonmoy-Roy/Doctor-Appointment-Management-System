import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import axiosInstance from "../../Lib/axiosInstance";


const Pdashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 6;
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true); // optional for disabling next

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/doctors?page=${page}&limit=${limit}`);
                const fetchedDoctors = response.data.data;
                setDoctors(fetchedDoctors);

                // If fewer than limit are returned, we’re on the last page
                setHasMore(fetchedDoctors.length === limit);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [page]);

    const handleNext = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    if (loading) return <p className="text-center py-10">Loading doctors...</p>;


    return (
        <div>
            <p className='font-semibold mb-5 text-xl mt-10'>Doctor List</p>
            <div className='md:flex justify-center items-center mb-5'>
                <div className="mr-5">
                    <div className="relative">
                        <input
                            name="search"
                            type="text"
                            className="input w-full max-w-xs pl-10 pr-4 py-2 rounded-xl border-black"
                            placeholder="Search by doctor name"
                            onKeyDown=""
                            // onChange={(e) => setSearchTerm(e.target.value)}
                            value=""
                        />
                        <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    </div>
                </div>
                <div>
                    <select defaultValue="Pick a color" className="select">
                        <option disabled={true}>Specialization</option>
                        <option>Cardiologist</option>
                        <option>Dentist</option>
                        <option>Neurologist</option>
                    </select>
                </div>
            </div>
            <div className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-8 space-x-4">
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
                    <span className="self-center font-semibold text-gray-700">Page {page}</span>
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
            </div>
        </div>
    );
};

export default Pdashboard;