import axios from 'axios';

const API_BASE = 'http://localhost:8081/api/v1';

const catalogueClient = axios.create({
  baseURL: `${API_BASE}/facilities`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFacilities = async () => {
  const response = await catalogueClient.get('');
  return response.data;
};

export const createFacility = async (data) => {
  const response = await catalogueClient.post('', data);
  return response.data;
};

export const updateFacility = async (id, data) => {
  const response = await catalogueClient.put(`/${id}`, data);
  return response.data;
};

export const deleteFacility = async (id) => {
  const response = await catalogueClient.delete(`/${id}`);
  return response.data;
};
