"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { FeaturesSection } from "./features";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { TimeEntry } from "@/components/time-entry";

export function HeroSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        screen={<ScreenContent />}
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-foreground">
              Time tracking
              <br />
              <span className="mt-1 text-4xl font-bold leading-none md:text-[6rem]">Simplified</span>
            </h1>
          </>
        }
      />
    </div>
  );
}

export function ScreenContent() {
  return (
    <>
      <SiteHeader />
    </>
  );
}
