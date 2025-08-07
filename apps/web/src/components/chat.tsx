"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type * as React from "react";
import { useState } from "react";
import { Send, Bot, User, Loader2, FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import { streamChatMessage } from "@/lib/utils";
import type { Message } from "@/type";
import MessageBox from "./Message-Box";
import NoMessage from "./no-message";
const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);
    setInput("");
    try {
      for await (const chunk of streamChatMessage(userMessage.content)) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }
    } catch (err) {
      setError(err as Error);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <NoMessage setInput={setInput} />
        ) : (
          <div className="space-y-4 overflow-y-auto h-[66dvh] no-scrollbar">
            {messages.map((message) => (
              <MessageBox
                key={message.id}
                message={message}
                isLoading={isLoading}
                messageLength={messages.length}
                messages={messages}
              />
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="p-4 border-t border-border/40">
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-3">
              <p className="text-sm text-destructive">Error: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="p-6 border-t border-border/40 bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            value={input}
            placeholder="Ask a question about your PDF..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 py-2"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
