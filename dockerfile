# Use the official lightweight Node image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy only the package.json (no lockfile needed!)
COPY package.json ./

# Install dependencies normally (bypasses the 'npm ci' error)
# ... (previous lines)

# Install dependencies and ignore peer conflicts
RUN npm install --legacy-peer-deps

# ... (rest of your files)

# Copy the rest of your files
COPY . .

# Expose the port your server uses
EXPOSE 8080

# The command to start your app
CMD ["node", "server.js"]
