import React from "react";

import { DataTable } from "./data-table";
import { getColumns } from "./columns";

const UserDetails = ({ userData, showTask = true }: { userData: unknown[]; showTask?: boolean }) => {
  return (
    <div className="mt-4">
      <DataTable columns={getColumns(showTask)} data={userData} />
    </div>
  );
};

export default UserDetails;
