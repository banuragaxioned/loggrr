import React from "react";

const UserDetails = () => {
  return (
    <ul>
      <li className="py-1">
        {/* Heading */}
        <ul className="flex grow gap-2 text-sm">
          <li className="w-[90px]">Date</li>
          <li className="w-[200px]">Name</li>
          <li className="w-[200px]">Comment</li>
          <li className="w-[200px]">Category</li>
          <li className="w-[200px]">Task</li>
          <li className="w-[40px]">Hour</li>
        </ul>
      </li>
      {/* Data */}
      <li className="py-1">
        <ul className="flex grow gap-2 text-sm text-primary/60">
          <li className="w-[90px]">12/01/2012</li>
          <li className="w-[200px]">Zishan</li>
          <li className="w-[200px]">Worked on Test</li>
          <li className="w-[200px]">Test Cat</li>
          <li className="w-[200px]">Test Task</li>
          <li className="w-[40px]">7.5h</li>
        </ul>
      </li>
    </ul>
  );
};

export default UserDetails;
