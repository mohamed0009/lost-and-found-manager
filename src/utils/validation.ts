import { User, ValidationError } from "../types";

export const validateUser = (userData: Partial<User>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (userData.email && !userData.email.includes("@")) {
    errors.push({ field: "email", message: "Email invalide" });
  }

  if (userData.password && userData.password.length < 6) {
    errors.push({ field: "password", message: "Mot de passe trop court" });
  }

  return errors;
};
