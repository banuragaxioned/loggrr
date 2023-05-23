import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const projects = [
  {
    id: 1,
    title: "CFM",
    budget: "190",
    logged: "64",
    projectLead: "Kevin Jain",
  },
  {
    id: 2,
    title: "Culture 15",
    budget: "200",
    logged: "38",
    projectLead: "Zishan Ansari",
  },
  {
    id: 3,
    title: "Loggr",
    budget: "69",
    logged: "14",
    projectLead: "Anurag Banerjee",
  },
  {
    id: 4,
    title: "Shutterstock",
    budget: "120",
    logged: "49",
    projectLead: "Ganesh More",
  },
  {
    id: 5,
    title: "Gamification",
    budget: "30",
    logged: "28",
    projectLead: "Ajay",
  },
  {
    id: 6,
    title: "Culture 15",
    budget: "321",
    logged: "209",
    projectLead: "Sameer",
  },
];

export function DefaultTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="text-center">Budget</TableHead>
          <TableHead className=" text-center">Logged</TableHead>
          <TableHead>Project Leads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="text-center">{project.budget}</TableCell>
            <TableCell className="text-center">{project.logged}</TableCell>
            <TableCell>{project.projectLead}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function Tablev2() {
  return (
    <Table>
      <TableHeader className="rounded-xl bg-inherit font-medium">
        <TableRow className="[&>*]:px-14">
          <TableHead className="w-[40%]">Project</TableHead>
          <TableHead className="w-[15%] text-center">Budget</TableHead>
          <TableHead className="w-[15%] text-center">Logged</TableHead>
          <TableHead className="w-[30%]">Project Leads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-inherit">
        {projects.map((project) => (
          <TableRow key={project.id} className="[&>*]:px-14">
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="text-center">{project.budget}</TableCell>
            <TableCell className="text-center">{project.logged}</TableCell>
            <TableCell>{project.projectLead}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}