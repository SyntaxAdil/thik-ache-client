import React from "react";
import { Metadata } from "next";

import LoginForm from "./LoginForm";
import Logo from "../../../components/shared/logo/logo";
import ShaderBackground from "../../../components/pages/home/ShaderBackground";

export const metadata: Metadata = {
  title: "Log In | ThikAche",
  description:
    "Log in to your ThikAche account to post requests, help your neighbors, and manage your activity.",
};

export default function LogInPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center p-4">
      <ShaderBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />

      <div className="relative z-10 max-w-md w-full bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 md:p-8">
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