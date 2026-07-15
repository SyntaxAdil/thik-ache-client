// src/app/actions/help-request.ts
"use server";

import { helpRequestService } from "@/services/help-request.service";
import { revalidatePath } from "next/cache";
import type { CreateHelpRequestPayload } from "@/lib/api-types";

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