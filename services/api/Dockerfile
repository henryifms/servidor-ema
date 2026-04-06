FROM node:20-alpine

WORKDIR /app

RUN corepack enable

RUN apk add --no-cache postgresql-client

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000
