import axios from "axios";
import { logOut } from "./utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized response, log out the user
      logOut();
    }
    return Promise.reject(error);
  }
);

export default api;
