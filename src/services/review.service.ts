import { apiRequest } from "./api-client";
import type { Review, CreateReviewPayload } from "@/lib/api-types";

export const reviewService = {
  getReviewsByRequestId: (requestId: string) =>
    apiRequest<Review[]>(`/reviews/request/${requestId}`),

  createReview: (payload: CreateReviewPayload) =>
    apiRequest<Review>(`/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};