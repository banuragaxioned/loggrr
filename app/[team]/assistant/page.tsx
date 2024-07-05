"use client";

import { useState } from "react";
import { ClientMessage } from "@/app/_actions/ai-action";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Assistant() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  const promptMessages = [
    {
      heading: "How much time",
      subheading: "did I log yesterday?",
      message: `How much time did I log yesterday?`,
    },
    {
      heading: "How much billable time",
      subheading: "did I log this week?",
      message: `How much billable time did I log this week?`,
    },
    {
      heading: "How much non-billable time",
      subheading: "did we all log last month",
      message: "How much non-billable time did we all log last month?",
    },
  ];

  return (
    <div>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {conversation.length === 0 &&
          promptMessages.map((prompt, index) => (
            <div
              key={prompt.heading}
              className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                index > 1 && "hidden md:block"
              }`}
              onClick={async () => {
                setConversation((currentConversation: ClientMessage[]) => [
                  ...currentConversation,
                  {
                    id: generateId(),
                    role: "user",
                    display: prompt.message,
                  },
                ]);

                const responseMessage = await continueConversation(prompt.message);

                setConversation((currentConversation: ClientMessage[]) => [...currentConversation, responseMessage]);
              }}
            >
              <div className="text-sm font-semibold">{prompt.heading}</div>
              <div className="text-sm text-zinc-600">{prompt.subheading}</div>
            </div>
          ))}
      </div>
      <div className="flex gap-2 rounded-xl border px-2 py-2">
        <Input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={async () => {
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: generateId(), role: "user", display: input },
            ]);

            const message = await continueConversation(input);

            setConversation((currentConversation: ClientMessage[]) => [...currentConversation, message]);
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
