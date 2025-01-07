import { Item, User, ErrorCode } from "../types";
import { USER_ROLES, USER_STATUS } from "../constants";
// Mock Users avec les types stricts
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin EMSI",
    email: "admin@emsi.ma",
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    lastLogin: "2024-01-20T10:30:00",
    createdAt: "2024-01-01T00:00:00",
  },
  {
    id: 2,
    name: "User EMSI",
    email: "user@emsi.ma",
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
    lastLogin: "2024-01-19T15:45:00",
    createdAt: "2024-01-02T00:00:00",
  },
  {
    id: 3,
    name: "Sarah Ahmed",
    email: "sarah.ahmed@emsi.ma",
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
    lastLogin: "2024-01-18T09:15:00",
    createdAt: "2024-01-03T00:00:00",
  },
  {
    id: 4,
    name: "Mohammed Ali",
    email: "m.ali@emsi.ma",
    role: USER_ROLES.USER,
    status: USER_STATUS.INACTIVE,
    lastLogin: "2024-01-10T14:20:00",
    createdAt: "2024-01-04T00:00:00",
  },
  {
    id: 5,
    name: "Fatima Zahra",
    email: "f.zahra@emsi.ma",
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
    lastLogin: "2024-01-17T11:00:00",
    createdAt: "2024-01-05T00:00:00",
  },
];

// Mock Items
export const mockItems: Item[] = [
  {
    id: 1,
    description: "iPhone 13 Pro noir avec coque bleue",
    location: "Bibliothèque - 2ème étage",
    reportedDate: "2024-01-15",
    status: "lost",
    type: "Lost",
    reportedByUserId: 2,
    category: "electronics",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-family-hero?wid=940&hei=1112&fmt=jpeg&qlt=80&.v=1631220221000",
  },
  {
    id: 2,
    description: "Clé USB SanDisk 32GB",
    location: "Salle 204 - Département Informatique",
    reportedDate: "2024-01-16",
    status: "found",
    type: "Found",
    reportedByUserId: 3,
    category: "electronics",
    imageUrl:
      "https://media.ldlc.com/r1600/ld/products/00/05/82/43/LD0005824321_1.jpg",
  },
  {
    id: 3,
    description: "MacBook Pro 13 pouces",
    location: "Cafétéria",
    reportedDate: "2024-01-17",
    status: "claimed",
    type: "Lost",
    reportedByUserId: 2,
    category: "electronics",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp-spacegray-select-202206_GEO_FR?wid=904&hei=840&fmt=jpeg&qlt=80",
  },
  {
    id: 5,
    description: "AirPods Pro avec étui de charge",
    location: "Salle de sport",
    reportedDate: "2024-01-18",
    status: "lost",
    type: "Lost",
    reportedByUserId: 3,
    category: "electronics",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
  },
  {
    id: 6,
    description: "Calculatrice scientifique",
    location: "Salle 305 - Département Mathématiques",
    reportedDate: "2024-01-19",
    status: "found",
    type: "Found",
    reportedByUserId: 1,
    category: "electronics",
    imageUrl:
      "https://media.ldlc.com/r1600/ld/products/00/05/93/21/LD0005932198_1.jpg",
  },
  {
    id: 9,
    description: "iPad Air Gris Sidéral",
    location: "Salle de conférence",
    reportedDate: "2024-01-22",
    status: "lost",
    type: "Lost",
    reportedByUserId: 2,
    category: "electronics",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-select-wifi-spacegray-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645066742664",
  },
  {
    id: 14,
    description: "Chargeur MacBook Pro 60W",
    location: "Salle 105",
    reportedDate: "2024-01-25",
    status: "found",
    type: "Found",
    reportedByUserId: 3,
    category: "electronics",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MX0K2?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1618619803000",
  },
  {
    id: 16,
    description: "Souris sans fil Logitech MX Master",
    location: "Laboratoire informatique",
    reportedDate: "2024-01-26",
    status: "found",
    type: "Found",
    reportedByUserId: 1,
    category: "electronics",
    imageUrl:
      "https://resource.logitech.com/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png",
  },
];

// Mock Activities
export const mockActivities = [
  {
    id: 1,
    message: "Un iPhone 13 Pro a été signalé comme perdu",
    timestamp: "Il y a 2 heures",
    userId: 2,
    itemId: 1,
  },
  {
    id: 2,
    message: "Une clé USB a été trouvée à la bibliothèque",
    timestamp: "Il y a 3 heures",
    userId: 3,
    itemId: 2,
  },
  {
    id: 3,
    message: "Un MacBook Pro a été réclamé par son propriétaire",
    timestamp: "Il y a 5 heures",
    userId: 2,
    itemId: 3,
  },
  {
    id: 4,
    message: "Une carte étudiant EMSI a été trouvée",
    timestamp: "Il y a 6 heures",
    userId: 1,
    itemId: 4,
  },
  {
    id: 5,
    message: "Des AirPods Pro ont été signalés comme perdus",
    timestamp: "Il y a 8 heures",
    userId: 3,
    itemId: 5,
  },
  {
    id: 6,
    message: "Un nouvel objet a été signalé comme perdu",
    timestamp: "Il y a 12 heures",
    userId: 2,
    itemId: 6,
  },
  {
    id: 7,
    message: "Une calculatrice a été trouvée",
    timestamp: "Il y a 1 jour",
    userId: 1,
    itemId: 7,
  },
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  foundItems: 2,
  lostItems: 3,
  pendingItems: 4,
  totalItems: 9,
  claimedItems: 2,
  returnedItems: 1,
};

// Change from type to export type
export type ItemStatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "found"
  | "lost"
  | "claimed"
  | "returned";

export const ITEM_STATUS: Record<string, ItemStatusType> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  FOUND: "found",
  LOST: "lost",
  CLAIMED: "claimed",
  RETURNED: "returned",
};

// Et pour les types d'items
export const ITEM_TYPE = {
  LOST: "Lost",
  FOUND: "Found",
} as const;

// Ajouter ces interfaces
interface Notification {
  id: number;
  message: string;
  type: "info" | "update" | "match";
  userId: number;
  itemId: number;
  read?: boolean;
  createdAt: string;
}

// Mock Service Functions
export const mockService = {
  login: async (email: string, password: string): Promise<User> => {
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      throw {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: "Identifiants invalides",
      };
    }
    return user;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    if (mockUsers.some((u) => u.email === email)) {
      throw {
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
        message: "Cet email est déjà utilisé",
      };
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: USER_ROLES.USER,
      status: USER_STATUS.ACTIVE,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return newUser;
  },

  getItems: async (): Promise<Item[]> => {
    return mockItems;
  },

  getItemById: async (id: number): Promise<Item | undefined> => {
    return mockItems.find((item) => item.id === id);
  },

  createItem: async (item: Omit<Item, "id">): Promise<Item> => {
    const newItem: Item = {
      ...item,
      id: mockItems.length + 1,
    };
    mockItems.push(newItem);
    return newItem;
  },

  getDashboardStats: async () => {
    return mockDashboardStats;
  },

  getRecentActivities: async () => {
    return mockActivities;
  },

  getUsers: async (): Promise<User[]> => {
    return mockUsers;
  },

  updateUser: async (
    userId: number,
    userData: Partial<User>
  ): Promise<User> => {
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw {
        code: ErrorCode.USER_NOT_FOUND,
        message: "Utilisateur non trouvé",
      };
    }

    const updatedUser: User = {
      ...mockUsers[userIndex],
      ...userData,
      role: userData.role || mockUsers[userIndex].role,
      status: userData.status || mockUsers[userIndex].status,
      lastLogin: mockUsers[userIndex].lastLogin,
    };

    mockUsers[userIndex] = updatedUser;
    return updatedUser;
  },

  deleteUser: async (userId: number): Promise<void> => {
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error("Utilisateur non trouvé");
    if (mockUsers[userIndex].role === "Admin") {
      throw new Error("Impossible de supprimer un administrateur");
    }
    mockUsers.splice(userIndex, 1);
  },

  updateItemStatus: async (
    itemId: number,
    newStatus: ItemStatusType
  ): Promise<Item> => {
    const itemIndex = mockItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    const updatedItem = {
      ...mockItems[itemIndex],
      status: newStatus,
    };

    mockItems[itemIndex] = updatedItem;
    return updatedItem;
  },

  deleteItem: async (itemId: number): Promise<void> => {
    const itemIndex = mockItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }
    mockItems.splice(itemIndex, 1);
  },

  updateItem: async (
    itemId: number,
    itemData: Partial<Item>
  ): Promise<Item> => {
    const itemIndex = mockItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    const updatedItem = {
      ...mockItems[itemIndex],
      ...itemData,
      id: mockItems[itemIndex].id,
      reportedDate: mockItems[itemIndex].reportedDate,
      reportedByUserId: mockItems[itemIndex].reportedByUserId,
    };

    mockItems[itemIndex] = updatedItem;
    return updatedItem;
  },

  searchItems: async (keyword: string): Promise<Item[]> => {
    return mockItems.filter(
      (item) =>
        item.description.toLowerCase().includes(keyword.toLowerCase()) ||
        item.location.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  approveItemOwnership: async (
    itemId: number,
    userId: number
  ): Promise<Item> => {
    const itemIndex = mockItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    const updatedItem: Item = {
      ...mockItems[itemIndex],
      status: "claimed" as const,
      claimedByUserId: userId,
      claimedDate: new Date().toISOString(),
    };

    mockItems[itemIndex] = updatedItem;
    return updatedItem;
  },

  cancelItem: async (itemId: number, userId: number): Promise<void> => {
    const itemIndex = mockItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    if (mockItems[itemIndex].reportedByUserId !== userId) {
      throw new Error("Unauthorized");
    }

    mockItems.splice(itemIndex, 1);
  },

  createNotification: async (
    notificationData: Omit<Notification, "id" | "createdAt" | "read">
  ) => {
    const notification: Notification = {
      id: Date.now(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
    };
    return notification;
  },
};
