import TableUI from '@/components/ui/table';
import { dummyProjectList } from '@/config/table';
import { EProjectTable } from 'enums/project';
import React from 'react'

export const Table = () => {
    const projectDataColumns = [EProjectTable.name, EProjectTable.client, EProjectTable.status,EProjectTable.owner, EProjectTable.archive];
    
  return (
    <div className="w-full max-w-[1000px]">
    <TableUI rows={dummyProjectList} columns={projectDataColumns} />
    </div>
  )
}