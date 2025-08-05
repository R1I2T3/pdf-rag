import "dotenv/config";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { Queue } from "bullmq";
import { upload } from "./lib/multer";
import { chain } from "./lib/model-config";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createUIMessageStreamResponse } from "ai";
import type { UIMessage } from "ai";
export const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.post("/api/upload/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  // const session = await auth.api.getSession({
  //   headers: fromNodeHeaders(req.headers),
  // });
  // if (!session) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  await queue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.filename,
      destination: req.file.destination,
      path: req.file.path,
    })
  );
  return res.json({ message: "uploaded" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const {
      messages,
    }: {
      messages: UIMessage[];
    } = req.body;
    console.log(messages);
    const stream = await chain.stream(
      messages.map((message) =>
        message.role == "user"
          ? new HumanMessage(
              message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")
            )
          : new AIMessage(
              message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")
            )
      )
    );
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    console.log("Error in /api/chat:", error);
    res.end(`data: ${JSON.stringify({ error: "An error occurred." })}\n\n`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
