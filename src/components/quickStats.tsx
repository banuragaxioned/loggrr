import * as React from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  Metric,
  Text,
  List,
  ListItem,
  ProgressBar,
  Grid,
  TabList,
  Tab,
  LineChart,
  Legend,
  Flex,
} from "@tremor/react";
import { useState } from "react";

export function QuickStatsWidget() {
  const router = useRouter();
  const currentTeam = router.query.team as string;
  const projectInsights = api.stats.getQuickStats.useQuery({
    tenant: currentTeam,
  });
  return (
    <ScrollArea className="h-44 w-full rounded-md border border-zinc-100 dark:border-zinc-700">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Time Insights</h4>
        {projectInsights.data &&
          projectInsights.data.map((stats) => (
            <React.Fragment key={stats.projectId}>
              <div className="flex justify-between text-sm" key={stats.projectId}>
                <p>{stats.projectName}</p>
                <p>Total: {stats.total}m</p>
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
      </div>
    </ScrollArea>
  );
}

const locationA = [
  {
    name: "Product A",
    share: 34,
    amount: "$ 11,715",
  },
  {
    name: "Product B",
    share: 24,
    amount: "$ 8,269",
  },
  {
    name: "Product C",
    share: 11,
    amount: "$ 3,790",
  },
  {
    name: "Product D",
    share: 10,
    amount: "$ 3,445",
  },
  {
    name: "Product E",
    share: 8,
    amount: "$ 2,756",
  },
];

const categories = [
  {
    title: "Sales • Location A",
    metric: "$ 34,456",
    data: locationA,
  },
];

export function Metrics() {
  return (
    <Grid numColsSm={2} numColsLg={1} className="gap-6">
      {categories.map((item) => (
        <Card key={item.title}>
          <Text>Time Insights</Text>
          <Metric>{item.metric}</Metric>
          <List className="mt-4">
            {item.data.map((product) => (
              <ListItem key={product.name}>
                <div className="w-full">
                  <Text>{product.name}</Text>
                  <ProgressBar percentageValue={product.share} label={`${product.share}%`} tooltip={product.amount} />
                </div>
              </ListItem>
            ))}
          </List>
        </Card>
      ))}
    </Grid>
  );
}

interface Data {
  date: string;
  today: number;
  average: number;
  lastweek: number;
}

const sales: Data[] = [
  {
    date: "01/01/2023",
    today: 90,
    average: 66,
    lastweek: 23,
  },
  {
    date: "02/01/2023",
    today: 45,
    average: 40,
    lastweek: 32,
  },
  {
    date: "03/01/2023",
    today: 68,
    average: 55,
    lastweek: 29,
  },
  {
    date: "04/01/2023",
    today: 73,
    average: 83,
    lastweek: 68,
  },
  {
    date: "05/01/2023",
    today: 79,
    average: 102,
    lastweek: 43,
  },
  {
    date: "06/01/2023",
    today: 70,
    average: 75,
    lastweek: 39,
  },
  {
    date: "07/01/2023",
    today: 50,
    average: 20,
    lastweek: 34,
  },
];

const valueFormatter = (number: number) => `${Intl.NumberFormat("us").format(number).toString()}`;

export function Insights() {
  const [selectedComparison, setSelectedComparison] = useState("average");
  return (
    <Card className="mx-auto max-w-md">
      <Text>Time logged this week</Text>
      <Metric className="mt-1">20h</Metric>
      <TabList defaultValue="average" onValueChange={(value) => setSelectedComparison(value)} className="mt-2">
        <Tab value="average" text="vs. peer average" />
        <Tab value="lastweek" text="vs. last week" />
      </TabList>
      {selectedComparison === "average" ? (
        <>
          <LineChart
            className="mt-4 h-56"
            data={sales}
            index="date"
            categories={["today", "average"]}
            colors={["indigo", "slate"]}
            showYAxis={false}
            showLegend={false}
            valueFormatter={valueFormatter}
            showAnimation={true}
          />
          <Flex justifyContent="end">
            <Legend categories={["Today", "Peer average"]} colors={["indigo", "slate"]} className="mt-3 space-x-2" />
          </Flex>
        </>
      ) : (
        <>
          <LineChart
            className="mt-4 h-56"
            data={sales}
            index="date"
            categories={["today", "lastweek"]}
            colors={["indigo", "slate"]}
            showYAxis={false}
            showLegend={false}
            valueFormatter={valueFormatter}
            showAnimation={true}
          />
          <Flex justifyContent="end">
            <Legend categories={["Today", "lastweek"]} colors={["indigo", "slate"]} className="mt-3" />
          </Flex>
        </>
      )}
    </Card>
  );
}

export function LoggedRatio() {
  const router = useRouter();
  const currentTeam = router.query.team as string;
  const projectInsights = api.stats.getQuickStats.useQuery({
    tenant: currentTeam,
  });
  const totalMinutes = projectInsights.data?.[0]?.total ?? 0;
  const total = totalMinutes / 60;
  const percentage = (total / 37.5) * 100;
  return (
    <Card className="max-w-sm">
      <Flex>
        <Text>Time logged: {percentage.toFixed()}%</Text>
        <Text>of 37.5h</Text>
      </Flex>
      <ProgressBar percentageValue={percentage} color="teal" className="mt-3" tooltip={total.toLocaleString()} />
    </Card>
  );
}
