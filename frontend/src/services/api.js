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

export const getDefaults = async () => {
  const response = await api.get("/defaults");
  return response.data;
};

export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (axiosErr) {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Both attempts failed
    }
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