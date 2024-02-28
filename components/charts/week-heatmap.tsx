"use client";

import React from "react";
import dynamic from "next/dynamic";
import { addDays, differenceInDays, endOfWeek, format, startOfToday } from "date-fns";
import { Info } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { Card, CardHeader } from "../ui/card";
import { TimeEntrySum } from "./time-barchart";
import { Skeleton } from "../ui/skeleton";
import { useTheme } from "next-themes";

const WeekHeatmap = ({ sevenWeekTimeEntries }: { sevenWeekTimeEntries: TimeEntrySum[] }) => {
  const [data, setData] = React.useState<any>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
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

    const today = endOfWeek(startOfToday());
    sevenWeekTimeEntries.forEach((entry: any) => {
      const dayOfWeekFromToday = dayNames.findIndex((item) => item === format(entry.date, "EEE")); // Index based on today's date
      const diffInDays = differenceInDays(addDays(today, 1), entry.date);
      const weekIndex = Math.floor(diffInDays / 7);

      if (weekIndex >= 0 && weekIndex < 7 && dayOfWeekFromToday >= 0 && dayOfWeekFromToday < 7) {
        transformedData[dayOfWeekFromToday].data[weekIndex].y = entry._sum.time / 60 || 0;
        transformedData[dayOfWeekFromToday].data[weekIndex].date = format(entry.date, "yyyy-MM-dd");
      }
    });

    // Final Data to be shown in heatmap
    const finalData = transformedData.map((item) => {
      return {
        name: item.name,
        data: item.data.reverse(),
      };
    });

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
      },
    },
    plotOptions: {
      heatmap: {
        radius: 8,
        enableShades: true,
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              name: "empty",
              color: "#F3F4F6",
            },
          ],
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
      colors: [theme === "dark" ? "black" : "white"],
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
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
        const { date } = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div class="p-2 text-xs flex flex-col bg-primary-foreground">
            ${date && "<span>" + format(date, "EEE, dd MMM, yyyy") + "</span>"}
            <span>
              Hours logged: ${series[seriesIndex][dataPointIndex]}
            </span>
          </div>
        `;
      },
    },
  };

  return (
    <Card className="flex w-full flex-col shadow-none">
      <CardHeader className="flex flex-row items-end justify-between p-4 text-xs font-bold text-muted-foreground">
        <p>Heatmap</p>
        <p className="flex items-center gap-1.5 font-medium">
          <Info size={16} />
          last 7 weeks
        </p>
      </CardHeader>
      <div className="-mt-9 h-[200px]">
        {data ? (
          <Chart options={options} series={data} type="heatmap" height="100%" width="100%" />
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
