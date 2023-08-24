"use client";

import { SkillRadar } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

export function Overview(props: { data: SkillRadar }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={props.data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis tick={false} domain={[0, 5]} tickCount={6} />
        <Radar dataKey="value" fill="hsl(var(--secondary))" fillOpacity={0.6} />
        <Tooltip cursor={{ stroke: "hsl(var(--secondary))", strokeWidth: 1 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
