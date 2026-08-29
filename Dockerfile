# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application (Vite build + esbuild server)
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package.json for starting the server
COPY package.json ./

# Only install production dependencies
RUN npm install --omit=dev

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose Cloud Run default port
EXPOSE 8080
ENV PORT=8080

# Start the application using the compiled server
CMD ["node", "dist/server.cjs"]
