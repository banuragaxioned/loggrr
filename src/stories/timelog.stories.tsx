import React, { useState } from "react";
import {TimeLogForm} from "@/components/forms/timelogForm";

type FormData = {
  project: string | undefined;
  milestone: string | undefined;
  task: string | undefined;
  loggedHours: number | undefined;
  isBillable: boolean;
};

export const Timelog = () => {
  const [formObj, setFormObj] = useState<FormData | undefined>();

  // return <TimeLogForm formData={formObj} handleFormData={setFormObj} />;
};