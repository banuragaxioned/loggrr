import Unavailable from "@/components/unavailable";
import { useValidateTeamAccess } from "@/hooks/useTeam";
import { api } from "@/utils/api";
import { getInitials } from "@/utils/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";

export default function Members() {
  const { isLoading, isInvalid, isReady, slug } = useValidateTeamAccess();
  const { data: memberData, refetch: refetchMembers } = api.tenant.getTeamMembers.useQuery(
    { slug: slug },
    { enabled: isReady }
  );

  const emailInputRef = useRef<HTMLInputElement>(null);
  const connectUserToTenantMutation = api.tenant.connectUserToTenant.useMutation({
    onSuccess: (data) => {
      refetchMembers();
    },
  });
  const addMemberHandler = () => {
    if (emailInputRef?.current?.value === undefined) return;

    const newMember = connectUserToTenantMutation.mutate({
      email: emailInputRef.current.value,
      tenant: slug,
    });

    return newMember;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isInvalid) {
    return <Unavailable />;
  }
  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 lg:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2>Members</h2>
          <p className="mt-2 text-sm text-gray-700">A list of all the users in your account.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button type="button">Add user</Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Timezone
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {memberData?.Users.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                          <Avatar>
                            <AvatarImage src={person.image ?? ""} alt={person.name ?? ""} />
                            <AvatarFallback>{getInitials(person.name ?? "Loggr User")}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{person.name}</div>
                          <div className="text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="text-gray-900">{person.timezone}</div>
                      <div className="text-gray-500">Member since {person.createdAt.toLocaleDateString()}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h3>Add members</h3>
        <Input placeholder="Email" type="text" ref={emailInputRef} />
        <Button onClick={addMemberHandler}>Add member</Button>
      </div>
    </div>
  );
}
