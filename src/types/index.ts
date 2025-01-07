export type ItemCategory =
  | "electronics"
  | "documents"
  | "accessories"
  | "clothing"
  | "other";

export interface Item {
  id: number;
  description: string;
  location: string;
  reportedDate: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "found"
    | "lost"
    | "claimed"
    | "returned";
  type: "Lost" | "Found";
  category: string;
  imageUrl?: string;
  reportedByUserId: number;
  reportedByUser?: {
    id: number;
    name: string;
    email: string;
  };
  claimedByUserId?: number;
  claimedDate?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
  password?: string;
}

export enum ErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  ADMIN_DELETE_FORBIDDEN = "ADMIN_DELETE_FORBIDDEN",
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
