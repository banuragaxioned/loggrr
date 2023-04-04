import React, { LegacyRef } from 'react'
import clsx from 'clsx';
import { CheckIcon } from "@heroicons/react/24/solid";

type Props = {
  containerStyles?: string;
  labelStyles?: string;
  inputStyles?: string;
  onChange: (checked: boolean) => void
  inputRef?: React.RefObject<HTMLInputElement | null> | null
  icon?: React.ReactElement;
}

export default function Checkbox({ containerStyles, labelStyles, inputStyles, onChange, inputRef, icon = <CheckIcon className="w-6 h-6"/> } : Props) {
  return (
    <div className={clsx(`flex select-none items-center justify-center relative ${containerStyles}`)}>
      <input
          tabIndex={7}
          ref={inputRef as LegacyRef<HTMLInputElement> || null}
          type="checkbox"
          name="check"
          id="check"
          className={`absolute [&:checked+label]:text-green-700 [&:checked+label]:border-billable-light [&:focus+label]:ring-1 [&:focus+label]:border-brand-light [&:focus+label]:ring-offset-0 [&:focus+label]:ring-brand-light ${inputStyles}`}
          onChange={(e: any) => onChange(e?.target?.checked)}
        />
      <label
        htmlFor="check"
        className={`relative flex items-center border border-borderColor-light rounded-md px-[6px] py-[5px] ml-[12px] cursor-pointer transition-all duration-[50] ease-out text-slate-300 bg-white ${labelStyles}`}
      >
        {icon}
      </label>
    </div>

  )
}

