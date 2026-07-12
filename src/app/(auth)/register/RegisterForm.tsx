"use client";

import React, { useState, useRef } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Camera, Loader2, X } from "lucide-react";
import { signUp, signIn } from "../../../lib/auth/auth-client";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "../../../components/ui/field";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { DHAKA_AREAS } from "../../../assets/dhaka-top-areas";
import FaGoogle from "../../../components/ui/FaGoogle";
import Image from "next/image";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  area: string;
  terms: boolean;
}

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

async function uploadToImgbb(file: File): Promise<string> {
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

  if (!result.success) {
    throw new Error("Image upload failed");
  }

  return result.data.url as string;
}

export default function RegisterForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      area: DHAKA_AREAS[0],
      terms: false,
    },
  });

  const password = watch("password");
  const strength = getPasswordStrength(password || "");

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setIsUploadingImage(true);

    try {
      const uploadedUrl = await uploadToImgbb(file);
      setImageUrl(uploadedUrl);
      toast.success("Profile photo uploaded");
    } catch (error) {
      toast.error("Failed to upload profile photo");
      setImagePreview(null);
      console.error(error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!data.terms) {
      toast.error("Please accept the Terms & Privacy Policy");
      return;
    }

    try {
      const { error } = await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          image: imageUrl || undefined,
          // @ts-expect-error — area is a valid additionalField on the server but not yet inferred client-side
          area: data.area,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success("Account created successfully");
            router.push("/");
          },
        },
      );
      if (error) {
        toast.error(error.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error!");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google sign in failed!");
      console.error(error);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col items-center gap-2 mb-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full border-2 border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden hover:border-primary transition-colors"
          >
            {imagePreview ? (
              <Image
                width={100}
                height={100}
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-6 h-6 text-muted-foreground" />
            )}
            {isUploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </button>
          {imagePreview && !isUploadingImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remove photo"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <span className="text-xs text-muted-foreground">
          Upload profile photo (optional)
        </span>
      </div>

      <Field>
        <FieldLabel className="text-xs font-semibold text-foreground/80 mb-1.5">
          Full Name
        </FieldLabel>
        <Input
          type="text"
          placeholder="Adil Rahman"
          data-invalid={!!errors.name}
          className="w-full h-10 border-input bg-background focus:border-primary focus:ring-ring/20 rounded-lg transition-colors placeholder:text-muted-foreground/50 data-[invalid=true]:border-destructive data-[invalid=true]:focus:ring-destructive/20"
          {...register("name", { required: "Full name is required" })}
        />
        {errors.name && (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.name.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel className="text-xs font-semibold text-foreground/80 mb-1.5">
          Email Address
        </FieldLabel>
        <Input
          type="email"
          placeholder="adil@example.com"
          data-invalid={!!errors.email}
          className="w-full h-10 border-input bg-background focus:border-primary focus:ring-ring/20 rounded-lg transition-colors placeholder:text-muted-foreground/50 data-[invalid=true]:border-destructive data-[invalid=true]:focus:ring-destructive/20"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.email.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel className="text-xs font-semibold text-foreground/80 mb-1.5">
          Password
        </FieldLabel>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="********"
            data-invalid={!!errors.password}
            className="w-full h-10 pr-10 border-input bg-background focus:border-primary focus:ring-ring/20 rounded-lg transition-colors placeholder:text-muted-foreground/50 data-[invalid=true]:border-destructive data-[invalid=true]:focus:ring-destructive/20"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                idx < strength
                  ? strength <= 1
                    ? "bg-red-500"
                    : strength <= 2
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
        {errors.password && (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.password.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel className="text-xs font-semibold text-foreground/80 mb-1.5">
          Confirm Password
        </FieldLabel>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            data-invalid={!!errors.confirmPassword}
            className="w-full h-10 pr-10 border-input bg-background focus:border-primary focus:ring-ring/20 rounded-lg transition-colors placeholder:text-muted-foreground/50 data-[invalid=true]:border-destructive data-[invalid=true]:focus:ring-destructive/20"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.confirmPassword.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel className="text-xs font-semibold text-foreground/80 mb-1.5">
          Area / Location
        </FieldLabel>
        <Controller
          name="area"
          control={control}
          rules={{ required: "Please select your area" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-10 border-input bg-background rounded-lg text-sm">
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {DHAKA_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.area && (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.area.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <div className="flex items-start gap-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <FieldDescription className="text-xs text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <strong className="text-primary hover:underline">
              Terms of Service
            </strong>{" "}
            and{" "}
            <strong className="text-primary hover:underline">
              Privacy Policy
            </strong>
          </FieldDescription>
        </div>
      </Field>

      <div className="flex flex-col gap-4 mt-2 items-center w-full">
        <Button
          type="submit"
          disabled={isSubmitting || isUploadingImage}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-lg font-medium shadow-sm transition-colors"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="flex items-center my-1 w-full">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-muted-foreground bg-card">OR</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full h-11 rounded-lg border border-input bg-background hover:bg-muted text-foreground flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <FaGoogle></FaGoogle>
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <p>Already have an account? </p>
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </motion.form>
  );
}