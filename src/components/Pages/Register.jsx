import axiosInstance from "../Lib/axiosInstance";
import { useState } from "react";

const Register = () => {
    const [role, setRole] = useState("patient");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        photo_url: "",
    });
    const [errors, setErrors] = useState({});

    // Real-time validation
    const validate = (name, value) => {
        switch (name) {
            case "name":
                return value.length < 3 ? "Name must be at least 3 characters" : "";
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ""
                    : "Enter a valid email";
            case "password":
                return value.length < 6
                    ? "Password must be at least 6 characters"
                    : "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validate this field
        setErrors((prev) => ({
            ...prev,
            [name]: validate(name, value),
        }));
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setErrors({});
        setFormData({
            name: "",
            email: "",
            password: "",
            specialization: "",
            photo_url: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check
        const newErrors = {};
        for (const key in formData) {
            if (role === "patient" && key === "specialization") continue;
            const error = validate(key, formData[key]);
            if (error) newErrors[key] = error;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const endpoint =
                role === "patient" ? "/auth/register/patient" : "/auth/register/doctor";

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                photo_url: formData.photo_url || undefined,
            };

            if (role === "doctor") {
                payload.specialization = formData.specialization;
            }

            const res = await axiosInstance.post(endpoint, payload);

            // ✅ Success
            alert("Registration successful! You can now log in.");
            // Or use toast if you have it
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Something went wrong: " + (error?.response?.data?.message || "Try again."));
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">Register as {role}</h2>

            {/* Tab switch */}
            <div className="flex justify-center mb-6 space-x-4">
                <button
                    onClick={() => handleRoleChange("patient")}
                    className={`px-4 py-2 rounded ${role === "patient" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Patient
                </button>
                <button
                    onClick={() => handleRoleChange("doctor")}
                    className={`px-4 py-2 rounded ${role === "doctor" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Doctor
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Specialization (only for doctor) */}
                {role === "doctor" && (
                    <div>
                        <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="">Select Specialization</option>
                            <option>Cardiologist</option>
                            <option>Dentist</option>
                            <option>Neurologist</option>
                            <option>Dermatology</option>
                            <option>Eye specialist</option>
                            <option>Pediatrics</option>
                            <option>Orthopedics</option>
                        </select>
                    </div>
                )}

                {/* Photo URL (optional) */}
                <div>
                    <input
                        name="photo_url"
                        type="text"
                        placeholder="Photo URL (optional)"
                        value={formData.photo_url}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
