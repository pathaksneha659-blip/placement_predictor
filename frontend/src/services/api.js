import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
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