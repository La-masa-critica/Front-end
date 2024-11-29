# Use the official Node.js image as the base image
FROM docker.io/node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy the rest of the application code, excluding files specified in .dockerignore
COPY . .

# Build the Angular application
RUN npm run build

# Use the official Nginx image to serve the application
FROM docker.io/nginx:alpine

# Set a working directory for scripts
WORKDIR /etc/nginx

# Copy the built application from the previous stage
COPY --from=build /app/dist/my-project /usr/share/nginx/html

# Copy the Nginx configuration template and the entrypoint script
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Set permissions for the entrypoint script
RUN chmod +x /docker-entrypoint.sh

# Expose port 80 for the frontend
EXPOSE 80

# Use the entrypoint script to start the container
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
