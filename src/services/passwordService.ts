import api from "./api";

const passwordService = {
  forgotPassword: async (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return api.post("/auth/reset-password", { token, newPassword });
  },
};

export default passwordService;
