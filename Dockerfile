FROM node:alpine
WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY ./.dist/ ./

EXPOSE 3000
CMD [ "node", "app.js" ]