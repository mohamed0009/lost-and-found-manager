import { Item } from "../types";

export interface ItemValidationError {
  field: string;
  message: string;
}

export const validateItem = (item: Partial<Item>): ItemValidationError[] => {
  const errors: ItemValidationError[] = [];

  if (!item.description?.trim()) {
    errors.push({
      field: "description",
      message: "La description est requise",
    });
  }

  if (!item.location?.trim()) {
    errors.push({
      field: "location",
      message: "Le lieu est requis",
    });
  }

  if (!item.type) {
    errors.push({
      field: "type",
      message: "Le type est requis",
    });
  }

  if (!item.category) {
    errors.push({
      field: "category",
      message: "La catégorie est requise",
    });
  }

  return errors;
};
