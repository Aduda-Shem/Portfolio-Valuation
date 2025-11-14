FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Clean install dependencies (ensures fresh install without React deps)
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy app files (excluding node_modules via .dockerignore)
COPY . .

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "start"]
