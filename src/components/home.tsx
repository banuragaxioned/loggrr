"use client"

import React, { useEffect } from 'react';
import { DashboardShell } from "@/components/ui/shell";
import { DashboardHeader } from "@/components/ui/header";
import Link from "next/link";
import { useCurrentUserStore } from "@/store/currentuserstore";
import { CurrentUserProps } from '@/types';

type HomeProps = {
  user: CurrentUserProps
}

export default function Home({ user }: HomeProps) {
  const [currentUser, fetchUser] = useCurrentUserStore(state => [state.currentUser, state.setCurrentUser])

  useEffect(() => {
    if(!currentUser) fetchUser(user) 
  }, [currentUser, user])

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Your teams"
        text="This is your launchpad 🚀. Select a team to get started."
      ></DashboardHeader>
      <div>
        <div className="container flex flex-col items-center justify-center gap-12">
          <h2>
            Welcome back, <span>{user?.name}</span> 👋
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {user?.tenants.map((team) => (
              <Link
                className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
                href={"launchpad/" + team.slug}
                key={team.id}
              >
                <h3>{team.name}</h3>
                <div className="text-lg">
                  The application lives here. Right now, its only layouts and static components.
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}