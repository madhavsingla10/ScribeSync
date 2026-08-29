import express from 'express';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
      if (!req.file && !req.body.mock) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      if (req.body.mock === 'true') {
        // Return mock data for the demo
        return res.json({
          title: "E-Commerce Microservices Architecture",
          summary: "A microservices-based e-commerce platform with separate services for users, products, and orders, communicating via REST and asynchronous events.",
          mermaidDiagram: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "included in"
    
    USER {
        string id PK
        string email
        string name
        datetime createdAt
    }
    
    PRODUCT {
        string id PK
        string name
        float price
        int stock
    }
    
    ORDER {
        string id PK
        string userId FK
        string status
        float total
        datetime createdAt
    }
    
    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        int quantity
    }`,
          prismaSchema: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  orders    Order[]
}

model Product {
  id          String      @id @default(uuid())
  name        String
  price       Float
  stock       Int         @default(0)
  orderItems  OrderItem[]
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  status    String      @default("PENDING")
  total     Float
  createdAt DateTime    @default(now())
  items     OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)
}`,
          sqlSchema: `CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`,
          endpoints: [
            { method: "POST", path: "/api/users", description: "Create a new user" },
            { method: "GET", path: "/api/users/:id", description: "Get user details and order history" },
            { method: "GET", path: "/api/products", description: "List available products" },
            { method: "POST", path: "/api/orders", description: "Place a new order" },
            { method: "GET", path: "/api/orders/:id", description: "Get order status" }
          ]
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      const mimeType = req.file.mimetype;
      const base64Data = req.file.buffer.toString('base64');

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: { parts: [imagePart, { text: "Analyze this hand-drawn sketch or whiteboard diagram." }] },
        config: {
          systemInstruction: "You are an elite Principal Software Architect. Inspect the hand-drawn sketch or whiteboard diagram. Identify all entities, fields, relationships (1:1, 1:N, N:M), and architectural components. Output clean, syntactically correct Mermaid, Prisma, and SQL schemas. Follow the schema exactly.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of the architecture" },
              summary: { type: Type.STRING, description: "A concise architecture overview" },
              mermaidDiagram: { type: Type.STRING, description: "Valid Mermaid.js classDiagram or erDiagram syntax" },
              prismaSchema: { type: Type.STRING, description: "Valid Prisma models" },
              sqlSchema: { type: Type.STRING, description: "Valid PostgreSQL CREATE TABLE DDL" },
              endpoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    method: { type: Type.STRING },
                    path: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["method", "path", "description"]
                },
                description: "Suggested REST/tRPC endpoints"
              }
            },
            required: ["title", "summary", "mermaidDiagram", "prismaSchema", "sqlSchema", "endpoints"]
          }
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from model");
      }

      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (error: any) {
      console.error('Error analyzing diagram:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze diagram' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
