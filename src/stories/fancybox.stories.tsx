import React, { useEffect, useState } from "react";
import { FancyBox } from "@/components/ui/fancybox";

type List = Record<"value" | "label", string>;

const options = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
] satisfies List[];

export const FancyBoxDemo = () => {
  const [selectedValues, setSelectedValues] = React.useState<List[]>([]);

  return (
    <div>
      <FancyBox options={options} selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
    </div>
  );
};
