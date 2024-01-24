import type { Metadata } from "next";
import { pageProps } from "@/types";

import { Logged, columns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";

export const metadata: Metadata = {
  title: `Logged`,
};

async function getData(): Promise<Logged[]> {
  return [
    {
      id: 1,
      name: "CFM",
      hours: 1187,
      subRows: [
        {
          id: 1,
          name: "ClearForMe Ongoing retainer",
          hours: 1184.5,
          subRows: [
            {
              id: 1,
              name: "Mayur S",
              hours: 74,
              subRows: [
                {
                  id: 1,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 2,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
              ],
            },
            {
              id: 2,
              name: "Dheeraj M",
              hours: 125,
              subRows: [
                {
                  id: 1,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: "ClearForMe Test",
          hours: 74,
          subRows: [
            {
              id: 1,
              name: "Shirly D",
              hours: 74,
              subRows: [
                {
                  id: 1,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 2,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 3,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 4,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
              ],
            },
            {
              id: 2,
              name: "Kashif A",
              hours: 125,
              subRows: [
                {
                  id: 1,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 2,
                  name: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "ML Applied",
      hours: 125,
      subRows: [
        {
          id: 1,
          name: "Development Support Agreement",
          hours: 3,
          subRows: [
            {
              id: 1,
              name: "Lorem Ipsum",
              hours: 3,
            },
            {
              id: 2,
              name: "Lorem dolor sit amet",
              hours: 34,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Axioned",
      hours: 14,
      subRows: [
        {
          id: 1,
          name: "Loggr: Internal",
          hours: 3,
        },
        {
          id: 2,
          name: "ClearForMe Test",
          hours: 17,
        },
      ],
    },
  ];
}

export default async function Page({ params }: pageProps) {
  const data = await getData();

  return (
    <DashboardShell>
      <DashboardHeader heading="Logged Hours" text="View all the hours that is logged" />
      <div className="mb-8">
        <DataTable columns={columns} data={data} />
      </div>
    </DashboardShell>
  );
}
