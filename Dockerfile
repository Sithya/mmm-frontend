FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files (or mount in docker-compose)
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]

