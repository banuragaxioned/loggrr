import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import React from "react";
import { ProfileForm } from "./profile";

const Manage = () => {
  return (
    <DashboardShell>
      <DashboardHeader heading="Manage"></DashboardHeader>
      <ProfileForm />
    </DashboardShell>
  );
};

export default Manage;
