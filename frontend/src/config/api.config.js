// API Configuration
// This ensures all API calls use the correct base URL
// Local: http://localhost:5000/api
// Production (Vercel): /api

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to build full API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Remove /api prefix if already in endpoint
  const finalEndpoint = cleanEndpoint.startsWith('api/') ? cleanEndpoint.slice(4) : cleanEndpoint;
  
  return `${API_BASE_URL}/${finalEndpoint}`;
};

export default {
  API_BASE_URL,
  getApiUrl
};
