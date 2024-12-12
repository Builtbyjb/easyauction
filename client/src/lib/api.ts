import axios from "axios";
import { logOut } from "./utils";
import { refreshToken } from "./utils";

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
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken.access) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken.access}`;

          // Retry the original request
          return api(originalRequest);
        } else {
          logOut();
        }
      } catch (error) {
        // If refresh fails, log out the user
        console.log(error);
        logOut();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
