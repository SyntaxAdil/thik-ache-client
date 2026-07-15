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
  const [hoverRating, setHoverRating] = useState(0);
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
      toast.success("Feedback recorded successfully");
      reset();
      setRating(0);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white text-center">
            Rate your experience
          </DialogTitle>
          <p className="text-xs text-zinc-500 text-center font-medium">
            Your feedback helps build trust in the neighborhood.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="flex gap-1 justify-center py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-9 w-9 cursor-pointer transition-all duration-200 ${
                  (hoverRating || rating) >= star 
                    ? "fill-indigo-500 text-indigo-500 scale-110" 
                    : "text-zinc-700 hover:text-zinc-500"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          <Textarea
            {...register("comment")}
            placeholder="How was your interaction? (Optional)"
            className="min-h-[100px] bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl placeholder:text-zinc-600 resize-none transition-all"
          />

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-transform active:scale-[0.98]"
          >
            {isSubmitting ? "Processing..." : "Submit Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}