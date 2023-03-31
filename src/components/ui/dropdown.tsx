import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { Command } from 'cmdk'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface DropdownProps {
    options: [{ value: string, label: string }],
    name: string,
    handleSelect: any,
    disable?: boolean,
    children?: ReactNode | string | number,
    selected?: boolean,
    active: any,
    setActive: any,
    open?: boolean,
    classname?: string,
    tabIndex?: number,
    reset?: boolean
}

export default function Dropdown({ options, handleSelect, name, disable, selected, children, setActive, active, open, classname, tabIndex, reset }: DropdownProps) {
    const [showDrop, setShowDrop] = useState<boolean>(false)
    const [searchVal, setSearchVal] = useState<string>('')
    const parentRef = useRef<HTMLDivElement>(null)

    const handleDropDownSelect = (e: any) => {
        if (!disable) {
            handleSelect(e)
        }
        setShowDrop(false)
        setSearchVal('')
    }

    const handleFocus = () => {
        setShowDrop(true)
        setActive(parentRef)
    }

    const handleBlur = (e: any) => {
        setTimeout(() => {
            setShowDrop(false)
            setSearchVal('')
        }, 200)
    }

    const handleOutsideClick = (e: any) => {
        if (
            showDrop &&
            parentRef.current &&
            !parentRef.current.contains(e.target)
        ) {
            setSearchVal('')
            setShowDrop(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showDrop]);

    useEffect(() => {
        if (open) handleFocus()
    }, [open])

    useEffect(() => {
        if(reset) setSearchVal('')
    }, [reset])

    return (
        <div className='relative z-2' ref={parentRef}>
            <button
                onFocus={handleFocus}
                tabIndex={showDrop ? -1 : tabIndex}
                type="button"
                disabled={disable}
                className={`rounded-md transition-all duration-[50] ease-out capitalize flex items-end justify-center focus:outline-0 focus:outline-offset-0 py-2 px-3 text-[14px] inline-flex items-center justify-center gap-[6px] ${selected
                    ? "bg-dropdownBg-light border-dropdownBorder-selected hover:bg-dropdownBg-hover"
                    : "border-dropdownBorder-light bg-[#fff] hover:bg-background-light"
                    } ${disable ? 'opacity-50 cursor-not-allowed' : ''} ${(showDrop && active === parentRef) ? 'ring-1 ring-offset-0 ring-brand-light border-brand-light' : ''} text-content-light border py-[6px] pl-[10px] pr-[11px] ${classname}`}
            >
                {children} {name}
            </button>
            {showDrop && active === parentRef && <Command className={`absolute bg-white border border-borderColor-light border-box top-[37px] rounded-t-[5px] w-[206px]`}>
                {!disable && <div className='w-full rounded-t-[5px] flex items-center space-between'>
                    <MagnifyingGlassIcon className="basis-[15%] h-[14px] text-info-light stroke-2 shrink-0"></MagnifyingGlassIcon>
                    <Command.Input onBlur={handleBlur} autoFocus tabIndex={tabIndex} className="px-0 border-0 box-border rounded-t-[5px] text-[14px] placeholder:font-[14px] focus:outline-0 focus:outline-0 focus:ring-0 w-[83%]" placeholder='Search' value={searchVal} onChangeCapture={(e: any) => setSearchVal(e.target.value)} />
                </div>}
                <Command.List
                    className='w-[calc(100%+2px)] py-[7px] px-[10px] border border-box border-borderColor-light max-h-[240px] overflow-y-auto dropdown-scrollbar shadow-md rounded-b-[5px] absolute top-full left-1/2 -translate-x-1/2 bg-white text-content-light transition-all duration-200 ease-out'
                >
                    <Command.Empty className="inline-flex text-sm items-center gap-2">
                        No results found.
                    </Command.Empty>
                    {options?.map((x: any, i: any) => {
                        return (
                            <React.Fragment key={i}>
                                <Command.Group
                                    heading={x.groupHeading}
                                    className="text-[#6B7280] text-sm [&_[cmdk-group-heading]]:px-[2px] [&_[cmdk-group-heading]]:py-2 select-none"
                                >
                                    {x.group.map((project: any, innerI: any) => {
                                        return (
                                            <div key={innerI} className="">
                                                <Command.Item
                                                    className={`${!disable ? 'aria-selected:bg-dropdownBg-light cursor-pointer aria-selected:text-content-light' : ''} w-full rounded py-2 px-[14px] text-[#374151]`}
                                                    value={project}
                                                    onSelect={(e) => handleDropDownSelect(e)}
                                                    onClick={() => { parentRef?.current?.focus(); console.log('blur') }}
                                                >
                                                    {project}
                                                </Command.Item>
                                            </div>
                                        );
                                    })}
                                </Command.Group>
                                {i < options.length && <Command.Separator />}
                            </React.Fragment>
                        );
                    })}
                </Command.List>
            </Command>
            }
        </div>
    )
}