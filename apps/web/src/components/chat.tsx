"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type * as React from "react";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { DefaultChatTransport } from "ai";
import { Send, Bot, User, Loader2, FileText } from "lucide-react";

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:3000/api/chat",
    }),
    messages: [],
  });

  const isLoading = false;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No messages yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Upload a PDF document and start asking questions about its
                content.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 max-w-md">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("What is this document about?")}
                className="text-xs"
              >
                What is this document about?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Summarize the main points")}
                className="text-xs"
              >
                Summarize the main points
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("What are the key findings?")}
                className="text-xs"
              >
                What are the key findings?
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="text-sm whitespace-pre-wrap">
                      {message.parts
                        .map((part) => (part.type === "text" ? part.text : ""))
                        .join("")}
                    </div>
                  </CardContent>
                </Card>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-secondary">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-t border-border/40">
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-3">
              <p className="text-sm text-destructive">Error: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-border/40 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              sendMessage({ text: input });
              setInput("");
            }
          }}
          className="flex gap-3"
        >
          <Input
            value={input}
            placeholder="Ask a question about your PDF..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
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
