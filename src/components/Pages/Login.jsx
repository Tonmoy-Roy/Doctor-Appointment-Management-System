import { useState } from "react";
import axiosInstance from "../Lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "PATIENT", 
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

            const { email, password, role } = formData;
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
                role,
            });

            console.log("Login API Response:", response.data);

            const token =
                response.data.token ||
                response.data.accessToken ||
                response.data.access_token ||
                response.data.data?.token;

            if (!token) {
                console.error("Token not found in response:", response.data);
                throw new Error("No authentication token received.");
            }

            localStorage.setItem("authToken", token);
            localStorage.setItem("userRole", role);

            toast.success("Login successful!");

            if (role === "PATIENT") {
                navigate("/Pdashboard");
            } else {
                navigate("/ddashboard");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error);

            const apiError = error.response?.data;
            const errorMessage =
                apiError?.message ||
                (typeof apiError === "string" ? apiError : "") ||
                "Login failed. Please try again.";
 if (apiError?.errors) {
                const fieldErrors = Object.entries(apiError.errors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(", ");
                toast.error(`Validation Error: ${fieldErrors}`);
            } else {
                toast.error(errorMessage);
            }
            if (apiError?.errors) {
                const fieldErrors = Object.entries(apiError.errors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(", ");
                toast.error(`Validation Error: ${fieldErrors}`);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-center">
                Don't have an account?{" "}
                <button
                    onClick={() => navigate("/register")}
                    className="text-blue-600 hover:underline"
                >
                    Register here
                </button>
            </p>
        </div>
    );
};

export default Login;