// services/review.service.ts
import { apiRequest } from "./api-client";
import type { Review, CreateReviewPayload } from "@/lib/api-types";

export const reviewService = {
  getReviewsByRequestId: (requestId: string) =>
    apiRequest<Review[]>(`/reviews/request/${requestId}`, { requiresAuth: false }),

  getReviewsByUserId: (userId: string) =>
    apiRequest<Review[]>(`/reviews/user/${userId}`, { requiresAuth: false }),

  getRecentReviews: (limit?: number) =>
    apiRequest<Review[]>(`/reviews/recent?limit=${limit || 6}`, { requiresAuth: false }),

  getUserReviewStats: (userId: string) =>
    apiRequest<{ avgRating: number; totalReviews: number }>(
      `/reviews/user/${userId}/stats`,
      { requiresAuth: false }
    ),

  getAllReviews: () =>
    apiRequest<Review[]>(`/reviews/all`, { requiresAuth: false }),

  hasUserReviewed: (requestId: string) =>
    apiRequest<{ hasReviewed: boolean; reviewId: string | null }>(
      `/reviews/request/${requestId}/check`,
      { requiresAuth: true }
    ),

  createReview: (payload: CreateReviewPayload) =>
    apiRequest<Review>(`/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
};