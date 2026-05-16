# Stage 1: Build the Angular application
FROM node:18-alpine AS build
WORKDIR /app

# Copy configuration files first to optimize layer caching
COPY package.json angular.json tsconfig.json tsconfig.app.json ./

# Install project dependencies
RUN npm install

# Copy the source code directory explicitly
COPY src/ ./src/

# Compile the production application assets
RUN npm run build -- --configuration=production

# Stage 2: Serve compiled assets using a standalone web server
FROM node:18-alpine
WORKDIR /app

# Install lightweight static file web server globally
RUN npm install -g http-server

# Copy compiled distribution assets across from the build layer stage
COPY --from=build /app/dist/scholarship-frontend/browser ./public

EXPOSE 4200

# Execute server configuration targeting SPA routing configurations on port 4200
CMD ["http-server", "./public", "-p", "4200", "--proxy", "http://localhost:4200?"]
