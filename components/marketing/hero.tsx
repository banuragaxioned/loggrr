"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { SiteHeader } from "@/app/site-header";

export function HeroSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        screen={<ScreenContent />}
        titleComponent={
          <h1 className="text-4xl font-semibold text-foreground">
            Time tracking
            <span className="mt-1 block text-4xl font-bold leading-none md:text-[6rem]">Simplified</span>
          </h1>
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
