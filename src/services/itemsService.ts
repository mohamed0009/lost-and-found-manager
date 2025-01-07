import api from "./api";
import { Item } from "../types";

const itemsService = {
  getAll: async () => {
    const response = await api.get<Item[]>("/items");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<Item>("/items", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    const response = await api.put<Item>(`/items/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/items/${id}`);
  },

  search: async (query: string) => {
    const response = await api.get<Item[]>(`/items/search?q=${query}`);
    return response.data;
  },
};

export default itemsService;
