// components/dashboard/profile/profile-client.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  X,
  Check,
  Loader2,
  Upload,
  Shield,
  Calendar,
  Star,
  Briefcase,
  Award,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  phoneNumber?: string;
  district?: string;
  upazila?: string;
  bloodGroup?: string;
  createdAt?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
}

interface ProfileFormData {
  name: string;
  phoneNumber: string;
}

interface ProfileClientProps {
  user: UserProfile;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(user.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  useEffect(() => {
    reset({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    });
    setTimeout(() => setImagePreview(user.image || ""), 0);
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    }
    throw new Error("Failed to upload image");
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);

      let imageUrl = user.image || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const updateData: Record<string, unknown> = {
        name: data.name,
        image: imageUrl,
      };

      if (data.phoneNumber) {
        updateData.phoneNumber = data.phoneNumber;
      }

      const { error } = await authClient.updateUser(updateData);

      if (error) {
        toast.error(error.message || "Failed to update profile");
        setIsSubmitting(false);
        return;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setIsSubmitting(false);
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    });
    setImagePreview(user.image || "");
    setImageFile(null);
    setIsEditing(false);
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    {
      label: "Rating",
      value: user.avgRating?.toFixed(1) || "0.0",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Tasks Completed",
      value: user.completedCount || 0,
      icon: Check,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      icon: Calendar,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Location",
      value: user.area || user.district || "Not specified",
      icon: MapPin,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="bg-zinc-950/60 border-zinc-900 overflow-hidden sticky top-24">
                <div className="h-24 bg-gradient-to-br from-red-600/30 via-red-500/20 to-rose-500/30" />
                <div className="relative -mt-12 px-6">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <Avatar className="h-28 w-28 border-4 border-zinc-950 shadow-2xl ring-2 ring-red-500/20">
                        <AvatarImage src={imagePreview || user.image} />
                        <AvatarFallback className="bg-zinc-800 text-3xl font-bold text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      {isEditing && (
                        <label className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all">
                          <div className="flex flex-col items-center gap-0.5 text-white">
                            <Upload className="h-4 w-4" />
                            <span className="text-[8px] font-semibold">Change</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <h2 className="text-xl font-bold text-white">{user.name}</h2>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs font-medium">
                          {user.role || "User"}
                        </Badge>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-800 text-xs">
                          {user.id?.slice(-6) || "N/A"}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 mt-2">{user.email}</p>
                    </div>

                    <div className="w-full mt-6 space-y-3">
                      {stats.map((stat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-900/50 hover:border-zinc-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                              <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-medium text-zinc-500">
                              {stat.label}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {stat.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="w-full mt-6 pt-4 border-t border-zinc-900/50 flex flex-col gap-2">
                      <Button
                        variant={isEditing ? "secondary" : "primary"}
                        onClick={() => {
                          if (isEditing) {
                            handleCancel();
                          } else {
                            setIsEditing(true);
                          }
                        }}
                        className="w-full"
                      >
                        {isEditing ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>

                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <Button
                            type="submit"
                            form="profile-form"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="bg-zinc-950/60 border-zinc-900">
                <CardHeader className="pb-4 border-b border-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                      <User className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Personal Information</h3>
                      <p className="text-sm text-zinc-500">Manage your personal details</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-xs font-semibold text-zinc-500 flex items-center gap-2"
                        >
                          <User className="h-3.5 w-3.5" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          disabled={!isEditing}
                          placeholder="Your full name"
                          className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 disabled:opacity-70 focus:border-red-500/50 focus:ring-red-500/20"
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-xs font-semibold text-zinc-500 flex items-center gap-2"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={user.email || ""}
                          disabled
                          className="bg-zinc-900/30 border-zinc-800 text-zinc-500 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-zinc-600">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phoneNumber"
                          className="text-xs font-semibold text-zinc-500 flex items-center gap-2"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          {...register("phoneNumber", {
                            pattern: {
                              value: /^[0-9+\-\s()]*$/,
                              message: "Invalid phone number format",
                            },
                          })}
                          disabled={!isEditing}
                          placeholder="+880 1234567890"
                          className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 disabled:opacity-70 focus:border-red-500/50 focus:ring-red-500/20"
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-xs font-semibold text-zinc-500 flex items-center gap-2"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={user.area || user.district || "Not specified"}
                          disabled
                          className="bg-zinc-900/30 border-zinc-800 text-zinc-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Activity Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                <Card className="bg-zinc-950/60 border-zinc-900">
                  <CardHeader className="pb-4 border-b border-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Activity Overview</h3>
                        <p className="text-sm text-zinc-500">Your contribution summary</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/50 text-center">
                        <p className="text-2xl font-bold text-amber-400">
                          {user.avgRating?.toFixed(1) || "0.0"}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Average Rating</p>
                        <div className="flex items-center justify-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(user.avgRating || 0)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-zinc-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/50 text-center">
                        <p className="text-2xl font-bold text-emerald-400">
                          {user.completedCount || 0}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Tasks Completed</p>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/50 text-center">
                        <p className="text-2xl font-bold text-blue-400">
                          {user.role || "User"}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Role</p>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/50 text-center">
                        <p className="text-2xl font-bold text-indigo-400">
                          {user.area || "N/A"}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Area</p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-zinc-900/20 border border-zinc-900/30">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Shield className="h-3.5 w-3.5" />
                        <span>Member since {formatDate(user.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <span>ID: {user.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}