FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Add these lines for permissions
RUN chown -R node:node /app
USER node

# Install dnd package first
RUN npm install @hello-pangea/dnd

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"] 