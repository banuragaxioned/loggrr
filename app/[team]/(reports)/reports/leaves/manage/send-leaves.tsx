"use client";

import { Leaves } from "@/components/forms/leaveForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const SendLeaves = ({ team, leaves }: { team: string; leaves: Leaves[] }) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    setUploading(true);

    try {
      const response = await fetch(`/api/team/leaves/send`, {
        method: "POST",
        body: JSON.stringify({
          slug: team,
          leaves,
        }),
      });
      const data = await response.json();

      if (data.unsentEmails.length > 0) {
        console.log("Unsent emails", data.unsentEmails);
      }

      if (!response.ok) {
        toast.error("Failed to send leaves", { description: data.error });
        return;
      }

      if (response.ok) {
        setSuccess(true);
        toast.success(data.message);
        return;
      }
    } catch (error) {
      toast.error("Failed to send leaves", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={uploading || success}>
            Send Leaves
            {!uploading && !success && <Mail className="ml-1 h-4 w-4 stroke-current" />}
            {uploading && !success && <Loader2 className="ml-1 h-4 w-4 animate-spin stroke-current" />}
            {!uploading && success && <Check className="ml-1 h-4 w-4 stroke-current" />}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to send the leaves emails? This action cannot be undone and an email will be sent to
              all users listed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" asChild>
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button type="button" size="sm" onClick={handleUpload} asChild>
              <DialogClose>Send Emails</DialogClose>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendLeaves;
