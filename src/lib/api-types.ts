
export type RequestStatus =
  | "open"
  | "matched"
  | "in_progress"
  | "completed"
  | "cancelled";

export type RequestCategory =
  | "tech"
  | "tutoring"
  | "errand"
  | "moving"
  | "repair"
  | "other";

export interface UserSummary {
  _id: string;
  name: string;
  image?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
}

export interface HelpRequest {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: RequestCategory;
  location: { type: "Point"; coordinates: [number, number] };
  areaLabel: string;
  budget?: number;
  isPaid: boolean;
  preferredTime?: string;
  imageUrl?: string;
  status: RequestStatus;
  postedBy: string | UserSummary;
  helper?: string | UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  request: string | Pick<HelpRequest, "_id" | "title" | "category">;
  reviewer: string | UserSummary;
  reviewee: string | UserSummary;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  area?: string;
  avgRating: number;
  completedCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedHelpRequests {
  items: HelpRequest[];
  pagination: Pagination;
}

// ---- Request payload types ----

export interface CreateHelpRequestPayload {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: RequestCategory;
  areaLabel: string;
  coordinates: [number, number];
  budget?: number;
  isPaid?: boolean;
  preferredTime?: string;
  imageUrl?: string;
}

export interface GetHelpRequestsParams {
  search?: string;
  category?: RequestCategory;
  area?: string;
  status?: RequestStatus;
  sort?: "newest" | "oldest" | "urgent";
  page?: number;
  limit?: number;
}

export interface CreateReviewPayload {
  requestId: string;
  rating: number;
  comment?: string;
}

// ---- Generic API error shape returned by the backend ----
export interface ApiErrorBody {
  message: string;
  error?: string;
}