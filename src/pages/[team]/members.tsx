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
import { User } from "lucide-react";

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
      {/* align vertically center */}
      <div className="flex w-full flex-1 flex-col">
        <DashboardShell>
          <DashboardHeader heading="Members" text="A list of all the users in your account.">
            <Button type="button">
              <User className="mr-2 h-4 w-4" />
              Add member
            </Button>
          </DashboardHeader>
        </DashboardShell>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Timezone
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
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
                          <div className="font-medium ">{person.name}</div>
                          <div>{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div>{person.timezone}</div>
                      <div>Member since {person.createdAt.toLocaleDateString()}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#">
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
