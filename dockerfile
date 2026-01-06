# Use the stable Node 20 slim image
FROM node:20-slim

# Install git and essential build tools for native dependencies
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json ./

# Install dependencies using legacy-peer-deps to handle Rspack conflicts
# This allows the git+https downloads to work
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Expose the port (Koyeb usually defaults to 8080 or the PORT env var)
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
