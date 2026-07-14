"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "../../../lib/auth/auth-client";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "../../../components/ui/field";
import FaGoogle from "../../../components/ui/FaGoogle";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const { error } = await signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success("Login Successful");
            reset();
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

  const handleDemoLogin = async (role: "user" | "admin") => {
  const credentials = {
    email: role === "admin" ? "admin@thikache.com" : "demo@thikache.app",
    password: role === "admin" ? "admin@001" : "Demo@1234",
  };

  setValue("email", credentials.email);
  setValue("password", credentials.password);

  try {
    const { error } = await signIn.email(
      {
        email: credentials.email,
        password: credentials.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success(`Logged in as demo ${role}`);
          router.push("/");
        },
      }
    );
    if (error) {
      toast.error(error.message || "Demo login failed");
    }
  } catch (error) {
    toast.error("Internal Server Error!");
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
        {errors.email ? (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.email.message}
          </FieldError>
        ) : (
          <FieldDescription className="text-muted-foreground/60 text-xs mt-1">
            We will never share your email.
          </FieldDescription>
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
        {errors.password && (
          <FieldError className="text-destructive text-xs mt-1">
            {errors.password.message}
          </FieldError>
        )}
      </Field>

      <div className="flex flex-col gap-4 mt-2 items-center w-full">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-lg font-medium shadow-sm transition-colors"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
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

        <div className="flex items-center my-1 w-full">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-muted-foreground bg-card">
            TRY INSTANTLY
          </span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <div className=" flex gap-2 w-full">
          <Button
            type="button"
            onClick={() => handleDemoLogin("user")}
            variant="outline"
            className="w-1/2 h-10 rounded-lg border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs font-medium transition-colors"
          >
            Demo Login as User
          </Button>
          <Button
            type="button"
            onClick={() => handleDemoLogin("admin")}
            variant="outline"
            className="w-1/2 h-10 rounded-lg border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs font-medium transition-colors"
          >
            Demo Login as Admin
          </Button>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <p>Don&apos;t have an account? </p>
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Sign up on ThikAche
          </Link>
        </div>
      </div>
    </motion.form>
  );
}
