# Use Node.js 18 (Debian-based for better Prisma compatibility)
FROM node:18-slim

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/

# Copy Prisma schema first (needed for prisma generate during install)
COPY packages/server/prisma ./packages/server/prisma

# Install dependencies (this will run prisma generate as postinstall)
RUN npm install

# Copy source code
COPY . .

# Regenerate Prisma Client to ensure compatibility with current system
RUN cd packages/server && npx prisma generate

# Build client and server
RUN npm run build -w packages/client
RUN npm run build -w packages/server

# Expose port
EXPOSE 3000

# Start command
CMD cd packages/server && npx prisma db push --accept-data-loss && node dist/index.js

