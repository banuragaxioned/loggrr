import React, { useState } from "react";
import TimeLogForm from "@/components/timelogFrom";

type FormData = {
  projectId: number | undefined;
  milestoneId: number | undefined;
  taskId: number | undefined;
  loggedHours: number | undefined;
  isBillable: boolean;
  comment: string | undefined
};

export const Timelog = () => {
  const [formObj, setFormObj] = useState<FormData | undefined>();

  return <TimeLogForm formData={formObj} handleFormData={setFormObj} />;
};
