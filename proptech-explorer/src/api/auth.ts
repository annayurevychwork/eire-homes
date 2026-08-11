import axios from 'axios';

const API_URL = 'http://localhost:4000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (userData: { email: string; password: string; name: string }) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const saveSearch = async (filters: any) => {
  const response = await axios.post(
    `${API_URL}/searches`,
    { filters },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const fetchSavedSearches = async () => {
  const response = await axios.get(`${API_URL}/searches`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const uploadPropertyImage = async (imageFile: File, propertyId?: string) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  if (propertyId) {
    formData.append('propertyId', propertyId);
  }

  const response = await axios.post(`${API_URL}/properties/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};