import { User } from "@/generated/prisma/browser";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helper";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  const initials = user.name ? getInitials(user.name) : "";

  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt={user.name ?? "Profile picture"} src={user.image} referrerPolicy="no-referrer" />
      ) : null}
      <AvatarFallback className="bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100">
        {initials ? (
          <span aria-hidden="true">{initials}</span>
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
        <span className="sr-only">{user.name ?? "User"}</span>
      </AvatarFallback>
    </Avatar>
  );
}
