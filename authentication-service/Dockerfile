FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
