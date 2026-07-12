"use client";
import { FilePlus2, Users2, CheckCircle2, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { StepCard } from "./step-card";
import { DhakaMapVisual } from "./dhaka-map-visual";

const STEPS = [
  {
    icon: FilePlus2,
    title: "Post Request",
    description: "Describe what you need help with and set your own price.",
    iconClassName: "text-indigo-400 bg-indigo-950/10 border-indigo-900/30",
  },
  {
    icon: Users2,
    title: "Get Responses",
    description: "Verified neighbors will offer to help based on their skills.",
    iconClassName: "text-emerald-400 bg-emerald-950/10 border-emerald-900/30",
  },
  {
    icon: CheckCircle2,
    title: "Work Done",
    description: "Connect safely through our app and get the task completed.",
    iconClassName: "text-amber-400 bg-amber-950/10 border-amber-900/30",
  },
  {
    icon: Star,
    title: "Rate & Reward",
    description: "Release payment and leave a review to build community trust.",
    iconClassName: "text-purple-400 bg-purple-950/10 border-purple-900/30",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full py-24 px-4 bg-black border-t border-zinc-900">
      <div className="container mx-auto">
        <SectionHeading
          title="How ThikAche Works"
          subtitle="Get help or provide skills in four simple steps within your own community."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
          <div className="lg:col-span-5 flex flex-col gap-4">
            {STEPS.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                iconClassName={step.iconClassName}
              />
            ))}
          </div>

          <div className="lg:col-span-7 w-full h-full">
            <DhakaMapVisual />
          </div>
        </div>
      </div>
    </section>
  );
}