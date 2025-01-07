import { io } from "socket.io-client";
import { useNotifications } from "../contexts/NotificationsContext";

interface ItemNotification {
  type: string;
  description: string;
}

export const initializeWebSocket = (userId: string) => {
  const socket = io("ws://your-server-url");
  const { addNotification } = useNotifications();

  socket.on("connect", () => {
    console.log("Connected to WebSocket");
    socket.emit("register", { userId });
  });

  socket.on("newItem", (data: ItemNotification) => {
    addNotification(`Nouvel objet ${data.type}: ${data.description}`);
  });

  socket.on("itemClaimed", (data: ItemNotification) => {
    addNotification(`L'objet "${data.description}" a été réclamé`);
  });

  return socket;
};
