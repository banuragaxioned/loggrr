import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Loggr</title>
        <meta name="description" content="Loggr App" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex min-h-full flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1>Welcome to Loggr</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how to deploy it.
              </div>
            </Link>
          </div>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: myTeamData } = api.tenant.myTeams.useQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {myTeamData && (
        <span>
          <div className="container flex flex-col items-center justify-center gap-12">
            <h2>Welcome back, {sessionData && <span>{sessionData.user?.name}</span>} 👋</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              {myTeamData.map((team) => (
                <Link
                  key={team.id}
                  className="hover:bg-zinc/20 flex max-w-xs flex-col gap-4 rounded-xl bg-zinc-400/10 p-4  hover:bg-zinc-400/20"
                  href={team.slug}
                >
                  <h3>{team.name}</h3>
                  <div className="text-lg">
                    The application lives here. Right now, its only layouts and static components.
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </span>
      )}
      <button
        className="rounded-full bg-zinc-400/10 px-10 py-3 font-semibold  no-underline transition hover:bg-zinc-400/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
