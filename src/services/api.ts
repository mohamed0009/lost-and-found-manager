import axios from "axios";
import TokenService from "./tokenService";

const api = axios.create({
  baseURL: "https://localhost:7186/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = TokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      TokenService.removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const itemsApi = {
  getAll: () => api.get("/items"),
  getById: (id: number) => api.get(`/items/${id}`),
  create: (data: any) => api.post("/items", data),
  update: (id: number, data: any) => api.put(`/items/${id}`, data),
  delete: (id: number) => api.delete(`/items/${id}`),
  search: (query: string) => api.get(`/items/search?q=${query}`),
  updateStatus: (id: number, status: string) =>
    api.put(`/items/${id}/status`, status),
};

export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const adminApi = {
  getUsers: () => api.get("/admin/users"),
  updateUserStatus: (userId: number, status: string) =>
    api.put(`/admin/users/${userId}/status`, status),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  getItems: () => api.get("/admin/items"),
};

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
  role: string;
}) => {
  const response = await axios.post("/api/admin/users", userData);
  return response.data;
};

export default api;
