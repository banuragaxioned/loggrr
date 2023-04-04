import { useState } from 'react';
import Toggle from "@/components/ui/toggle";
import { DollarSign } from "lucide-react";

export const DefualtToggle = () => {
  const [checked, setChecked] = useState(false);

  const handleCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  return (
      <Toggle onChange={handleCheckedChange} />
  );
};

export const ToggleWithDynamicIcon = () => {
  const [checked, setChecked] = useState(false);

  return (
      <Toggle name='billable-toggle' icon={<DollarSign className="w-6 h-6"/>} onChange={setChecked} />
  );
}
