import React from "react";
import { Metadata } from "next";

import RegisterForm from "./RegisterForm";
import Logo from "../../../components/shared/logo/logo";

export const metadata: Metadata = {
  title: "Create Account | ThikAche",
  description:
    "Join ThikAche to post help requests, offer help to your neighbors, and build trust in your community.",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md w-full bg-card border border-border shadow-xl rounded-2xl p-6 md:p-8">
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