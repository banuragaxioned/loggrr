"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { authClient } from "@workspace/auth/client";
import { Mail } from "lucide-react";
import { useState } from "react";

export function MagicLinkSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) return;

    setIsLoading(true);
    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: "/dashboard",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isLoading || !email || !isValidEmail(email)}>
          <Mail className="w-4 h-4 mr-2" />
          {isLoading ? "Sending..." : "Login with Magic Link"}
        </Button>
      </form>
    </div>
  );
}
