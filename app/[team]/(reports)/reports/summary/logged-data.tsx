import { TableCell, TableRow } from "@/components/ui/table";

export default function LoggedData({ loggedData }: { loggedData: any }) {
  return (
    loggedData &&
    loggedData.map((logged: any) => (
      <TableRow key={logged.id}>
        <TableCell>
          <span className="descendent relative ml-24 flex items-center gap-2">
            {logged.date}
            <span className="ml-12 opacity-50">{logged.description}</span>
          </span>
        </TableCell>
        <TableCell className="opacity-50">
          <span className="inline-block w-20 text-right">{logged.hours} h</span>
        </TableCell>
      </TableRow>
    ))
  );
}
