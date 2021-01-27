FROM node:14

RUN npm install

RUN docker-compose up
CMD ["node", "/tests/mocks/mockServices.ts"]
RUN npm run dev
RUN npm run test
