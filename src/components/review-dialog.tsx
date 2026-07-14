"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { reviewService } from "@/services/review.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  revieweeId: string;
  onSuccess?: () => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  requestId,
  revieweeId,
  onSuccess,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ comment: string }>();

  const onSubmit = async (data: { comment: string }) => {
    if (rating === 0) return toast.error("Please select a rating");

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        requestId: requestId,
        rating: rating,
        comment: data.comment,
      });
      toast.success("Review submitted successfully!");
      reset();
      setRating(0);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border border-zinc-900">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2 justify-center py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-colors ${rating >= star ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            {...register("comment")}
            placeholder="Share your feedback..."
            className="bg-zinc-900 border-zinc-800"
          />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
