import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function* streamChatMessage(userMessage: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to chat API");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (part.startsWith("data: ")) {
        const jsonStr = part.substring(6);
        if (jsonStr) {
          try {
            const data = JSON.parse(jsonStr);
            if (data.message) {
              yield data.message;
            } else if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            console.error("Failed to parse stream chunk:", jsonStr);
          }
        }
      }
    }
  }
}
