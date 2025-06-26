// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => `${API_URL}/api${endpoint}`; 