import { useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import {FolderIcon} from "@heroicons/react/24/outline"

const options : any = [{
    group: ['Design Trends', 'Design Trends 2022', 'Design Trends 2023'],
    groupHeading: "My Projects"
},
{
    group: ['Loggr', 'Gamification', 'Apex'],
    groupHeading: "Org Wide Projects"
}
]

export const BaiscDropdown = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <Dropdown options={options} onSelected={() => setSelected(options)} label={selected || 'Dropdown'} />
    )
}

export const GroupDropdown = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <Dropdown options={options} group onSelected={() => setSelected(options)} label={selected || 'Dropdown'} />
    )
}

export const DropdownWithIcon = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <Dropdown icon={<FolderIcon className={`w-4 h-4`}/>} group options={options} onSelected={() => setSelected(options)} label={selected || 'Dropdown'} />
    )
}

export const SearchableDropdown = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <Dropdown icon={<FolderIcon className={`w-4 h-4`}/>} group searchable options={options} onSelected={() => setSelected(options)} label={selected || 'Dropdown'} />
    )
}