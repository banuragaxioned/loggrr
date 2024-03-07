"use client";

import { useState } from "react";
import { Check, Clipboard, ListRestart, Loader2, Slack } from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type AINotepadProps = {
  notebookSubmitHandler: (input: string) => void;
  aiLoading: boolean;
  aiInput: string;
  setAiInput: (input: string) => void;
};

export default function AINotepad({ notebookSubmitHandler, aiInput, setAiInput, aiLoading }: AINotepadProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (!aiInput.trim()) return;

    navigator.clipboard.writeText(aiInput);
    setIsCopied(true);
    toast("Text copied to clipboard!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <Card className="overflow-hidden p-0 shadow-none">
      <Accordion type="single" className="w-full" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="p-4 hover:no-underline" tabIndex={-1}>
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <p className="text-sm font-medium text-muted-foreground">Notebook</p>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="px-4 py-1">
              <form
                onSubmit={(e) => {
                  if (aiLoading || !aiInput.trim()) return;
                  e.preventDefault();
                  notebookSubmitHandler(aiInput);
                  localStorage.removeItem("notebook-input");
                }}
                className="flex flex-col gap-4"
              >
                <Textarea
                  value={aiInput}
                  onChange={(e) => {
                    setAiInput(e.target.value);
                    localStorage.setItem("notebook-input", e.target.value);
                  }}
                  onKeyDown={(e) => {
                    const ctrlKey = e.ctrlKey || e.metaKey;
                    if (ctrlKey && e.key === "Enter" && aiInput.trim()) {
                      notebookSubmitHandler(aiInput);
                      localStorage.removeItem("notebook-input");
                    }
                  }}
                  rows={8}
                  placeholder="2.5hours Project, Milestone, Task, Comment, Billable."
                  className="resize-none"
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" disabled>
                      <Slack size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Copy to clipboard"
                      disabled={!aiInput.trim()}
                      onClick={copyToClipboard}
                    >
                      {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={!aiInput.trim()}
                      title="Clear"
                      onClick={() => {
                        setAiInput("");
                        localStorage.removeItem("notebook-input");
                      }}
                    >
                      <ListRestart size={16} />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={aiLoading || !aiInput.trim()}
                    title="Submit - (Ctrl/Cmd + Enter)"
                  >
                    Submit
                    {aiLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <span className="dark:grayscale dark:invert">✨</span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
