FROM node:20-alpine

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Pre-compile the application to optimized static assets
RUN npm run build

# Expose Vite's default preview port
EXPOSE 5173

# Serve the static production build directly via Vite
CMD ["npm", "run", "preview"]