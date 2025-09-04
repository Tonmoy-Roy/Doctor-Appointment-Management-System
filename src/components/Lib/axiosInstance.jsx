import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://appointment-manager-node.onrender.com/api/v1",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;