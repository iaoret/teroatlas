FROM node:20-slim

WORKDIR /app/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 6435

CMD ["npm", "start"]
