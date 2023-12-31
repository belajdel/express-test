# Use an official Node.js runtime as the base image
FROM node:21.3-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the Node.js application will run (change it if needed)
EXPOSE 3000

# Specify the command to run the Node.js application
CMD [ "node", "app.js" ]