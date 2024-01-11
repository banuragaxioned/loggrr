import React, { useState } from "react";

export const useSubmit = () => {
  const [submitCount, setSubmitCount] = useState<number>(0);
  return { submitCount, setSubmitCount };
};
