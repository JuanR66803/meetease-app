FROM node:22-alpine

WORKDIR /meetEase-backend

COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
