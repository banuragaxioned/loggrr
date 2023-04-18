export const clients = [
  {
    clientId: 1,
    clientName: "Axioned",
    projects: [
      {
        title: "Loggr",
        id: 1,
        members: [
          {
            id: 9,
          },
          {
            id: 7,
          },
        ],
        milestone: [
          {
            id: 11,
            title: "Milestone 1",
          },
          {
            id: 12,
            title: "Milestone 2",
          },
          {
            id: 13,
            title: "Milestone 3",
          },
        ],
        tasks: [
          {
            milestoneId: 11,
            title: "Task 1",
            id: 111,
          },
          {
            milestoneId: 13,
            title: "Task 2",
            id: 131,
          },
          {
            milestoneId: 12,
            title: "Task 3",
            id: 121
          },
        ],
      },
      {
        title: "Gamification",
        id: 2,
        milestone: [
          {
            id: 21,
            title: "Month 3",
          },
        ],
        members: [
          {
            id: 9,
          },
          {
            id: 7,
          },
        ],
        tasks: [
          {
            milestoneId: 21,
            id: 211,
            title: "Design",
          },
          {
            milestoneId: 21,
            id: 212,
            title: "Develop",
          },
        ],
      },
    ],
  },
  {
    clientId: 2,
    clientName: "Shutterstock",
    projects: [
      {
        title: "Design Trends",
        id: 3,
        members: [
          {
            id: 12,
          },
          {
            id: 11,
          },
        ],
        milestone: [
          {
            id: 31,
            title: "Month 1",
          },
        ],
        tasks: [
          {
            milestoneId: 31,
            id: 311,
            title: "Task 1",
          },
          {
            milestoneId: 31,
            id: 312,
            title: "Task 2",
          },
        ],
      },
      {
        title: "Design Trends 2022",
        id: 4,
        members: [
          {
            id: 12,
          },
          {
            id: 11,
          },
        ],
        milestone: [
          {
            id: 41,
            title: "Month 1",
          },
        ],
        tasks: [
          {
            id: 411,
            milestoneId: 41,
            title: "Task 1",
          },
          {
            id: 411,
            milestoneId: 41,
            title: "Task 2",
          },
        ],
      },
      {
        title: "Design Trends 2023",
        id: 5,
        members: [
          {
            id: 12,
          },
          {
            id: 11,
          },
        ],
        milestone: [
          {
            id: 51,
            title: "Milestone 1",
          },
        ],
        tasks: [
          {
            milestoneId: 51,
            id: 511,
            title: "Design",
          },
          {
            milestoneId: 51,
            id: 512,
            title: "Develop",
          },
        ],
      },
    ],
  },
  {
    clientId: 1,
    clientName: "CFM",
    projects: [
      {
        title: "Maintenence",
        id: 6,
        members: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
        milestone: [
          {
            id: 61,
            title: "Month 1",
          },
        ],
        tasks: [
          {
            milestoneId: 61,
            id: 611,
            title: "Task 1",
          },
          {
            milestoneId: 61,
            id: 612,
            title: "Task 2",
          },
        ],
      },
    ],
  },
];
