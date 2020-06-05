FROM node:14 AS compile

WORKDIR /swapchain

COPY . .

RUN npm install
RUN npm run build

FROM node:14-alpine3.10

WORKDIR /swapchain

COPY package.json .
COPY --from=compile /swapchain/dist/srv/bitcoin/timelockBackend ./srv/bitcoin/timelockBackend/
RUN npm install --only=production


CMD ["node", "./srv/bitcoin/timelockBackend/index.js"]