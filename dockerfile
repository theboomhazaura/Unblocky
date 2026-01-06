FROM node:20-slim

# Install minimal build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
# This is the critical line that will now succeed
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]
