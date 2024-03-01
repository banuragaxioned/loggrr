"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { Clipboard, Loader2, Slack, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

type AINotepadProps = {
  notebookSubmitHandler: (input: string) => void;
  aiLoading: boolean;
  aiInput: string;
  setAiInput: (input: string) => void;
};

export default function AINotepad({ notebookSubmitHandler, aiInput, setAiInput, aiLoading }: AINotepadProps) {
  return (
    <Card className="overflow-hidden p-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <p className="text-sm font-medium text-muted-foreground">Notebook</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <form
          onSubmit={(e) => {
            if (aiLoading || !aiInput.trim()) return;
            e.preventDefault();
            notebookSubmitHandler(aiInput);
          }}
          className="flex flex-col gap-4"
        >
          <Textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            rows={8}
            placeholder="Today xyz 4.5hr Billable need to work on home page prototype xyz 3.5hr work on ticket-123"
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" disabled>
                <Slack size={16} />
              </Button>
              <Button type="button" variant="outline" size="icon" title="Copy to clipboard">
                <Clipboard size={16} />
              </Button>
            </div>
            <Button size="sm" type="submit" className="flex items-center gap-2" disabled={aiLoading || !aiInput.trim()}>
              Submit
              {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
