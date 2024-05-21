import React from "react";
import { UserProps } from "./time-chart";
import { format } from "date-fns";

const UserDetails = ({ userData }: { userData: UserProps[] }) => {
  return (
    <ul>
      <li className="py-1">
        {/* Heading */}
        <ul className="flex grow gap-2 text-sm">
          <li className="line-clamp-1 w-[90px] overflow-hidden">Date</li>
          <li className="line-clamp-1 w-[170px] overflow-hidden">Name</li>
          <li className="line-clamp-1 w-[200px] overflow-hidden">Comment</li>
          <li className="line-clamp-1 w-[200px] overflow-hidden">Category</li>
          <li className="line-clamp-1 w-[200px] overflow-hidden">Task</li>
          <li className="line-clamp-1 w-[40px] overflow-hidden text-right">Hour</li>
        </ul>
      </li>
      {/* Data */}
      {userData.map((user) => (
        <li key={user.date.toString()} className="border-b py-1">
          <ul className="flex grow gap-2 text-sm text-primary/60">
            <li className="line-clamp-1 w-[90px] overflow-hidden">{format(user.date, "MMMdd")}</li>
            <li className="line-clamp-1 w-[170px] overflow-hidden">{user.user.name}</li>
            <li className="line-clamp-1 w-[200px] overflow-hidden">{user.comments}</li>
            <li className="line-clamp-1 w-[200px] overflow-hidden">{user.milestone?.name ?? "-"}</li>
            <li className="line-clamp-1 w-[200px] overflow-hidden">{user.task?.name ?? "-"}</li>
            <li className="line-clamp-1 w-[40px] overflow-hidden text-right">{user.time}h</li>
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default UserDetails;
