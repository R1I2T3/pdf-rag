import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    const data = JSON.parse(job.data);
    const loader = new PDFLoader(data.filePath);
    const docs = await loader.load();
    const embeddingModel = new GoogleGenerativeAIEmbeddings({
      model: "models/gemini-embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });
    const vectorStore = new QdrantVectorStore(embeddingModel, {
      collectionName: "pdf-embeddings",
      url: "http://localhost:6333",
    });
    await vectorStore.addDocuments(docs);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    concurrency: 30,
  }
);
