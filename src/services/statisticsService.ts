import { mockService } from "./mockData";
import { Item } from "../types";

export const statisticsService = {
  getItemStats: async () => {
    const items = await mockService.getItems();

    return {
      total: items.length,
      lost: items.filter((item) => item.type === "Lost").length,
      found: items.filter((item) => item.type === "Found").length,
      claimed: items.filter((item) => item.status === "claimed").length,
      pending: items.filter((item) => item.status === "pending").length,
      returned: items.filter((item) => item.status === "returned").length,
    };
  },

  getCategoryStats: async () => {
    const items = await mockService.getItems();

    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getLocationStats: async () => {
    const items = await mockService.getItems();

    return items.reduce((acc, item) => {
      acc[item.location] = (acc[item.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getTimeStats: async () => {
    const items = await mockService.getItems();
    const now = new Date();

    return {
      today: items.filter((item) => {
        const itemDate = new Date(item.reportedDate);
        return itemDate.toDateString() === now.toDateString();
      }).length,
      thisWeek: items.filter((item) => {
        const itemDate = new Date(item.reportedDate);
        const diffTime = Math.abs(now.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length,
      thisMonth: items.filter((item) => {
        const itemDate = new Date(item.reportedDate);
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }).length,
    };
  },
};
