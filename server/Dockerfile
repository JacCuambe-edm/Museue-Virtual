# Dockerfile para o backend Express
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5050

CMD ["npm", "run", "dev"]
