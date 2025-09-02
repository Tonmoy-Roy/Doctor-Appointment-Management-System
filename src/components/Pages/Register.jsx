import { useState } from "react";

const Register = () => {
    const [activeTab, setActiveTab] = useState("patient");

    return (
        <div className="w-full max-w-md mx-auto p-6">
            {/* Tab Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab("patient")}
                    className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${activeTab === "patient"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Patient
                </button>
                <button
                    onClick={() => setActiveTab("doctor")}
                    className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${activeTab === "doctor"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Doctor
                </button>
            </div>

            <div className="bg-white shadow-md p-6 rounded-b-lg border border-t-0">
                {activeTab === "patient" ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Patient Registration</h2>
                        <form>
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Register as Patient
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Doctor Registration</h2>
                        {/* Replace with your form inputs */}
                        <form>
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Specialization"
                                className="w-full mb-4 p-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Register as Doctor
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
