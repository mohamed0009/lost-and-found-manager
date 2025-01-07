import api from "./api";

export const contactService = {
  sendMessage: (data: {
    itemId: number;
    message: string;
    recipientId: number;
  }) => api.post("/contact/send", data),

  getMessages: () => api.get("/contact/messages"),
};
