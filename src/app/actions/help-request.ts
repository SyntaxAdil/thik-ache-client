"use server";

import { helpRequestService } from "@/services/help-request.service";
import { revalidatePath } from "next/cache";

export type RequestCategory = 
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "painting"
  | "cleaning"
  | "tech_support"
  | "web_dev"
  | "graphics_design"
  | "data_entry"
  | "delivery"
  | "grocery_shopping"
  | "moving_help"
  | "tutoring"
  | "language_translation"
  | "pet_care"
  | "medical_escort"
  | "fitness_coaching"
  | "other";

interface CreateHelpRequestPayload {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: RequestCategory;
  areaLabel: string;
  coordinates: [number, number];
  budget?: number;
  isPaid: boolean;
  preferredTime?: string;
  imageUrl?: string;
}

export async function createHelpRequestAction(payload: CreateHelpRequestPayload) {
  try {
    const response = await helpRequestService.createHelpRequest(payload);
    revalidatePath("/dashboard/requests");
    return { success: true, data: response };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, error: errorMessage };
  }
}

export async function deleteHelpRequestAction(id: string) {
  try {
    const response = await helpRequestService.deleteHelpRequest(id);
    revalidatePath("/my-requests");
    return { success: true, data: response };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, error: errorMessage };
  }
}