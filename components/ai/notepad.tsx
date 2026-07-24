"use client";

import { useEffect, useState } from "react";
import { Check, Clipboard, ListRestart, Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import Cookie from "js-cookie";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type AINotepadProps = {
  notebookSubmitHandler: (input: string) => void;
  aiLoading: boolean;
  aiInput: string;
  setAiInput: (input: string) => void;
  /** card = classic accordion card; inline = flat strip for board form */
  variant?: "card" | "inline";
  /** When false, accordion starts collapsed (board aside). Default true for classic. */
  defaultOpen?: boolean;
  /** Shorter textarea for constrained sidebars */
  compact?: boolean;
};

declare global {
  interface Window {
    speechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AINotepad({
  notebookSubmitHandler,
  aiInput,
  setAiInput,
  aiLoading,
  variant = "card",
  defaultOpen = true,
  compact = false,
}: AINotepadProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingSupported, setIsRecordingSupported] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const voiceError = Cookie.get("speech");

  const setVoiceErrorCookie = () => {
    Cookie.set("speech", "error", { expires: 30 });
  };

  const copyToClipboard = () => {
    if (!aiInput.trim()) return;

    navigator.clipboard.writeText(aiInput);
    setIsCopied(true);
    toast("Text copied to clipboard!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (errorCount >= 2) {
      setVoiceErrorCookie();
    }

    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const microphone = SpeechRecognition && new SpeechRecognition();

    if (!microphone) {
      setIsRecordingSupported(false);

      if (isRecording) toast.error("Speech recognition not supported");
      setIsRecording(false);
      return;
    }

    microphone.interimResults = true;
    microphone.lang = "en-US";

    const startRecordController = () => {
      if (isRecording) {
        microphone.start();
        microphone.onend = () => {
          microphone.stop();
          setIsRecording(false);
        };
        microphone.onerror = (event: any) => {
          console.error("Error: " + event.error);
          if (event.error === "network") setErrorCount((prev) => prev + 1);
          if (event.error === "not-allowed") return toast.error("Microphone not allowed");
          if (event.error) return toast.error(`Error: ${event.error}`);
        };
      }

      microphone.onresult = (event: any) => {
        const recordingResult = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        const voiceText = aiInput + recordingResult + " ";
        setAiInput(voiceText);
        localStorage.setItem("notebook-input", voiceText);
      };
    };

    startRecordController();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  useEffect(() => {
    if (voiceError === "error") setIsRecordingSupported(false);
  }, [voiceError]);

  const form = (
    <form
      onSubmit={(e) => {
        if (aiLoading || !aiInput.trim()) return;
        e.preventDefault();
        notebookSubmitHandler(aiInput);
      }}
      className={cn("flex flex-col", variant === "inline" || compact ? "gap-2" : "gap-4")}
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
          }
        }}
        rows={variant === "inline" || compact ? 3 : 8}
        placeholder="Fixed and deployed on LOG-8 - 2h"
        className={cn(
          "resize-none",
          (variant === "inline" || compact) && "min-h-[4.5rem] text-sm",
          variant === "inline" && "bg-transparent shadow-none",
        )}
      />
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isRecordingSupported && (
            <Button
              type="button"
              onClick={() => setIsRecording((prevState) => !prevState)}
              size="icon"
              variant="outline"
              className={cn("relative", (variant === "inline" || compact) && "h-8 w-8")}
              title="Start voice typing"
            >
              {isRecording && (
                <>
                  <span className="bg-muted-foreground absolute -top-1 -right-1 h-2.5 w-2.5 animate-ping rounded-full" />
                  <span className="bg-muted-foreground absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full" />
                </>
              )}
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Copy to clipboard"
            disabled={!aiInput.trim()}
            onClick={copyToClipboard}
            className={cn((variant === "inline" || compact) && "h-8 w-8")}
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
            className={cn((variant === "inline" || compact) && "h-8 w-8")}
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
          {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <span className="dark:grayscale dark:invert">✨</span>}
        </Button>
      </div>
    </form>
  );

  if (variant === "inline") {
    return (
      <div className="border-t px-3 py-2 sm:px-4">
        <p className="text-muted-foreground pb-1.5 text-[10px] font-semibold tracking-wide uppercase">Notebook</p>
        {form}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden p-0 shadow-none">
      <Accordion
        type="single"
        className="w-full"
        collapsible
        defaultValue={defaultOpen ? "item-1" : undefined}
      >
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className={cn("hover:no-underline", compact ? "px-3 py-2.5" : "p-4")} tabIndex={-1}>
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <p className="text-muted-foreground text-sm font-medium">Notebook</p>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent className={cn(compact && "!h-auto pb-0")}>
            {/* pt so textarea border isn't clipped by accordion overflow-hidden */}
            <CardContent className={cn(compact ? "px-3 pt-1.5 pb-3" : "px-4 pt-1 pb-1")}>{form}</CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
