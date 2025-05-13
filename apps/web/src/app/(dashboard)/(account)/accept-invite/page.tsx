"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const invitationId = searchParams.get("invitationId");

  useEffect(() => {
    async function handleInvitation() {
      if (!invitationId) {
        toast.error("No invitation ID provided");
        router.push("/dashboard");
        return;
      }

      if (!session) {
        const callbackUrl = `/accept-invite?invitationId=${invitationId}`;
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      try {
        await authClient.organization.acceptInvitation({ invitationId });
        toast.success("Successfully joined the organization!");
        router.push("/dashboard");
      } catch (err) {
        console.error("Error accepting invitation:", err);
        toast.error("This invitation is invalid or has expired");
        router.push("/dashboard");
      }
    }

    handleInvitation();
  }, [session, invitationId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="mt-4">Processing invitation...</p>
      </div>
    </div>
  );
}
