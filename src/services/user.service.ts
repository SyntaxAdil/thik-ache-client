import { apiRequest } from "./api-client";
import type { UserProfile } from "@/lib/api-types";

export const userService = {
  getUserProfile: (id: string) => apiRequest<UserProfile>(`/users/${id}`),

  getMyActivity: () =>
    apiRequest<Record<string, unknown>>(`/users/me/activity`),
};
