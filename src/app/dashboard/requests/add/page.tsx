import React from "react";
import { HelpRequestForm } from "../../../../components/pages/dashboard/requests/HelpRequestForm";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Create Help Request",
  description: "Create a new help request to find a helper nearby.",
};
export default function AddRequests() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Create Help Request
        </h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to find a helper nearby.
        </p>
      </div>
      <HelpRequestForm />
    </div>
  );
}
