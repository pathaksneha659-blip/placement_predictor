import axios from "axios";

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    // Local development: use relative path so Vite proxy forwards to local backend
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "";
    }
    // Production cloud deployment (Render, Vercel, etc.): default to live backend service
    return "https://placement-predictor-2-8o1t.onrender.com";
  }
  return "";
};

export const API_BASE_URL = getApiBaseUrl();
export const DOCS_URL = API_BASE_URL ? `${API_BASE_URL}/docs` : "http://127.0.0.1:8000/docs";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 seconds to accommodate Render free-tier cold starts
});

export const predictPlacement = async (formData) => {
  const response = await api.post("/predict", formData);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
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