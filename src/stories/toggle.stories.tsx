"use client";

import { Italic } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export function ToggleDemo() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  );
}

export function ToggleWithText() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Italic className="mr-2 h-4 w-4" />
      Italic
    </Toggle>
  );
}

export function ToggleSm() {
  return (
    <Toggle variant="outline" size="sm" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  );
}

export function ToggleLg() {
  return (
    <Toggle variant="outline" size="lg" aria-label="Toggle italic">
      <Italic className="h-4 w-4" />
    </Toggle>
  );
}

export function ToggleDisabled() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic" disabled>
      <Italic className="h-4 w-4" />
    </Toggle>
  );
}
