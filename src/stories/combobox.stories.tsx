import React, { useState } from "react";
import { FolderIcon } from "lucide-react";
import ComboBox from "@/components/ui/combobox";

interface ISelectedValue {
  id: number;
  name: string;
  value: string;
  count: number;
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
    value: "my_projects",
    count: 5,
  },
  {
    id: 2,
    name: "Active Projects",
    value: "active_projects",
    count: 4,
  },
  {
    id: 3,
    name: "Client Projects",
    value: "client_projects",
    count: 1,
  },
  {
    id: 4,
    name: "Archived Projects",
    value: "archived_projects",
    count: 3,
  },
  {
    id: 1,
    name: "My Projects",
    value: "my_projects",
    count: 5,
  },
  {
    id: 2,
    name: "Active Projects",
    value: "active_projects",
    count: 4,
  },
  {
    id: 3,
    name: "Client Projects",
    value: "client_projects",
    count: 1,
  },
  {
    id: 4,
    name: "Archived Projects",
    value: "archived_projects",
    count: 3,
  },
  {
    id: 1,
    name: "My Projects",
    value: "my_projects",
    count: 5,
  },
  {
    id: 2,
    name: "Active Projects",
    value: "active_projects",
    count: 4,
  },
  {
    id: 3,
    name: "Client Projects",
    value: "client_projects",
    count: 1,
  },
  {
    id: 4,
    name: "Archived Projects",
    value: "archived_projects",
    count: 3,
  },
];

export const DefaultCombobox = () => {
  const [selected, setSelected] = useState<ISelectedValue>();
  const [defaultList, setDefaultList] = useState<ISelectedValue[]>(list);

  const handleSelect = (val: string) => {
    const selectedObj = defaultList.find((item: any) => item.value === val);
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
    list: list,
  },
];

export const GroupedCombobox = () => {
  const [selected, setSelected] = useState<ISelectedValue>();
  const [groupList, setGroupList] = useState<IGroupList[]>(groupedlist);

  const handleGroupSelect = (val: string, grpName: string) => {
    const selectedGrp = groupList.find((group: IGroupList) => group.groupName === grpName);
    const selectedObj = selectedGrp && selectedGrp.list.find((item: ISelectedValue) => item.value === val);
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
    const selectedObj = defaultList.find((item: any) => item.value === val);
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
