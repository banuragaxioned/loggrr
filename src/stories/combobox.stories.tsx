import React, { useState } from "react";
import ComboBox from "@/components/ui/combobox";
import { FolderIcon } from "lucide-react";

interface ISelectedValue {
  id: number;
  name: string;
  value: string;
  count?: number;
}

interface IGroupList {
  id: number;
  groupName: string;
  list: ISelectedValue[];
}

const list: ISelectedValue[] = [
  {
    id: 1,
    name: "My Projects",
    value: "My Projects",
    count: 5,
  },
  {
    id: 2,
    name: "Active Projects",
    value: "Active Projects",
    count: 4,
  },
  {
    id: 3,
    name: "Client Projects",
    value: "Client Projects",
    count: 1,
  },
  {
    id: 4,
    name: "Archived Projects",
    value: "Archived Projects",
    count: 3,
  },
  {
    id: 5,
    name: "My Projects 2",
    value: "My Projects 2",
    count: 5,
  },
  {
    id: 6,
    name: "Active Projects 2",
    value: "Active Projects 2",
    count: 4,
  },
  {
    id: 7,
    name: "Client Projects 2",
    value: "Client Projects 2",
    count: 1,
  },
  {
    id: 8,
    name: "Archived Projects 2",
    value: "Archived Projects 2",
    count: 3,
  },
];

export const DefaultCombobox = () => {
  const [selected, setSelected] = useState<ISelectedValue>();
  const [defaultList, setDefaultList] = useState<ISelectedValue[]>(list);

  const handleSelect = (val: string) => {
    const selectedObj = defaultList.find((item: any) => item.value.toLowerCase() === val);
    console.log(defaultList, { selectedObj });
    setSelected(selectedObj);
  };

  return (
    <ComboBox
      icon={<FolderIcon className={`h-4 w-4`} />}
      options={defaultList}
      label={selected?.name || "DefaultCombobox"}
      selectedItem={selected?.name}
      handleSelect={handleSelect}
    />
  );
};

const groupedlist: IGroupList[] = [
  {
    id: 1,
    groupName: "Project",
    list: list,
  },
  {
    id: 2,
    groupName: "Project 2",
    list: [
      {
        id: 9,
        name: "Test List 2",
        value: "test_list_2",
        count: 1,
      },
      {
        id: 10,
        name: "Test Option",
        value: "test_option",
        count: 3,
      },
    ]
  },
];

export const GroupedCombobox = () => {
  const [selected, setSelected] = useState<ISelectedValue>();
  const [groupList, setGroupList] = useState<IGroupList[]>(groupedlist);

  const handleGroupSelect = (val: string, grpName: string) => {
    const selectedGrp = groupList.find((group: IGroupList) => group.groupName === grpName);
    const selectedObj = selectedGrp && selectedGrp.list.find((item: ISelectedValue) => item.value.toLowerCase() === val);
    selectedObj && setSelected(selectedObj);
  };

  return (
    <ComboBox
      icon={<FolderIcon className={`h-4 w-4`} />}
      group
      options={groupList}
      label={selected?.name || "GroupedCombobox"}
      selectedItem={selected?.name}
      handleGroupSelect={handleGroupSelect}
    />
  );
};

export const SearchableCombobox = () => {
  const [selected, setSelected] = useState<ISelectedValue>();
  const [defaultList, setDefaultList] = useState<ISelectedValue[]>(list);

  const handleSelect = (val: string) => {
    const selectedObj = defaultList.find((item: any) => item.value.toLowerCase() === val);
    setSelected(selectedObj);
  };

  return (
    <ComboBox
      icon={<FolderIcon className={`h-4 w-4`} />}
      searchable
      options={defaultList}
      label={selected?.name || "SearchableCombobox"}
      placeholder={"Search..."}
      selectedItem={selected?.name}
      handleSelect={handleSelect}
    />
  );
};