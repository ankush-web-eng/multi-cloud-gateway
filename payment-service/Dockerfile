FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["yarn", "dev"]
