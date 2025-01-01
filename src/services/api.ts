import axios from "axios";

const API_URL = "https://localhost:7186/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define itemsApi
export const itemsApi = {
  getAll: () => api.get("/items"),
  getById: (id: number) => api.get(`/items/${id}`),
  create: (data: any) => api.post("/items", data),
  update: (id: number, data: any) => api.put(`/items/${id}`, data),
  delete: (id: number) => api.delete(`/items/${id}`),
  search: (query: string) => api.get(`/items/search?q=${query}`),
};

export default api;
