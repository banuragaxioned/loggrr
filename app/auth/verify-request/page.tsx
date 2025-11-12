import { Metadata } from "next";
import { MailCheck, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Check your email",
  description: "A sign in link has been sent to your email address.",
};

export default async function VerifyRequest() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        {/* Animated Email Icon */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Main icon */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-background">
              <MailCheck className="h-10 w-10 text-primary" />
            </div>

            {/* Sparkle decorations */}
            <Sparkles className="absolute -bottom-2 -right-2 h-5 w-5 text-primary/80" />
            <Sparkles className="absolute -left-2 -top-1 h-4 w-4 text-primary/80" />
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-base">A sign in link has been sent to your email address</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">What&apos;s next?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    1
                  </span>
                  <span>Check your email inbox for a message from Loggrr</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    2
                  </span>
                  <span>Click the magic link to sign in securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    3
                  </span>
                  <span>You&apos;ll be redirected automatically to Loggrr</span>
                </li>
              </ol>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 border-t pt-4">
              <p className="text-center text-sm text-muted-foreground">
                The link will expire in <span className="font-semibold text-foreground">10 minutes</span>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                If you don&apos;t see the email, check your spam folder
              </p>
            </div>

            {/* Back Button */}
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Help */}
        <p className="px-4 text-center text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="mailto:loggr@axioned.com" className="font-medium text-primary underline-offset-4 hover:underline">
            Contact support
          </Link>
        </p>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
}
