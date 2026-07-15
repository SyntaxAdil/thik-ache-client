// components/forms/help-request-form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Upload, X, MapPin, Info } from "lucide-react";
import { toast } from "sonner";
import { createHelpRequestAction } from "@/app/actions/help-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DHAKA_AREAS, DhakaArea } from "../../../../assets/dhaka-top-areas";
import { CATEGORIES } from "../../explore/explore-filters";
import { useSession } from "../../../../lib/auth/auth-client";

type RequestCategory =
  | "tech"
  | "tutoring"
  | "errand"
  | "moving"
  | "repair"
  | "other";

interface FormValues {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: RequestCategory;
  areaLabel: DhakaArea;
  latitude: string;
  longitude: string;
  isPaid: boolean;
  budget: string;
  preferredTime: string;
}
interface UserWithPhone {
  id: string;
  name: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  role?: string;
}

export function HelpRequestForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isLocating, setIsLocating] = useState(false);
const {data:session} = useSession();
  const user = session?.user as UserWithPhone | undefined;




  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      category: "tech",
      areaLabel: "Mirpur",
      latitude: "23.8103",
      longitude: "90.4125",
      isPaid: false,
      budget: "",
      preferredTime: "",
    },
  });

  const watchIsPaid = watch("isPaid");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key is missing in environment variables.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (result.success) {
        setImageUrl(result.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image to ImgBB.");
      }
    } catch {
      toast.error("An error occurred during image upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude.toString());
        setValue("longitude", position.coords.longitude.toString());
        toast.success("We've successfully pinned your current location!");
        setIsLocating(false);
      },
      (error) => {
        let message = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission denied. Please enable location access in your browser.";
        }
        toast.error(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (!user?.phoneNumber || user.phoneNumber.trim() === "") {
      toast.error(
        "Please add your phone number to your profile before posting a request",
      );
      setIsPending(false);
      return;
    }

    setIsPending(true);

    try {
      const payload = {
        title: data.title.trim(),
        shortDescription: data.shortDescription.trim(),
        fullDescription: data.fullDescription.trim(),
        category: data.category,
        areaLabel: data.areaLabel,
        coordinates: [
          parseFloat(data.longitude) || 90.4125,
          parseFloat(data.latitude) || 23.8103,
        ] as [number, number],
        budget: data.isPaid ? parseFloat(data.budget) || 0 : undefined,
        isPaid: data.isPaid,
        preferredTime: data.preferredTime || undefined,
        imageUrl: imageUrl || undefined,
      };

      const result = await createHelpRequestAction(payload);

      if (result.success) {
        toast.success("Help request created successfully.");
        router.push("/dashboard/requests");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create request");
        setIsPending(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-6 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-xl"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title" className="text-zinc-300">
            Title
          </Label>
          {errors.title && (
            <span className="text-xs text-rose-500">
              {errors.title.message}
            </span>
          )}
        </div>
        <Input
          id="title"
          {...register("title", {
            required: "Title is required",
            minLength: { value: 10, message: "Must be at least 10 characters" },
            maxLength: { value: 120, message: "Cannot exceed 120 characters" },
          })}
          placeholder="e.g., Need help setting up an internet router"
          className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="shortDescription" className="text-zinc-300">
            Short Description
          </Label>
          {errors.shortDescription && (
            <span className="text-xs text-rose-500">
              {errors.shortDescription.message}
            </span>
          )}
        </div>
        <Input
          id="shortDescription"
          {...register("shortDescription", {
            required: "Short description is required",
            minLength: { value: 20, message: "Must be at least 20 characters" },
            maxLength: { value: 200, message: "Cannot exceed 200 characters" },
          })}
          placeholder="Brief summary of your issue"
          className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="fullDescription" className="text-zinc-300">
            Full Details
          </Label>
          {errors.fullDescription && (
            <span className="text-xs text-rose-500">
              {errors.fullDescription.message}
            </span>
          )}
        </div>
        <Textarea
          id="fullDescription"
          {...register("fullDescription", {
            required: "Full details are required",
            minLength: { value: 50, message: "Must be at least 50 characters" },
          })}
          placeholder="Explain the problem and requirements thoroughly..."
          rows={4}
          className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500 resize-none rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-zinc-300">
            Category
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="category"
                  className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500 rounded-xl"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl max-h-60">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaLabel" className="text-zinc-300">
            Select Area (Dhaka)
          </Label>
          <Controller
            name="areaLabel"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="areaLabel"
                  className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500 rounded-xl"
                >
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl max-h-60">
                  {DHAKA_AREAS.map((area: DhakaArea) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl space-y-4">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-zinc-200">
              Set Exact Location Coordinates
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              We need your exact coordinates to match you with helpers near you.
              Clicking the button below will automatically and securely set your
              current position.
            </p>
          </div>
        </div>

        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={getUserLocation}
            disabled={isLocating}
            className="h-10 text-xs px-4 rounded-xl flex items-center gap-2 border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800/80 cursor-pointer"
          >
            {isLocating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            ) : (
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            )}
            {isLocating
              ? "Locating your position..."
              : "Use My Current Location"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500">Latitude</span>
            <Input
              id="latitude"
              type="number"
              step="any"
              disabled
              {...register("latitude")}
              className="bg-zinc-950/40 border-zinc-900 text-zinc-500 cursor-not-allowed rounded-xl h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-500">Longitude</span>
            <Input
              id="longitude"
              type="number"
              step="any"
              disabled
              {...register("longitude")}
              className="bg-zinc-950/40 border-zinc-900 text-zinc-500 cursor-not-allowed rounded-xl h-9 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="preferredTime" className="text-zinc-300">
            Preferred Time (Optional)
          </Label>
          <Input
            id="preferredTime"
            type="datetime-local"
            {...register("preferredTime")}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500 [color-scheme:dark] rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300">Upload Image (Optional)</Label>
          <div className="relative">
            {imageUrl ? (
              <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden p-2 flex flex-col gap-2">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-800/80 bg-zinc-950">
                  <img
                    src={imageUrl}
                    alt="Uploaded preview"
                    className="h-full w-full object-cover object-center"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-90 hover:opacity-100 shadow-md cursor-pointer"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] text-zinc-500 truncate max-w-[80%]">
                    {imageUrl}
                  </span>
                </div>
              </div>
            ) : (
              <Label
                htmlFor="image-upload"
                className={`flex items-center justify-center gap-2 h-11 w-full rounded-xl border border-dashed border-zinc-800 bg-zinc-900 hover:bg-zinc-900/60 cursor-pointer text-sm text-zinc-400 transition-all ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                ) : (
                  <Upload className="h-4 w-4 text-zinc-500" />
                )}
                {isUploading ? "Uploading..." : "Choose Image File"}
              </Label>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading || isPending}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 border border-zinc-900 bg-zinc-900/20 rounded-xl">
        <div className="flex flex-row items-center justify-between rounded-lg p-1">
          <div className="space-y-0.5">
            <Label
              htmlFor="isPaid"
              className="text-sm font-semibold text-zinc-300 block"
            >
              Paid Task
            </Label>
            <span className="text-xs text-zinc-500 block">
              Toggle if you want to offer money for this help request.
            </span>
          </div>
          <Controller
            name="isPaid"
            control={control}
            render={({ field }) => (
              <Switch
                id="isPaid"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-zinc-800"
              />
            )}
          />
        </div>

        {watchIsPaid && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget" className="text-zinc-300">
                Budget Amount (BDT)
              </Label>
              {errors.budget && (
                <span className="text-xs text-rose-500">
                  {errors.budget.message}
                </span>
              )}
            </div>
            <Input
              id="budget"
              type="number"
              {...register("budget", {
                required: watchIsPaid
                  ? "Budget is required for paid tasks"
                  : false,
                validate: (val) =>
                  !watchIsPaid ||
                  parseFloat(val) > 0 ||
                  "Budget must be greater than 0",
              })}
              placeholder="৳"
              className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-indigo-500 rounded-xl"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending || isUploading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl h-11 transition-all cursor-pointer"
      >
        {isPending ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Creating Request...
          </span>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}
