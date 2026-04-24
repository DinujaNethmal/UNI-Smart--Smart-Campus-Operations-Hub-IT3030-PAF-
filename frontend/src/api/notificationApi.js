import axios from 'axios';

const API_BASE = 'http://localhost:8081/api/notifications';

const notificationClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getMyNotifications() {
  const response = await notificationClient.get('/me');
  return response.data;
}

export async function getUnreadNotifications() {
  const response = await notificationClient.get('/me/unread');
  return response.data;
}

export async function markNotificationAsRead(id) {
  const response = await notificationClient.put(`/${id}/read`);
  return response.data;
}

export async function deleteNotification(id) {
  const response = await notificationClient.delete(`/${id}`);
  return response.data;
}
