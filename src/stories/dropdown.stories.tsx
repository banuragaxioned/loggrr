import Dropdown from "@/components/ui/dropdown";

const options : any = [{
    group: ['Design Trends', 'Design Trends 2022', 'Design Trends 2023'],
    groupHeading: "My Projects"
},
{
    group: ['Design Trends', 'Design Trends 2022', 'Design Trends 2023'],
    groupHeading: "My Projects"
}
]

export const ProjectDropDown = () => {
    <Dropdown options={options} name='Project'/>
}