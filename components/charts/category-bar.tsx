import { Card, CategoryBar, Flex, Text } from "@tremor/react";
import { CalendarDays } from "lucide-react";

interface CategoryBarProps {
  values?: number[];
  colors?: string[]; // waiting for https://github.com/tremorlabs/tremor/pull/836
  markerValue: number;
  title: string;
  subtitle: string;
  maxValue: number;
  type?: "hours";
}

export default function CategoryDataBar(input: CategoryBarProps) {
  return (
    <Card className="shadow-none">
      <Flex className="items-center font-semibold">
        <Text className="pb-2">{input.title}</Text>
        <Text className="flex items-center pb-2 text-xs">
          <CalendarDays className="mx-1 h-4 w-4" />
          {input.subtitle}
        </Text>
      </Flex>
      <Flex>
        <Text>
          <span className="text-3xl font-semibold normal-nums text-primary">{input.markerValue}</span> /{" "}
          <span className="normal-nums">
            {input.maxValue}
            {input.type === "hours" ? "h" : ""}
          </span>
        </Text>
      </Flex>
      <CategoryBar
        values={input.values ? input.values : [25, 25, 25, 25]}
        colors={["rose", "orange", "yellow", "emerald"]}
        markerValue={(input.markerValue / input.maxValue) * 100}
        className="mt-3 text-sm"
        tooltip={`${Math.round((input.markerValue / input.maxValue) * 100)}%`}
      />
    </Card>
  );
}
