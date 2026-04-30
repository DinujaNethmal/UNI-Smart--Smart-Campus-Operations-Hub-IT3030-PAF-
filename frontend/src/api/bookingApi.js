import axios from 'axios';

const API_BASE = 'http://localhost:8081/api/v1';

const bookingClient = axios.create({
  baseURL: `${API_BASE}/bookings`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createBooking = async (bookingData) => {
  const response = await bookingClient.post('', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await bookingClient.get('/me');
  return response.data;
};

export const getAllBookings = async (statusFilter) => {
  const params = statusFilter ? { status: statusFilter } : {};
  const response = await bookingClient.get('', { params });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await bookingClient.get(`/${id}`);
  return response.data;
};

export const reviewBooking = async (id, decision, reason) => {
  const response = await bookingClient.patch(`/${id}/review`, {
    decision,
    reason,
  });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await bookingClient.delete(`/${id}`);
  return response.data;
};
