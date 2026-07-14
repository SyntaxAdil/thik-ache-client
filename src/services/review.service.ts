import { apiRequest } from "./api-client";
import type { Review, CreateReviewPayload } from "@/lib/api-types";

export const reviewService = {
  getReviewsForUser: (userId: string) =>
    apiRequest<Review[]>(`/reviews/user/${userId}`),

  createReview: (payload: CreateReviewPayload) =>
    apiRequest<Review>(`/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};