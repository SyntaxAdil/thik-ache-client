// services/user.service.ts
import { apiRequest } from "./api-client";
import type { UserProfile } from "@/lib/api-types";

export const userService = {
  getUserProfile: (id: string) => apiRequest<UserProfile>(`/users/${id}`),

  getMyActivity: () =>
    apiRequest<Record<string, unknown>>(`/users/me/activity`),

  getAllUsers: () =>
    apiRequest<UserProfile[]>(`/users`, { requiresAuth: false }),

  deleteUser: (id: string) =>
    apiRequest<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),

  updateUserRole: (id: string, role: "user" | "admin") =>
    apiRequest<UserProfile>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
      requiresAuth: true,
    }),
};