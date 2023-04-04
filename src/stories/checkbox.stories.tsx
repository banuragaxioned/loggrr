import { useState } from 'react';
import Checkbox from "@/components/ui/checkbox";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

export const DefualtCheckbox = () => {
  const [checked, setChecked] = useState(false);

  const handleCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  return (
      <Checkbox onChange={handleCheckedChange} />
  );
};

export const CheckboxWithDynamicIcon = () => {
  const [checked, setChecked] = useState(false);

  return (
      <Checkbox icon={<CurrencyDollarIcon className="w-6 h-6"/>} onChange={setChecked} />
  );
}
