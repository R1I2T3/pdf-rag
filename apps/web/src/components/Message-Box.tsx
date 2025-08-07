import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Message } from "@/type";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User } from "lucide-react";
import Markdown from "./Markdown";
const MessageBox = ({
  message,
  isLoading,
  messageLength,
  messages,
}: {
  message: Message;
  isLoading: boolean;
  messageLength: number;
  messages: Message[];
}) => {
  return (
    <div
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
        className={`max-w-[60%] ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <CardContent>
          <div className="text-sm whitespace-pre-wrap">
            <Markdown>{message.content}</Markdown>
            {isLoading && message.id === messages[messageLength - 1].id && (
              <span className="animate-pulse">▍</span>
            )}
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
  );
};

export default MessageBox;
