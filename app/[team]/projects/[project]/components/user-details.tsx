import React from "react";

import { DataTable } from "./data-table";
import { columns } from "./columns";

const UserDetails = ({ userData, team }: { userData: unknown[]; team: string }) => {
  return (
    <div className="mt-4">
      <DataTable columns={columns} data={userData} team={team} />
    </div>
  );
};

export default UserDetails;
