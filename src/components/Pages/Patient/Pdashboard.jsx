import axiosInstance from "../../Lib/axiosInstance";import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

const Pdashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get("/doctors?page=1&limit=9");
                setDoctors(response.data.data); // API response structure
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <p className="text-center py-10">Loading doctors...</p>;


    return (
        <div>
            <p className='font-semibold mb-5 text-xl mt-10'>Doctor List</p>
            <div className='md:flex justify-center items-center'>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white shadow-md p-6 rounded-lg text-center">
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
        </div>
    );
};

export default Pdashboard;