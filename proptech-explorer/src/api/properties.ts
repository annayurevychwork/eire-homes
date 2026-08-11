import axios from 'axios';

const API_URL = 'https://eire-homes.onrender.com';

export const fetchProperties = async (filters?: {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  ber?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axios.get(`${API_URL}/properties`, {
      params: filters,
    });
    return response.data; 
  } catch (error) {
    console.error('Error loading property from backend:', error);
    throw error;
  }
};