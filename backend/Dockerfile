FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY server ./server

# Expose the port
EXPOSE 3100

# Start the backend
CMD ["node", "server/index.js"]