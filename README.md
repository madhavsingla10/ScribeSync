# ScribeSync

ScribeSync is an AI-powered tool that transforms hand-drawn whiteboard sketches of software architectures or database schemas into production-ready code. Powered by Google Gemini Vision and built for Google Cloud Run.

## Features
- **Visual Diagram:** Auto-generates a Mermaid.js diagram from your sketch.
- **Prisma Schema:** Generates a production-ready Prisma schema.
- **SQL Migration:** Provides executable PostgreSQL DDL scripts.
- **API Spec:** Suggests REST/tRPC endpoints based on the identified entities.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Lucide React, Motion
- Backend: Express, Google GenAI SDK (`@google/genai`)
- Deployment: Docker, Google Cloud Run

## Local Development Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables:**
   Create a \`.env\` file in the root directory and add your Gemini API key:
   \`\`\`env
   GEMINI_API_KEY="your_gemini_api_key_here"
   \`\`\`

3. **Run the Python Gradio Backend (Optional / Python mode):**
   ```bash
   pip install -r requirements.txt
   python backend.py
   ```
   The Gradio API server will run at `http://localhost:7860`.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Building for Production

1. **Build the application:**
   \`\`\`bash
   npm run build
   \`\`\`
   This will compile both the Vite frontend and the Express backend into the \`dist\` folder.

2. **Start the production server:**
   \`\`\`bash
   npm start
   \`\`\`

## Deployment to Google Cloud Run

This project includes a multi-stage \`Dockerfile\` optimized for Google Cloud Run.

1. **Build the Docker image:**
   \`\`\`bash
   docker build -t scribesync .
   \`\`\`

2. **Run the Docker image locally (optional testing):**
   \`\`\`bash
   docker run -p 8080:8080 -e GEMINI_API_KEY="your_key" scribesync
   \`\`\`

3. **Deploy to Cloud Run via gcloud:**
   \`\`\`bash
   gcloud run deploy scribesync \
     --source . \
     --port 8080 \
     --set-env-vars GEMINI_API_KEY="your_api_key" \
     --allow-unauthenticated
   \`\`\`
