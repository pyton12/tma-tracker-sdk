# Use Node.js 18
FROM node:18-alpine

# Install OpenSSL and other dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN cd packages/server && npx prisma generate

# Build client and server
RUN npm run build -w packages/client
RUN npm run build -w packages/server

# Expose port
EXPOSE 3000

# Start command
CMD cd packages/server && npx prisma db push --accept-data-loss && node dist/index.js

