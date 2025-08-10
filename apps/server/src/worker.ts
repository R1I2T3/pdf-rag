import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import path from "path";
import "dotenv/config";

const UPLOADS_DIR = "uploads/";
const REDIS_CONNECTION = {
  host: "localhost",
  port: 6379,
};
export const QDRANT_CONFIG = {
  collectionName: "pdf-embeddings",
  url: "http://localhost:6333",
};

export const embeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
});

const vectorStore = new QdrantVectorStore(embeddingModel, QDRANT_CONFIG);

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    const { filename } = JSON.parse(job.data);
    try {
      if (
        !filename ||
        typeof filename !== "string" ||
        filename.includes("..")
      ) {
        throw new Error(`Invalid filename received: ${filename}`);
      }
      const safeFilePath = path.join(UPLOADS_DIR, filename);
      if (!safeFilePath.startsWith(UPLOADS_DIR)) {
        throw new Error(
          `Path traversal attempt detected for filename: ${filename}`
        );
      }
      let loader;
      if (safeFilePath.endsWith(".pdf")) {
        loader = new PDFLoader(safeFilePath);
      } else if (safeFilePath.endsWith(".csv")) {
        loader = new CSVLoader(safeFilePath);
      } else if (
        safeFilePath.endsWith(".docx") ||
        safeFilePath.endsWith(".doc")
      ) {
        loader = new DocxLoader(safeFilePath, {
          type: safeFilePath.endsWith(".doc") ? "doc" : "docx",
        });
      } else if (safeFilePath.endsWith(".pptx")) {
        loader = new PPTXLoader(safeFilePath);
      } else {
        throw new Error(`Unsupported file type: ${filename}`);
      }

      const docs = await loader.load();
      if (docs.length === 0) {
        console.warn(
          `Job ${job.id}: No documents were extracted from ${filename}.`
        );
        return;
      }
      const BATCH_SIZE = 500;
      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);
        await vectorStore.addDocuments(batch);
      }

      console.log(
        `Job ${job.id}: Successfully processed and vectorized ${filename}.`
      );
    } catch (error) {
      console.error(`Job ${job.id} failed with error:`, error);
      throw error;
    }
  },
  {
    connection: REDIS_CONNECTION,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job} has failed with ${err}`);
});
