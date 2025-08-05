import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { QDRANT_CONFIG, embeddingModel } from "../worker";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});

export const vectorStore = new QdrantVectorStore(embeddingModel, QDRANT_CONFIG);
const retriever = vectorStore.asRetriever({
  k: 4,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant. Your task is to answer the user's query based on the context provided.
If the context does not contain the answer, simply state that you don't have enough information. Do not try to make up an answer.

Context:
{context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  ["human", "{question}"],
]);

export const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);
