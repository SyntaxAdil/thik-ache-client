// services/help-request.service.ts
import type {
  HelpRequest,
  PaginatedHelpRequests,
  CreateHelpRequestPayload,
  GetHelpRequestsParams,
} from "@/lib/api-types";
import { apiRequest } from "./api-client";

export const helpRequestService = {
  getHelpRequests: (params: GetHelpRequestsParams = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, String(value));
      }
    });
    return apiRequest<PaginatedHelpRequests>(
      `/requests?${queryParams.toString()}`,
      { requiresAuth: false }
    );
  },

  getHelpRequestById: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}`, { requiresAuth: false }),

  getRelatedHelpRequests: (id: string) =>
    apiRequest<HelpRequest[]>(`/requests/${id}/related`, { requiresAuth: false }),

  getMyPostedRequests: () =>
    apiRequest<HelpRequest[]>(`/requests/mine/posted`, { requiresAuth: true }),

  getMyHelpingRequests: () =>
    apiRequest<HelpRequest[]>(`/requests/mine/helping`, { requiresAuth: true }),

  createHelpRequest: (payload: CreateHelpRequestPayload) =>
    apiRequest<HelpRequest>(`/requests`, {
      method: "POST",
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),

  acceptHelpRequest: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/accept`, { 
      method: "PATCH",
      requiresAuth: true,
    }),

  markInProgress: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/in-progress`, { 
      method: "PATCH",
      requiresAuth: true,
    }),

  markComplete: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/complete`, { 
      method: "PATCH",
      requiresAuth: true,
    }),

  cancelHelpRequest: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/cancel`, { 
      method: "PATCH",
      requiresAuth: true,
    }),

  deleteHelpRequest: (id: string) =>
    apiRequest<{ message: string }>(`/requests/${id}`, { 
      method: "DELETE",
      requiresAuth: true,
    }),
};