"use client";

import React from "react";
import { MapPin } from "lucide-react";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "../../ui/scroll-based-velocity";
import { SectionHeading } from "../../ui/section-heading";
import { DHAKA_AREAS, DhakaArea } from "../../../assets/dhaka-top-areas";

export function AreaVelocitySection() {
  return (
    <section className="py-24 w-full overflow-hidden bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionHeading
          title="Where You Need Us"
          subtitle="Quality local assistance delivered right to your doorstep."
          align="center"
        />
      </div>

      <div className="relative flex w-full flex-col items-center justify-center">
        <ScrollVelocityContainer className="text-xl font-medium tracking-tight text-white md:text-3xl">
          <ScrollVelocityRow baseVelocity={0.5} direction={1}>
            {DHAKA_AREAS.map((area: DhakaArea) => (
              <div key={area} className="flex items-center gap-2 px-6">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="whitespace-nowrap uppercase opacity-70">
                  {area}
                </span>
              </div>
            ))}
          </ScrollVelocityRow>

          <ScrollVelocityRow baseVelocity={0.5} direction={-1}>
            {DHAKA_AREAS.map((area) => (
              <div key={area} className="flex items-center gap-2 px-6 mt-6">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="whitespace-nowrap uppercase opacity-70">
                  {area}
                </span>
              </div>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black via-transparent to-transparent"></div>
      </div>
    </section>
  );
}
