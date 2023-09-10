# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY server/package*.json ./

# Install app dependencies
RUN yarn

# Copy the rest of the application code to the container
COPY server/ ./

# Expose the port your Node.js app will run on
EXPOSE 3001

# Start your Node.js app
CMD ["node", "src/index.ts"]
