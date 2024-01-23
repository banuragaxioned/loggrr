import type { Metadata } from "next";
import { pageProps } from "@/types";

import { Logged, columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export const metadata: Metadata = {
  title: `Logged`,
};

async function getData(): Promise<Logged[]> {
  return [
    {
      id: 1,
      name: "CFM",
      hours: 1187,
      tasks: [
        {
          id: 1,
          name: "ClearForMe Ongoing retainer",
          hours: 1184.5,
          members: [
            {
              id: 1,
              name: "Mayur S",
              hours: 74,
              loggedHours: [
                {
                  id: 1,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 2,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
              ],
            },
            {
              id: 2,
              name: "Dheeraj M",
              hours: 125,
              loggedHours: [
                {
                  id: 1,
                  date: "Monday, January 02, 2023",
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
          members: [
            {
              id: 1,
              name: "Shirly D",
              hours: 74,
              loggedHours: [
                {
                  id: 1,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 2,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 3,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 4,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
              ],
            },
            {
              id: 2,
              name: "Kashif A",
              hours: 125,
              loggedHours: [
                {
                  id: 1,
                  date: "Monday, January 02, 2023",
                  description: "Tickets, Meets and other project related work",
                  hours: 56,
                },
                {
                  id: 2,
                  date: "Monday, January 02, 2023",
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
      tasks: [
        {
          id: 1,
          name: "Development Support Agreement",
          hours: 3,
          members: [
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
      tasks: [
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
    <div className="mb-8">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
