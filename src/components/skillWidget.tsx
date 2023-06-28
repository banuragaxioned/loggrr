"use client";

import { SkillRadar } from "@/types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
} from "recharts";

export function Overview(props: { data: SkillRadar }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={props.data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis tick={false} domain={[0, 5]} tickCount={6} />
        <Radar dataKey="level" fill="hsl(var(--secondary))" fillOpacity={0.6} />
        <Tooltip cursor={{ stroke: "hsl(var(--secondary))", strokeWidth: 1 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

const available = [
  { x: 1, y: 20, z: 200 },
  { x: 2, y: 30, z: 260 },
  { x: 3, y: 40, z: 400 },
  { x: 4, y: 50, z: 280 },
];
const assigned = [
  { x: 1, y: 20, z: 200 },
  { x: 2, y: 30, z: 260 },
  { x: 3, y: 20, z: 400 },
  { x: 4, y: 70, z: 280 },
];

export default function ScatterDashboard() {
  const range = [200, 600];
  return (
    <ScatterChart
      width={500}
      height={400}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <CartesianGrid />
      <XAxis type="number" dataKey="x" name="Role" />
      <YAxis yAxisId="left" max={100} type="number" dataKey="y" name="Available" unit="%" stroke="#8884d8" />
      <YAxis
        yAxisId="right"
        max={8}
        type="number"
        dataKey="y"
        name="Assigned"
        unit="%"
        orientation="right"
        stroke="#82ca9d"
      />
      <ZAxis name="People" type="number" dataKey="z" range={range} />

      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Scatter yAxisId="left" name="A school" data={available} fill="#8884d8" />
      <Scatter yAxisId="right" name="A school" data={assigned} fill="#82ca9d" />
    </ScatterChart>
  );
}
