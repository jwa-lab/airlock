FROM node:14-alpine

RUN adduser -D airlock
USER airlock

WORKDIR /app

COPY protos ./protos
COPY src ./src
COPY package.json .
COPY LICENSE .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]

EXPOSE 50051