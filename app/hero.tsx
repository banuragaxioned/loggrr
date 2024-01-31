"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        screen={<ScreenContent />}
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-foreground">
              Simply the hassle of <br />
              <span className="mt-1 text-4xl font-bold leading-none md:text-[6rem]">Time Tracking</span>
            </h1>
          </>
        }
      />
    </div>
  );
}

export function ScreenContent() {
  return <div className="h-full flex-col items-center justify-center text-center">Coming soon™</div>;
}
