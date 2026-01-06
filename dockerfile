FROM node:20-slim

# Install basic build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json ./

# Install with legacy-peer-deps to ignore version conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Set Port and Start
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]
