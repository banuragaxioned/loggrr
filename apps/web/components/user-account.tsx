"use client";

import Link from "next/link";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import posthog from "posthog-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={{ name: user.name ?? null, image: user.image ?? null }} className="h-8 w-8 bg-slate-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && <p className="w-[200px] truncate text-sm text-zinc-600 dark:text-zinc-100">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/manage" className="block h-full w-full cursor-pointer">
            Manage
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onSelect={(event) => {
            event.preventDefault();
            posthog.reset();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
