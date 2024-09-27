FROM node:16.10-slim

WORKDIR /app

COPY . /app
RUN npm ci
RUN npm run build
