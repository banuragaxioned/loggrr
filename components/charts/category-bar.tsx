import { Card, CategoryBar, Flex, Text } from "@tremor/react";
import { Info } from "lucide-react";

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
  const { markerValue, maxValue, title, subtitle, values, type } = input;
  const percent = markerValue <= maxValue ? (markerValue / maxValue) * 100 : 100;

  return (
    <Card className="flex flex-col gap-3 shadow-none">
      <Flex className="items-center font-semibold">
        <Text>{title}</Text>
        <Text className="flex items-center text-xs">
          <Info className="mx-1" size={16} />
          {subtitle}
        </Text>
      </Flex>
      <Flex>
        <Text className="flex items-baseline gap-0.5">
          <span className="relative top-0.5 text-3xl font-semibold normal-nums text-primary">{markerValue}</span>/
          <span className="normal-nums">
            {maxValue}
            {type === "hours" ? "h" : ""}
          </span>
        </Text>
      </Flex>
      <CategoryBar
        values={values ? values : [25, 25, 25, 25]}
        colors={["rose", "orange", "yellow", "emerald"]}
        markerValue={percent}
        className="text-sm"
        tooltip={`${Math.round(percent)}%`}
        showAnimation
      />
    </Card>
  );
}
