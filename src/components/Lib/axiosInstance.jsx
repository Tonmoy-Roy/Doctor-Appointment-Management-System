import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://appointment-manager-node.onrender.com/api/v1",
});

export default axiosInstance;
