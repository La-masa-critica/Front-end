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

# Copy the built application from the previous stage
COPY --from=build /app/dist/my-project /usr/share/nginx/html

# Add the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
