import React from "react";
import { Metadata } from "next";

import LoginForm from "./LoginForm";
import Logo from "../../../components/shared/logo/logo";

export const metadata: Metadata = {
  title: "Log In | ThikAche",
  description:
    "Log in to your ThikAche account to post requests, help your neighbors, and manage your activity.",
};

export default function LogInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md w-full bg-card border border-border shadow-xl rounded-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <Logo width={40} height={40}></Logo>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Log in to continue helping your neighborhood
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}