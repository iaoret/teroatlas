FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM node:20 AS runner

RUN npm install -g http-server

COPY --from=builder /app/dist /app/dist

WORKDIR /app

EXPOSE 80

CMD ["http-server", "/app/dist", "-p", "80", "-a", "0.0.0.0"]
