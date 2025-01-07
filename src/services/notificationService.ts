import { mockService } from "./mockData";
import { Item, User } from "../types";

export const notificationService = {
  // Notification pour un nouvel objet
  notifyNewItem: async (item: Item) => {
    const message = `Nouvel objet ${
      item.type === "Lost" ? "perdu" : "trouvé"
    }: ${item.description}`;
    return mockService.createNotification({
      message,
      type: "info",
      userId: item.reportedByUserId,
      itemId: item.id,
    });
  },

  // Notification pour un changement de statut
  notifyStatusChange: async (item: Item, newStatus: string) => {
    const message = `Le statut de l'objet "${item.description}" a été changé en "${newStatus}"`;
    return mockService.createNotification({
      message,
      type: "update",
      userId: item.reportedByUserId,
      itemId: item.id,
    });
  },

  // Notification pour une correspondance potentielle
  notifyPotentialMatch: async (lostItem: Item, foundItem: Item) => {
    const message = `Un objet similaire à votre objet perdu "${lostItem.description}" a été trouvé`;
    return mockService.createNotification({
      message,
      type: "match",
      userId: lostItem.reportedByUserId,
      itemId: foundItem.id,
    });
  },
};
