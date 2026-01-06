FROM node:20-slim

# Install git and build tools
RUN apt-get update && apt-get install -y git python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# NEW STEP: Manually build the transport modules if they didn't come with a 'dist' folder
RUN cd node_modules/@mercuryworkshop/epoxy-transport && npm install && npm run build || true
RUN cd node_modules/@mercuryworkshop/libcurl-transport && npm install && npm run build || true

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
