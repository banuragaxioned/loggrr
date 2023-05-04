// export const demoProject = [
//   id: 1,
//   name: 'Axioned',

// ] 

// export const projectDetails = [
//   {
//     id: 1,
//     'client': "Axioned",
//     'Project': "Testing Axioned Logrr",
//     'pType': "retainer",
//     'Logged': 64,
//     'Budget': 190,
//     'Project Leads': 'Anurag',
//   },
//   {
//     'id': 2,
//     'client': "Axioned",
//     'Project': "Loggr : Internal",
//     'pType': "retainer-granular",
//     'Logged': 64,
//     'Budget': 190,
//     'Project Leads': 'Ajay',
//   },
//   {
//     id: 103,
//     'client': "CFM",
//     'Project': "ClearForMe TEST",
//     'pType': "fixed",
//     'Logged': 64,
//     'Budget': 190,
//     'Project Leads': 'Anurag',
//   },

// ]

export type Project = {
  id: number,
  name: string,
  type: string,
  logTime: number,
  budgetHours: number,
  projectLead: string,
  clientName?: string,
}

export type ClientList = {
  id: number,
  client: string,
  projectList: Project[],
}

export const projectDetails: ClientList[] = [
  {
    id: 1,
    client: "AX",
    projectList: [
      {
        id: 101,
        clientName: "AX",
        name: "Testing AX L",
        type: "retainer",
        logTime: 64,
        budgetHours: 190,
        projectLead: 'A',
      },
      {
        id: 102,
        clientName: "AX2",
        name: "L : Internal",
        logTime: 64,
        type: "retainer-granular",
        budgetHours: 190,
        projectLead: 'J',
      },
    ],
  },
  {
    id: 2,
    client: "C",
    projectList: [
      {
        id: 103,
        name: "C TEST",
        logTime: 64,
        budgetHours: 190,
        type: "fixed",
        projectLead: 'A',
      },
    ],
  },
];

export const dummyProjectList = [
  {
      "id": 30,
      "name": "Testing Project",
      "startdate": "2/20/2023",
      "billable": true,
      "interval": "WEEKLY",
      "client": "Acme Inc.",
      "owner": "Anurag Banerjee",
      "status": "PUBLISHED"
  },
  {
      "id": 31,
      "name": "SSTK Content",
      "startdate": "4/4/2023",
      "enddate": "4/20/2023",
      "billable": true,
      "interval": "MONTHLY",
      "client": "SSTK",
      "owner": "Vipin Y",
      "status": "PUBLISHED"
  }
]
