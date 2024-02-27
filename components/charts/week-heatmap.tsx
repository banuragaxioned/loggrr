"use client";

import React from "react";
import Chart from "react-apexcharts";
import { Card } from "../ui/card";
import { TimeEntrySum } from "./time-barchart";
import { addDays, format, getDay, startOfToday, subDays, subWeeks } from "date-fns";

const WeekHeatmap = ({ sevenWeekTimeEntries }: { sevenWeekTimeEntries: TimeEntrySum[] }) => {
  console.log(sevenWeekTimeEntries);
  const [data, setData] = React.useState<any>([]);
  const series = [
    {
      name: "Sun",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
    {
      name: "Mon",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
    {
      name: "Tue",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
    {
      name: "Wed",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
    {
      name: "Thur",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
    {
      name: "Fri",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
    {
      name: "Sat",
      data: [
        {
          x: "W1",
          y: 10,
        },
        {
          x: "W2",
          y: 20,
        },
        {
          x: "W3",
          y: 30,
        },
        {
          x: "W4",
          y: 40,
        },
        {
          x: "W5",
          y: 50,
        },
        {
          x: "W6",
          y: 60,
        },
        {
          x: "W7",
          y: 70,
        },
      ],
    },
  ];

  React.useEffect(() => {
    const getLast7Weeks = () => {
      const today = startOfToday();
      const lastFortyNineDays = [];
      for (let i = 7 * 7 - 1; i >= 0; i--) {
        const currentDate = subDays(today, i);
        lastFortyNineDays.push(format(currentDate, "yyyy-MM-dd"));
      }

      return lastFortyNineDays;
    };

    const last7Weeks = getLast7Weeks();
    const transformedData: { name: string; data: { x: string; y: number }[] }[] = [];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    // Initialize the transformed data structure
    dayNames.forEach((day) => {
      const weekData: { x: string; y: number }[] = [];
      for (let i = 7; i >= 1; i--) {
        weekData.push({ x: `W${i}`, y: 0 });
      }
      transformedData.push({ name: day, data: weekData });
    });

    // Populate the data with fetched values
    sevenWeekTimeEntries.forEach((entry: any) => {
      const date = format(entry.date, "yyyy-MM-dd");
      const dayOfWeek = getDay(entry.date); // 0 (Sun) - 6 (Sat)

      // Calculate the week index
      const weekIndex = Math.floor(
        (new Date(date).getTime() - new Date(last7Weeks[0]).getTime()) / (7 * 24 * 60 * 60 * 1000),
      );

      if (weekIndex >= 0 && weekIndex < 7) {
        // Ensure the week index is within valid range
        transformedData[dayOfWeek].data[weekIndex].y = entry._sum.time / 60 || 0;
      }
    });

    setData(transformedData);
  }, [sevenWeekTimeEntries]);

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
    },
    title: {
      text: "HeatMap Chart with Color Range",
    },
    colors: ["#013220"],
  };

  console.log(data, series);

  return (
    <Card className="p-2 shadow-none">
      <Chart options={options} series={data} type="heatmap" height={200} />
    </Card>
  );
};

export default WeekHeatmap;
