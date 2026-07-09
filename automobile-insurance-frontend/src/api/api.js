import axios from "axios";
import authUtils from "../utils/authUtils";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// All backend endpoints now live under /api/v1 (see SecurityConfig /
// each @RequestMapping on the backend). Every service file continues to
// call relative paths like "/policies" or "/auth/login" unchanged - this
// single baseURL is the only place that needed to know about versioning.
const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = authUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// If the server ever responds 401 (missing/expired token), clear the
// session and send the user back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authUtils.clearSession();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
