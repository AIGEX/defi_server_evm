# Use Bun's official image (or node:20-alpine if needed)
FROM oven/bun:latest AS build

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Run the gRPC server
CMD ["bun", "run", "index.ts"]
