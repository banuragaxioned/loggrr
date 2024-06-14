import React from "react";

import { DataTable } from "./data-table";
import { columns } from "./columns";

const UserDetails = ({ userData }: { userData: unknown[] }) => {
  return (
    <div className="mt-4">
      <DataTable columns={columns} data={userData} />
    </div>
  );
};

export default UserDetails;
