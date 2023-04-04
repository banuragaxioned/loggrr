import React, { useState } from "react";
import ComboBox from "../components/ui/combobox";
import { FolderIcon } from "lucide-react"

const options: any = [{
    group: ['Design Trends', 'Design Trends 2022', 'Design Trends 2023'],
    groupHeading: "My Projects"
},
{
    group: ['Loggr', 'Gamification', 'Apex'],
    groupHeading: "Org Wide Projects"
}
]

export const DefaultComboBox = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <ComboBox options={options} onSelected={() => setSelected(options)} label={selected || 'ComboBox'} />
    )
}

export const GroupComboBox = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <ComboBox options={options} group onSelected={() => setSelected(options)} label={selected || 'ComboBox'} />
    )
}

export const ComboBoxWithIcon = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <ComboBox icon={<FolderIcon className={`w-4 h-4`} />} group options={options} onSelected={() => setSelected(options)} label={selected || 'ComboBox'} />
    )
}

export const SearchableComboBox = () => {
    const [selected, setSelected] = useState<string | undefined>()
    return (
        <ComboBox icon={<FolderIcon className={`w-4 h-4`} />} group searchable options={options} onSelected={() => setSelected(options)} label={selected || 'ComboBox'} />
    )
}