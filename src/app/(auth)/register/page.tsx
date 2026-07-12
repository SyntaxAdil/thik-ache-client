import React from "react";
import { Metadata } from "next";

import RegisterForm from "./RegisterForm";
import Logo from "../../../components/shared/logo/logo";
import ShaderBackground from "../../../components/pages/home/ShaderBackground";

export const metadata: Metadata = {
  title: "Create Account | ThikAche",
  description:
    "Join ThikAche to post help requests, offer help to your neighbors, and build trust in your community.",
};

export default function RegisterPage() {
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
            Join ThikAche
          </h1>
          <p className="text-muted-foreground text-sm">
            Start helping your neighbors, or get help when you need it
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}