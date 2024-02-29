"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { ChevronDown, Loader, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

type AINotepadProps = {
  getInput: (arg0: string) => void;
  loading: boolean;
};

export default function AINotepad({ getInput, loading }: AINotepadProps) {
  const [textInput, setTextInput] = useState<string>("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);

  const handleChange = (e: { target: { value: string } }) => {
    setTextInput(e.target.value);
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    getInput(textInput);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, isUser: true }]);
    const response = await getInput(input);
    setMessages([...messages, { text: response, isUser: false }]);
    setInput("");
  };

  return (
    <Card className="col-span-12 overflow-hidden shadow-none sm:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="w-auto text-sm font-medium text-muted-foreground">Notebook</p>
        <div className="flex flex-row items-center justify-between gap-3">
          <Loader className={`h-5 w-5 text-blue-500 ${loading ? "animate-spin" : ""}`} />
          <ChevronDown className="h-5 w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleClick} className="flex flex-col">
          <Textarea
            value={textInput}
            onChange={handleChange}
            rows={10}
            placeholder="Today xyz 4.5hr Billable need to work on home page prototype xyz 3.5hr work on ticket-123"
            className="rounded-0 resize-none border-0 bg-transparent px-0 outline-0 ring-0 placeholder:opacity-70 focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="align-center flex items-center">
            <Button className={`w-max ${loading ? "disabled" : ""}`} disabled={loading} type="submit">
              Submit
            </Button>
            {/* <Sparkles className={` ms-3 h-8 w-8 animate-pulse text-blue-500 ${loading ? "block" : "hidden"}`} /> */}
          </div>
        </form>
        <div>
          <div>
            {messages.map((msg, index) => (
              <div key={index} className={msg?.isUser ? "user-message" : "ai-message"}>
                {msg?.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </CardContent>
    </Card>
  );
}
