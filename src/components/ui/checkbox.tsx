import React from 'react'
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

interface Props {
  ref?: any,
  setBillable: any,
}

export default function Checkbox({ref, setBillable} : Props) {
  return (
    <div className={`flex select-none items-center justify-center relative`}>
      <input
        tabIndex={7}
        ref={ref}
        type="checkbox"
        name="check"
        id="check"
        className="absolute [&:checked+label]:text-billable-light [&:checked+label]:border-billable-light [&:focus+label]:ring-1 [&:focus+label]:border-brand-light [&:focus+label]:ring-offset-0 [&:focus+label]:ring-brand-light"
        onChange={(e: any) => setBillable(e?.target?.checked)}
      />
      <label
        htmlFor="check"
        className="relative flex items-center border border-borderColor-light rounded-md px-[6px] py-[5px] ml-[12px] cursor-pointer transition-all duration-[50] ease-out text-nonbillable-light bg-white"
      >
        <CurrencyDollarIcon className="w-6 h-6"></CurrencyDollarIcon>
      </label>
    </div>

  )
}
