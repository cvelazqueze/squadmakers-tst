# Use Node.js LTS version
FROM node:18-alpine

# Install build dependencies for native modules (sqlite3) and curl for healthcheck
RUN apk add --no-cache python3 make g++ curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for building native modules)
RUN npm ci

# Copy application files
COPY . .

# Create directory for database
RUN mkdir -p /app/database

# Create directory for logs
RUN mkdir -p /app/logs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/database/jokes.db

# Start the application
CMD ["node", "src/index.js"]
