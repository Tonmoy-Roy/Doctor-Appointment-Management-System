import { useState } from "react";
import axiosInstance from "../Lib/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "PATIENT", // or DOCTOR
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = (name, value) => {
        switch (name) {
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

        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prev) => ({
            ...prev,
            [name]: validate(name, value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        for (const key in formData) {
            const error = validate(key, formData[key]);
            if (error) newErrors[key] = error;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post("/auth/login", formData);
            const { accessToken } = response.data;

            // ✅ Save token in localStorage (or Zustand/Context later)
            localStorage.setItem("token", accessToken);
            localStorage.setItem("role", formData.role);

            alert("Login successful!");

            // ✅ Navigate to role-based dashboard
            if (formData.role === "PATIENT") {
                navigate("/Pdashboard");
            } else {
                navigate("/ddashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed: " + (error.response?.data?.message || "Try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Role Selection */}
                <div>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                    >
                        <option value="PATIENT">Login as Patient</option>
                        <option value="DOCTOR">Login as Doctor</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
