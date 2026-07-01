"use client";

import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { ProjectSelectOption } from "./project-edit-combobox";

interface SelectOption extends ProjectSelectOption {}

const UserDetails = ({
  userData,
  showTask = true,
  categories = [],
  tasks = [],
}: {
  userData: unknown[];
  showTask?: boolean;
  categories?: SelectOption[];
  tasks?: SelectOption[];
}) => {
  return (
    <div className="mt-4">
      <DataTable columns={getColumns(showTask, categories, tasks)} data={userData} />
    </div>
  );
};

export default UserDetails;
