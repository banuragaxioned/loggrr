import { Card, Flex, MarkerBar, Text } from "@tremor/react";
import { CalendarDays } from "lucide-react";

interface CategoryBarProps {
  title: string;
  subtitle: string;
  project: {
    name: string;
    maxValue: number;
    value: number;
  }[];
}

export default function MarkerDataBar(input: CategoryBarProps) {
  return (
    <Card className="border border-border">
      <Flex className="items-center font-semibold">
        <Text className="pb-2">{input.title}</Text>
        <Text className="flex items-center pb-2 text-xs">
          <CalendarDays className="mx-1 h-4 w-4" />
          {input.subtitle}
        </Text>
      </Flex>
      {input.project.map((item, index) => {
        return (
          <div key={index}>
            <Flex>
              <Text>{item.name}</Text>
              <Text>{item.maxValue}h</Text>
            </Flex>
            <MarkerBar
              value={item.value}
              minValue={0}
              maxValue={item.maxValue}
              color="yellow"
              className="mt-4"
              markerTooltip={`Logged ${item.value}h, ${Math.abs(item.value - item.maxValue)}h ${
                item.value - item.maxValue > 0 ? "over" : "short"
              }`}
              rangeTooltip={`Assigned - ${item.maxValue}h`}
            />
          </div>
        );
      })}
    </Card>
  );
}
