FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --production

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD [ "node", "index.js" ]
