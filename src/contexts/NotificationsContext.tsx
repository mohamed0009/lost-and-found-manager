import React, { createContext, useContext, useState } from 'react';
import { mockUsers } from '../services/mockData';
import { Item } from '../types';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: Date;
  timestamp: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string) => void;
  addItemNotification: (item: Item) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Données de test pour les notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Un nouvel objet a été trouvé qui correspond à votre recherche",
    read: false,
    createdAt: new Date('2024-01-20T10:30:00'),
    timestamp: '20/01/2024 10:30',
    type: 'info',
    title: 'Nouvel objet trouvé'
  },
  {
    id: 2,
    message: `${mockUsers[1].name} a signalé avoir trouvé votre iPhone`,
    read: true,
    createdAt: new Date('2024-01-19T15:45:00'),
    timestamp: '19/01/2024 15:45',
    type: 'success',
    title: 'Objet retrouvé'
  },
  {
    id: 3,
    message: "Votre déclaration d'objet perdu a été validée",
    read: false,
    createdAt: new Date('2024-01-18T09:15:00'),
    timestamp: '18/01/2024 09:15',
    type: 'success',
    title: 'Déclaration validée'
  },
  {
    id: 4,
    message: "Un administrateur a modifié le statut de votre déclaration",
    read: false,
    createdAt: new Date('2024-01-17T14:20:00'),
    timestamp: '17/01/2024 14:20',
    type: 'warning',
    title: 'Modification de statut'
  },
  {
    id: 5,
    message: "Rappel : Vous avez un objet à récupérer à l'accueil",
    read: true,
    createdAt: new Date('2024-01-16T11:00:00'),
    timestamp: '16/01/2024 11:00',
    type: 'info',
    title: 'Rappel'
  }
];

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  // Initialiser avec les données de test
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      read: false,
      createdAt: new Date(),
      timestamp: new Date().toLocaleString(),
      type: 'info',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addItemNotification = (item: Item) => {
    const newNotification: Notification = {
      id: Date.now(),
      message: `Nouvel objet ${item.type === 'Lost' ? 'perdu' : 'trouvé'} : ${item.description}`,
      read: false,
      createdAt: new Date(),
      timestamp: new Date().toLocaleString(),
      type: 'info',
    };
    addNotification(newNotification.message);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        addItemNotification,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
} 