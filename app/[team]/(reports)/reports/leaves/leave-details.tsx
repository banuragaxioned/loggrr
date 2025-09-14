import React from "react";

import { LeaveDetails as LeaveDetailsType } from "@/server/services/leaves";

function LeaveDetails({ leave }: { leave: LeaveDetailsType }) {
  return (
    <div>
      <pre>{JSON.stringify(leave, null, 2)}</pre>
    </div>
  );
}

export default LeaveDetails;
