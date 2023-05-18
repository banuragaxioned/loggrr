import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/lib/api";
import { FormEvent, useState } from "react";
import { GlobalAllocation, ProjectAllocation } from "@/types";
import Image from "next/image";

export default function GlobalReportsAssigned() {
  const { isLoading, isInvalid, isReady, currentTeam } = useValidateTeamAccess();

  const [startDateInput, setStartDateInput] = useState(new Date());
  const [endDateInput, setEndDateInput] = useState(new Date());
  const [pageNoInput, setPageNoInput] = useState(1);
  const [pageLimit, setPageLimitInput] = useState(10);
  const [projectId, setProjectIdInput] = useState(0);

  const [projectAllocationData, setProjectAllocationData] = useState<ProjectAllocation[]>([]);
  const [globalAllocationData, setGlobalAllocationData] = useState<GlobalAllocation[]>([]);

  const reportData = api.report.getAssigned.useQuery({ tenant: currentTeam }, { enabled: isReady });
  const projectData = api.project.getProjects.useQuery({ slug: currentTeam }, { enabled: isReady });

  const params = {
    team: currentTeam,
    startDate: startDateInput,
    endDate: endDateInput,
    page: pageNoInput || 1,
    pageSize: pageLimit || 10,
    ...(projectId ? { projectId: projectId } : {}) /* add projectId if exist */,
  };

  const { data: getAllocationsData, refetch: getAllocationsRefetch } = api.allocation.getAllocations.useQuery(params, {
    enabled: isReady,
  });

  let isError = false;

  const handleAllocationSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    projectAllocationData.length = 0;
    globalAllocationData.length = 0;

    getAllocationsRefetch(); /* refetch getAllocation useQuery */

    if (!getAllocationsData) {
      isError = !isError;
      return;
    }

    if (getAllocationsData[0].globalView) {
      setGlobalAllocationData(getAllocationsData as GlobalAllocation[]);
    } else {
      setProjectAllocationData(getAllocationsData as ProjectAllocation[]);
    }
  };

  if (isError) {
    return <p>Error...</p>;
  }

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

        <h2 className="mb-3 mt-10">Allocation Data</h2>
        <form className="my-5" onSubmit={handleAllocationSubmit}>
          <div className="inline">
            <label htmlFor="startDate" className="text-m mb-2 mr-2 font-bold text-gray-700">
              Start Date
            </label>
            <input
              id="startDate"
              className="rounded-md py-1"
              value={startDateInput.toISOString().split("T")[0]}
              onChange={(e) => setStartDateInput(new Date(e.target.value))}
              type="date"
              placeholder="Start Date"
              autoComplete="off"
            />
          </div>

          <div className="ml-5 inline">
            <label htmlFor="endDate" className="text-m mb-2 mr-2 font-bold text-gray-700">
              End Date
            </label>
            <input
              id="endDate"
              className="rounded-md py-1"
              value={endDateInput.toISOString().split("T")[0]}
              onChange={(e) => setEndDateInput(new Date(e.target.value))}
              type="date"
              placeholder="End Date"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="project-list" className="text-m mb-2 mr-2 font-bold text-gray-700">
              Project
            </label>
            <select id="project-list" onChange={(e) => setProjectIdInput(Number(e.target.value))}>
              <option key={0} value={0}>
                Global
              </option>
              {projectData.data?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inline">
            <label htmlFor="pageno" className="text-m mb-2 mr-2 font-bold text-gray-700">
              Page No.
            </label>
            <input
              id="pageno"
              className="rounded-md py-1"
              value={pageNoInput}
              onChange={(e) => setPageNoInput(Number(e.target.value))}
              type="text"
              placeholder="Page no."
              autoComplete="off"
            />
          </div>

          <div className="ml-5 inline">
            <label htmlFor="pageLimit" className="text-m mb-2 mr-2 font-bold text-gray-700">
              Page limit
            </label>
            <input
              id="pageLimit"
              className="rounded-md py-1"
              value={pageLimit}
              onChange={(e) => setPageLimitInput(Number(e.target.value))}
              type="text"
              placeholder="Page limit"
              autoComplete="off"
            />
          </div>

          <div className="mt-5">
            <button className="rounded bg-blue-500 px-5 py-2 font-bold text-white">Enter</button>
          </div>
        </form>

        <h3 className="my-5">Report</h3>
        <ul className="text-grey-700 font-bold">
          <li className="text-blue-600">{projectAllocationData.length ? "Project allocation" : "Global allocation"}</li>

          {/* project allocation */}
          {!!projectAllocationData.length &&
            projectAllocationData.map((data) => (
              <li key={data.projectId}>
                Client name: {data.clientName} <br />
                project name: {data.projectName} <br />
                Users:{" "}
                <ul className="ml-10 text-gray-600">
                  {data.users?.map((user) => (
                    <li key={user.userId}>
                      User name: {user.userName} <br />
                      User avatar:{" "}
                      <Image
                        width={20}
                        height={20}
                        className="ml-2 inline rounded-full"
                        src={user.userAvatar}
                        alt="avatar"
                      />{" "}
                      <br />
                      Average hours: {user.averageTime / 60 || 0} <br />
                      Total allocations hours: {user.totalTime / 60 || 0} <br />
                      Allocations:
                      <table className="ml-10 font-normal">
                        <tr>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Date
                          </th>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Billable time
                          </th>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Non billable time
                          </th>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Total time
                          </th>
                        </tr>
                        {Object.keys(user.allocations)?.map((allocationDate) => (
                          <tr key={allocationDate}>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {allocationDate}
                            </td>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {user.allocations[allocationDate].billableTime / 60 || 0}
                            </td>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {user.allocations[allocationDate].nonBillableTime / 60 || 0}
                            </td>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {user.allocations[allocationDate].totalTime / 60 || 0}
                            </td>
                            <br />
                          </tr>
                        ))}
                      </table>
                      <br />
                    </li>
                  ))}
                </ul>
                <br />
              </li>
            ))}

          {/* global allocation */}
          {!!globalAllocationData.length &&
            globalAllocationData.map((user) => (
              <li key={user.userId}>
                User name: {user.userName} <br />
                User avatar:{" "}
                <Image
                  width={20}
                  height={20}
                  className="ml-2 inline rounded-full"
                  src={user.userAvatar}
                  alt="avatar"
                />{" "}
                <br />
                Average hours: {user.averageTime / 60} <br />
                Total hours: {user.totalTime / 60} <br />
                TopRowDates:
                <table className="ml-10 text-gray-600">
                  <tr>
                    <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>Date</th>
                    <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                      Billable time
                    </th>
                    <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                      Non billable time
                    </th>
                    <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                      Total time
                    </th>
                  </tr>
                  {user.cumulativeProjectDates &&
                    Object.keys(user.cumulativeProjectDates)?.map((allocationDate) => (
                      <tr key={allocationDate}>
                        <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                          {allocationDate}
                        </td>
                        <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                          {user.cumulativeProjectDates[allocationDate].billableTime / 60 || 0}
                        </td>
                        <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                          {user.cumulativeProjectDates[allocationDate].nonBillableTime / 60 || 0}
                        </td>
                        <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                          {user.cumulativeProjectDates[allocationDate].totalTime / 60 || 0}
                        </td>
                        <br />
                      </tr>
                    ))}
                </table>
                Projects:
                <ul className="ml-10 text-gray-600">
                  {user.projects?.map((project) => (
                    <li key={project.projectId}>
                      Client name: {project.clientName} <br />
                      Project name: {project.projectName} <br />
                      Total time: {project.totalTime / 60 || 0} <br />
                      Allocation Date:
                      <table className="ml-10 text-gray-600">
                        <tr>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Date
                          </th>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Billable time
                          </th>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Non billable time
                          </th>
                          <th style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                            Total time
                          </th>
                        </tr>
                        {Object.keys(project.allocations)?.map((allocationDate) => (
                          <tr key={allocationDate}>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {allocationDate}
                            </td>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {project.allocations[allocationDate].billableTime / 60 || 0}
                            </td>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {project.allocations[allocationDate].nonBillableTime / 60 || 0}
                            </td>
                            <td style={{ border: "1px solid black", borderCollapse: "collapse", padding: "0 10px" }}>
                              {project.allocations[allocationDate].totalTime / 60 || 0}
                            </td>
                            <br />
                          </tr>
                        ))}
                      </table>
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
