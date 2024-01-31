import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function JoinWatchlist() {
  return (
    <div className="mx-auto flex h-[30rem] w-full max-w-xl flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-center text-4xl">Join the waitlist</h1>
      <p className="text-center">
        We want to make time tracking and team collaboration &quot;syncing up&quot; simple. Whether you&apos;re an
        digital agency, work with freelancers, or need to track time for your own projects, we&apos;ve got you covered.
      </p>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="email" placeholder="hello@me.com" />
        <Button type="submit">Notify</Button>
      </div>
    </div>
  );
}
