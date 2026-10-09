import axios from "axios";

// Default production deployed backend URL
export const BACKEND_URL = "https://placement-predictor-2-8o1t.onrender.com";

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return BACKEND_URL;
};

export const API_BASE_URL = getApiBaseUrl();
export const DOCS_URL = `${API_BASE_URL}/docs`;

// Event listeners for global API health / success notifications
const statusListeners = new Set();

export const subscribeApiStatus = (callback) => {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
};

export const notifyApiStatus = (status) => {
  statusListeners.forEach((cb) => {
    try {
      cb(status);
    } catch {}
  });
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds to accommodate Render free-tier cold starts
});

// Interceptor: Any successful response from the backend confirms it is online
api.interceptors.response.use(
  (response) => {
    notifyApiStatus("online");
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const predictPlacement = async (formData) => {
  const response = await api.post("/predict", formData);
  return response.data;
};

export const getDefaults = async () => {
  const response = await api.get("/defaults");
  return response.data;
};

export const checkHealth = async () => {
  // Use timestamp query param to completely bust browser and edge caching on GET
  const timestamp = Date.now();
  const url = `${API_BASE_URL}/health?_t=${timestamp}`;

  // 1. Try native fetch first (CORS-safelisted GET request without preflight)
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      notifyApiStatus("online");
      return data;
    }
    throw new Error(`Health fetch returned status ${res.status}`);
  } catch (fetchErr) {
    // Fallback to axios instance with timeout
  }

  // 2. Fallback to axios instance
  try {
    const response = await api.get(`/health?_t=${timestamp}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    notifyApiStatus("online");
    return response.data;
  } catch (axiosErr) {
    throw axiosErr;
  }
};

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/analyze-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const matchJob = async (jobDescription, profileText = null, userSkills = null) => {
  const response = await api.post("/match-job", {
    job_description: jobDescription,
    profile_text: profileText,
    user_skills: userSkills,
  });
  return response.data;
};

export const sendCareerChat = async (message, studentContext = {}) => {
  const response = await api.post("/career-chat", {
    message,
    student_context: studentContext,
  });
  return response.data;
};

export default api;