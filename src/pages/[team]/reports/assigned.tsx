import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/lib/api";
import { FormEvent, useState } from "react";

export default function GlobalReportsAssigned() {
  const { isLoading, isInvalid, isReady, currentTeam } = useValidateTeamAccess();

  const [startDateInput, setStartDateInput] = useState(new Date());
  const [endDateInput, setEndDateInput] = useState(new Date());
  const [pageNoInput, setPageNoInput] = useState(1);
  const [pageLimit, setPageLimitInput] = useState(10);
  const [projectId, setProjectIdInput] = useState(0);

  const [allocationData, setAllocationData] = useState([]);

  const reportData = api.report.getAssigned.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const projectData = api.project.getProjects.useQuery({ slug: currentTeam }, { enabled: isReady });
  

  const handleAllocationSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = {
      team: currentTeam,
      startDate: startDateInput,
      endDate: endDateInput,
      page: pageNoInput || 1,
      pageSize: pageLimit || 10,
      ...(projectId ? { projectId: projectId } : {}), /* add projectId if exist */
    };

    const { data } = api.allocation.getAllocations.useQuery(params, { enabled: isReady });

    if (!data) {
      return <p>Error...</p>
    }

    setAllocationData(data);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl gap-4">
      <section>
        <h2>Global Assignment Data</h2>
        <ul className="flex flex-col gap-4">
          {reportData.data &&
            reportData.data.map((logged) => (
              <li
                key={logged.id}
                className="hover:bg-zinc/20 max-w-none rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20"
              >
                {logged.User.name} - {logged.Project.Client.name} - {logged.Project.name} - {logged.billableTime}m (B)
                and {logged.nonBillableTime}m (NB)
              </li>
            ))}
        </ul>

        <h2 className="mt-10 mb-3">Allocation Data</h2>
        <form className="my-5" onSubmit={handleAllocationSubmit}>
          <div className="inline">
            <label htmlFor="startDate" className="text-gray-700 text-m font-bold mb-2 mr-2">Start Date</label>
            <input id="startDate" className="rounded-md py-1" value={startDateInput.toISOString()} onChange={(e) => setStartDateInput(new Date(e.target.value))} type="date" placeholder="Start Date" autoComplete="off" />
          </div>

          <div className="inline ml-5">
            <label htmlFor="endDate" className="text-gray-700 text-m font-bold mb-2 mr-2">End Date</label>
            <input id="endDate" className="rounded-md py-1" value={endDateInput.toISOString()} onChange={(e) => setEndDateInput(new Date(e.target.value))} type="date" placeholder="End Date" autoComplete="off" />
          </div>

          <div>
            <label htmlFor="project-list" className="text-gray-700 text-m font-bold mb-2 mr-2">Project</label>
            <select id="project-list" onChange={(e) => setProjectIdInput(Number(e.target.value))}>
              <option key={0} value={0}>Select</option>
              {projectData.data?.map((project) => <option key={project.id}>{project.name}</option>)}
            </select>
          </div>

          <div className="inline">
            <label htmlFor="pageno" className="text-gray-700 text-m font-bold mb-2 mr-2">Page No.</label>
            <input id="pageno" className="rounded-md py-1" value={pageNoInput} onChange={(e) => setPageNoInput(Number(e.target.value))} type="text" placeholder="Page no." autoComplete="off" />
          </div>

          <div className="inline ml-5">
            <label htmlFor="pageLimit" className="text-gray-700 text-m font-bold mb-2 mr-2">Page limit</label>
            <input id="pageLimit" className="rounded-md py-1" value={pageLimit} onChange={(e) => setPageLimitInput(Number(e.target.value))} type="text" placeholder="Page limit" autoComplete="off" />
          </div>

          <div className="mt-5">
            <button className="bg-blue-500 text-white px-5 py-2 font-bold rounded">Enter</button>
          </div>
        </form>

        <h3 className="my-5">Report</h3>
        <ul className="font-bold text-grey-700">
          {projectId && allocationData?.map(data => (
            <li key={data.projectId}>
              Client name: {data.clientName} <br />
              project name: {data.projectName} <br />
              Users: <ul className="ml-10 text-gray-600">
                {data.users?.map(user => (
                  <li key={user.userId}>
                    User name: {user.username} <br />
                    User avatar: <img className="inline ml-2 h-5 rounded-full" src={user.userAvatar} alt="avatar" /> <br />
                    Average hours: {user.averageHours/60 || 0} <br />
                    Total allocations hours: {user.totalAllocationsHours/60 || 0} <br />
                    Allocations: 
                    <ul className="ml-10 font-normal">
                      {Object.keys(user.allocations)?.map(allocationDate => (
                        <li key={allocationDate}>
                          Billable time: {user.allocations[allocationDate].billableTime/60 || 0} <br />
                          Non billable time: {user.allocations[allocationDate].nonBillableTime/60 || 0} <br />
                          Total time: {user.allocations[allocationDate].totalTime/60 || 0} <br />
                          <br />
                        </li>
                      ))}
                    </ul>
                    <br />
                  </li>
                ))}
              </ul>
              <br />
            </li>
          ))}
          
          {!projectId && allocationData?.map(user => ( /* if projectId not exist */
            <li key={user.userId}>
              User name: {user.username} <br />
              User avatar: <img className="inline ml-2 h-5 rounded-full" src={user.userAvatar} alt="avatar" /> <br />
              Average hours: {user.averageHours/60} <br />
              Total hours: {user.totalTime/60} <br />
              TopRowDates: 
              <ul className="ml-10 text-gray-600">
                {Object.keys(user.topRowDates)?.map((allocationDate) => (
                  <li key={allocationDate}>
                    Billable time: {user.topRowDates[allocationDate].billableTime/60 || 0} <br />
                    Non billable time: {user.topRowDates[allocationDate].nonBillableTime/60 || 0} <br />
                    Total time: {user.topRowDates[allocationDate].totalTime/60 || 0} <br />
                    <br />
                  </li>
                ))}
              </ul>
              Projects:
              <ul className="ml-10 text-gray-600">
                {user.projects?.map((project) => (
                  <li key={project.projectId}>
                    Project name: {project.projectName} <br />
                    Total time: {project.totalTime/60 || 0} <br />
                    Allocation Date: 
                    <ul className="ml-10 text-gray-600">
                      {Object.keys(project.allocationDates)?.map((allocationDate) => (
                        <li key={allocationDate}>
                          Billable time: {project.allocationDates[allocationDate].billableTime/60 || 0} <br />
                          Non billable time: {project.allocationDates[allocationDate].nonBillableTime/60 || 0} <br />
                          Total time: {project.allocationDates[allocationDate].totalTime/60 || 0} <br />
                          <br />
                        </li>
                      ))}
                    </ul>
                    <br />
                  </li>
                ))}
              </ul> 
              <br />
            </li>
          ))}
        </ul>
        
      </section>
    </div>
  );
}
