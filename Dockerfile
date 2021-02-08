FROM node:14-alpine

USER node

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