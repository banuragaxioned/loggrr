"use client";

import React from "react";
import dynamic from "next/dynamic";
import { addDays, differenceInDays, endOfWeek, format, isAfter, startOfToday } from "date-fns";
import { Info } from "lucide-react";
import { startOfDay } from "date-fns";
import { useTheme } from "next-themes";
import { Card, Flex, Text } from "@tremor/react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { TimeEntrySum } from "./time-barchart";
import { Skeleton } from "../ui/skeleton";
import { useTimeEntryState } from "@/store/useTimeEntryStore";

const WeekHeatmap = ({ sevenWeekTimeEntries }: { sevenWeekTimeEntries: TimeEntrySum[] }) => {
  const setDate = useTimeEntryState((state) => state.setDate);
  const [data, setData] = React.useState<any>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    const getLast7Weeks = () => {
      const startFrom = endOfWeek(startOfToday());
      const last49Days = [];
      for (let i = 0; i < 7 * 7; i++) {
        last49Days.push(format(addDays(startFrom, -i), "yyyy-MM-dd"));
      }
      return last49Days;
    };

    const fillMissingDates = (rawData: TimeEntrySum[]) => {
      const allDates = getLast7Weeks();
      const newData = allDates.map((date) => {
        const existingData = rawData.find((item) => format(item.date, "yyyy-MM-dd") === date);
        return existingData ? existingData : { _sum: { time: 0 }, date };
      });
      return newData;
    };

    const filledData = fillMissingDates(sevenWeekTimeEntries);

    const transformedData: { name: string; data: { x: string; y: number; date: string }[] }[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].reverse();

    // Initialize the transformed data structure
    dayNames.forEach((day) => {
      const weekData: { x: string; y: number; date: string }[] = [];
      for (let i = 1; i <= 7; i++) {
        weekData.push({ x: `Week ${i}`, y: 0, date: "" });
      }
      transformedData.push({ name: day, data: weekData });
    });

    const weekEnd = endOfWeek(startOfToday());
    filledData.forEach((entry: any) => {
      const dayOfWeekFromToday = dayNames.findIndex((item) => item === format(entry.date, "EEE")); // Index based on today's date
      const diffInDays = differenceInDays(weekEnd, entry.date);
      const weekIndex = Math.floor(diffInDays / 7);

      if (weekIndex >= 0 && weekIndex < 7 && dayOfWeekFromToday >= 0 && dayOfWeekFromToday < 7) {
        transformedData[dayOfWeekFromToday].data[weekIndex].y = entry._sum.time / 60 || 0;
        transformedData[dayOfWeekFromToday].data[weekIndex].date = format(entry.date, "yyyy-MM-dd");
      }
    });

    // Final Data to be shown in heatmap
    const finalData = transformedData.map((item) => ({
      name: item.name,
      data: item.data.reverse(),
    }));

    setData(finalData);
  }, [sevenWeekTimeEntries]);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      width: "100%",
      height: "100%",
      animations: {
        enabled: true,
        speed: 100,
        animateGradually: {
          enabled: false,
        },
        dynamicAnimation: {
          enabled: false,
        },
      },
      events: {
        click: (event: any, chartContext: any, config: any) => {
          const { date } = config.config.series[config.seriesIndex]?.data[config.dataPointIndex] || {};
          const isClickable = date && !isAfter(date, addDays(startOfToday(), 1));
          if (date && isClickable) {
            setDate(startOfDay(date));
          }
        },
      },
    },
    plotOptions: {
      heatmap: {
        radius: 8,
        enableShades: true,
        shadeIntensity: 1,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              name: "empty",
              color: theme === "dark" ? "#212124" : "#F3F4F6",
            },
            {
              from: 0.01,
              to: 7.5,
              name: "hours",
              color: "#027B55",
            },
          ],
          min: 0,
          max: 7.5,
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
      padding: {
        right: 20,
        top: 0,
        bottom: 0,
      },
    },
    states: {
      hover: {
        colors: undefined,
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    stroke: {
      show: true,
      width: 4,
      colors: [theme === "dark" ? "#09090B" : "#ffffff"],
    },
    colors: ["#027B55"],
    xaxis: {
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
        const { date } = w.config.series[seriesIndex].data[dataPointIndex];
        const time = series[seriesIndex][dataPointIndex];
        const isNotClickable = isAfter(date, addDays(startOfToday(), 1));

        return `
          <div class="p-2 text-xs flex flex-col bg-primary-foreground">
            ${date ? "<span>" + format(date, "EEE, dd MMM, yyyy") + "</span>" : ""}
            <span>
              Hours logged: ${time > 0 ? time.toFixed(2) : time}
            </span>
            ${isNotClickable ? "<span class='text-[10px]'>(Not-selectable)</span>" : ""}
          </div>
        `;
      },
    },
  };

  return (
    <Card className="flex w-full flex-col pb-1 shadow-none">
      <Flex className="items-center font-semibold">
        <Text>Heatmap</Text>
        <Text className="flex items-center text-xs">
          <Info className="mx-1" size={16} />
          last 7 weeks
        </Text>
      </Flex>
      <div className="-mt-2 h-[200px]">
        {data ? (
          <div className="-ml-3 h-full w-full">
            <Chart options={options} series={data} type="heatmap" height="100%" width="110%" />
          </div>
        ) : (
          <div className="flex h-[100%] w-[100%] items-end justify-evenly">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={index} className="mb-4 h-[150px] w-7" />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeekHeatmap;
