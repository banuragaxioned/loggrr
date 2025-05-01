"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { type Session } from "../../../../../server/src/db/schema/auth";
import { getDeviceName } from "@/utils/ua-parser";

function SessionItem({ session, isCurrent }: { session: Session; isCurrent: boolean }) {
  return (
    <li className="p-3 rounded-md bg-secondary/50">
      <div className="flex items-center gap-2">
        <p className="font-medium">{getDeviceName(session.userAgent)}</p>
        {isCurrent && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Current</span>}
      </div>
      {session.ipAddress && <p className="text-sm text-muted-foreground">IP: {session.ipAddress}</p>}
      {session.createdAt && (
        <p className="text-sm text-muted-foreground">Created: {new Date(session.createdAt).toLocaleString()}</p>
      )}
      {session.expiresAt && (
        <p className="text-sm text-muted-foreground">Expires: {new Date(session.expiresAt).toLocaleString()}</p>
      )}
    </li>
  );
}

export function SessionsList() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    async function fetchSessions() {
      try {
        setLoading(true);

        // Get current session
        const currentSession = authClient.useSession();
        setCurrentSessionId(currentSession?.data?.session?.id || null);

        // Get all sessions
        const result = await authClient.listSessions();

        // Map the result to ensure it matches the Session type
        const sessionsData = Array.isArray(result) ? result : result?.data || [];
        const mappedSessions = sessionsData.map((s) => ({
          ...s,
          impersonatedBy: s.impersonatedBy ?? null,
          activeOrganizationId: s.activeOrganizationId ?? null,
          ipAddress: s.ipAddress ?? null,
          userAgent: s.userAgent ?? null,
        }));

        setSessions(mappedSessions);
      } catch (error) {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [session]);

  if (!session) {
    return <div className="text-sm text-muted-foreground">Not authenticated. Please sign in.</div>;
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading sessions...</div>;
  }

  return (
    <>
      <h2>Your Sessions</h2>

      {sessions.length > 0 ? (
        <ul className="space-y-3">
          {sessions.map((s, index) => (
            <SessionItem key={s.id || index} session={s} isCurrent={s.id === currentSessionId} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No active sessions found</p>
      )}
    </>
  );
}
