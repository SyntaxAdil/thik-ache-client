
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
      `/requests?${queryParams.toString()}`
    );
  },

  getHelpRequestById: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}`),

  getRelatedHelpRequests: (id: string) =>
    apiRequest<HelpRequest[]>(`/requests/${id}/related`),

  getMyPostedRequests: () =>
    apiRequest<HelpRequest[]>(`/requests/mine/posted`),

  getMyHelpingRequests: () =>
    apiRequest<HelpRequest[]>(`/requests/mine/helping`),

  createHelpRequest: (payload: CreateHelpRequestPayload) =>
    apiRequest<HelpRequest>(`/requests`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  acceptHelpRequest: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/accept`, { method: "PATCH" }),

  markInProgress: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/in-progress`, { method: "PATCH" }),

  markComplete: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/complete`, { method: "PATCH" }),

  cancelHelpRequest: (id: string) =>
    apiRequest<HelpRequest>(`/requests/${id}/cancel`, { method: "PATCH" }),

  deleteHelpRequest: (id: string) =>
    apiRequest<{ message: string }>(`/requests/${id}`, { method: "DELETE" }),
};